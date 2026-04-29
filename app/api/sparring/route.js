// ─── IN-MEMORY QUEUE ────────────────────────────────────────────────────────
// Limits concurrent Groq calls to 1 at a time, spacing them 2s apart.
// Resets if server restarts (fine for Vercel serverless — queue is per-instance).
var queue = [];
var processing = false;

function enqueue(fn) {
  return new Promise(function(resolve, reject) {
    queue.push({ fn: fn, resolve: resolve, reject: reject });
    if (!processing) runQueue();
  });
}

async function runQueue() {
  if (queue.length === 0) { processing = false; return; }
  processing = true;
  var item = queue.shift();
  try {
    var result = await item.fn();
    item.resolve(result);
  } catch (e) {
    item.reject(e);
  }
  // 2s gap between requests to stay well under 30 req/min
  await new Promise(function(r) { setTimeout(r, 2000); });
  runQueue();
}
// ────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  var body = await request.json();
  var systemPrompt = body.systemPrompt;
  var messages = body.messages;
  var imageBase64 = body.imageBase64 || null;  // PNG support
  var imageMime = body.imageMime || "image/png";

  var apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  // Wrap everything in the queue so concurrent users don't blow rate limits
  try {
    var response = await enqueue(async function() {
      return await processRequest(apiKey, systemPrompt, messages, imageBase64, imageMime);
    });
    return response;
  } catch (err) {
    return Response.json({ error: "Error en cola de procesamiento" }, { status: 500 });
  }
}

async function processRequest(apiKey, systemPrompt, messages, imageBase64, imageMime) {
  // If there's an image, skip chunking and send directly with vision
  // Note: llama-3.2-11b-vision-preview supports images on Groq
  if (imageBase64) {
    return await callGroqWithImage(apiKey, systemPrompt, messages, imageBase64, imageMime);
  }

  // Estimate tokens roughly (1 token ≈ 4 chars)
  var systemTokens = Math.ceil(systemPrompt.length / 4);
  var messageTokens = 0;
  for (var i = 0; i < messages.length; i++) {
    var content = messages[i].content;
    if (typeof content === "string") messageTokens += Math.ceil(content.length / 4);
  }
  var totalEstimate = systemTokens + messageTokens + 4096;

  if (totalEstimate < 10000) {
    return await callGroq(apiKey, systemPrompt, messages, 4096);
  }

  // Chunk and summarize the largest user message
  var largestIdx = 0;
  var largestLen = 0;
  for (var i = 0; i < messages.length; i++) {
    var c = messages[i].content;
    if (messages[i].role === "user" && typeof c === "string" && c.length > largestLen) {
      largestLen = c.length;
      largestIdx = i;
    }
  }

  var fullText = messages[largestIdx].content || "";
  var splitMarker = "---\nMATERIAL DE REFERENCIA";
  var questionPart = fullText;
  var materialPart = "";

  var splitIdx = fullText.indexOf(splitMarker);
  if (splitIdx !== -1) {
    questionPart = fullText.substring(0, splitIdx).trim();
    materialPart = fullText.substring(splitIdx).trim();
  } else if (fullText.length > 5000) {
    materialPart = fullText;
    questionPart = "Evalúa y responde sobre el siguiente material.";
  }

  var afterSplitEstimate = systemTokens + Math.ceil(questionPart.length / 4) + Math.ceil(materialPart.length / 4) + 4096;
  if (afterSplitEstimate < 10000 || materialPart.length < 8000) {
    return await callGroq(apiKey, systemPrompt, messages, 4096);
  }

  // Chunk + summarize (each chunk goes through the queue naturally since we're already inside one job)
  var chunkSize = 6000;
  var chunks = [];
  for (var c = 0; c < materialPart.length; c += chunkSize) {
    chunks.push(materialPart.substring(c, c + chunkSize));
  }

  var summaries = [];
  for (var ci = 0; ci < chunks.length; ci++) {
    if (ci > 0) await new Promise(function(r) { setTimeout(r, 3000); });
    var sumMessages = [{
      role: "user",
      content: "Resume el siguiente texto de forma densa y precisa, capturando TODOS los puntos clave, datos, argumentos y detalles importantes. No omitas información relevante. Responde solo con el resumen, sin introducción:\n\n" + chunks[ci]
    }];
    try {
      var sumRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: "Eres un asistente que resume textos de forma densa y precisa en español." }].concat(sumMessages),
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });
      var sumData = await sumRes.json();
      summaries.push(sumData.choices && sumData.choices[0] ? sumData.choices[0].message.content : chunks[ci].substring(0, 2000));
    } catch (e) {
      summaries.push(chunks[ci].substring(0, 2000));
    }
  }

  await new Promise(function(r) { setTimeout(r, 3000); });

  var compressedMaterial = summaries.join("\n\n");
  var newContent = questionPart + "\n\n---\nRESUMEN DEL MATERIAL:\n" + compressedMaterial;
  var newMessages = messages.slice();
  newMessages[largestIdx] = { role: messages[largestIdx].role, content: newContent };

  return await callGroq(apiKey, systemPrompt, newMessages, 4096);
}

// Regular text call
async function callGroq(apiKey, systemPrompt, messages, maxTokens) {
  var groqMessages = [{ role: "system", content: systemPrompt }];
  for (var i = 0; i < messages.length; i++) {
    groqMessages.push({ role: messages[i].role, content: messages[i].content });
  }
  try {
    var res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });
    var data = await res.json();
    if (data.error) return Response.json({ error: data.error.message || "Groq API error" }, { status: 500 });
    var text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "Sin respuesta.";
    return Response.json({ text: text });
  } catch (err) {
    return Response.json({ error: "Error de conexión con Groq" }, { status: 500 });
  }
}

// Vision call for PNG images — uses llama-3.2-11b-vision-preview
async function callGroqWithImage(apiKey, systemPrompt, messages, imageBase64, imageMime) {
  var groqMessages = [{ role: "system", content: systemPrompt }];

  // Add all previous messages except the last user one (we'll rebuild it with image)
  for (var i = 0; i < messages.length - 1; i++) {
    groqMessages.push({ role: messages[i].role, content: messages[i].content });
  }

  // Last user message: attach image + text
  var lastMsg = messages[messages.length - 1];
  var userContent = [
    {
      type: "image_url",
      image_url: { url: "data:" + imageMime + ";base64," + imageBase64 }
    },
    {
      type: "text",
      text: lastMsg.content || "Analiza esta imagen."
    }
  ];

  groqMessages.push({ role: "user", content: userContent });

  try {
    var res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: groqMessages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });
    var data = await res.json();
    if (data.error) return Response.json({ error: data.error.message || "Groq vision error" }, { status: 500 });
    var text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "Sin respuesta.";
    return Response.json({ text: text });
  } catch (err) {
    return Response.json({ error: "Error procesando imagen" }, { status: 500 });
  }
}
