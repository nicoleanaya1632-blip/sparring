export async function POST(request) {
  var body = await request.json();
  var systemPrompt = body.systemPrompt;
  var messages = body.messages;

  var apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  // Estimate tokens roughly (1 token ≈ 4 chars)
  var systemTokens = Math.ceil(systemPrompt.length / 4);
  var messageTokens = 0;
  for (var i = 0; i < messages.length; i++) {
    messageTokens += Math.ceil((messages[i].content || "").length / 4);
  }
  var totalEstimate = systemTokens + messageTokens + 4096; // include max_tokens

  // If fits within limit, send directly
  if (totalEstimate < 10000) {
    return await callGroq(apiKey, systemPrompt, messages, 4096);
  }

  // Otherwise: chunk and summarize the largest user message
  var largestIdx = 0;
  var largestLen = 0;
  for (var i = 0; i < messages.length; i++) {
    if (messages[i].role === "user" && (messages[i].content || "").length > largestLen) {
      largestLen = (messages[i].content || "").length;
      largestIdx = i;
    }
  }

  var fullText = messages[largestIdx].content || "";

  // Split the material from the question
  var splitMarker = "---\nMATERIAL DE REFERENCIA";
  var questionPart = fullText;
  var materialPart = "";

  var splitIdx = fullText.indexOf(splitMarker);
  if (splitIdx !== -1) {
    questionPart = fullText.substring(0, splitIdx).trim();
    materialPart = fullText.substring(splitIdx).trim();
  } else if (fullText.length > 5000) {
    // No marker but very long — treat the whole thing as material
    materialPart = fullText;
    questionPart = "Evalúa y responde sobre el siguiente material.";
  }

  // If material is short enough after split, send directly
  var afterSplitEstimate = systemTokens + Math.ceil(questionPart.length / 4) + Math.ceil(materialPart.length / 4) + 4096;
  if (afterSplitEstimate < 10000 || materialPart.length < 8000) {
    return await callGroq(apiKey, systemPrompt, messages, 4096);
  }

  // Chunk the material and summarize
  var chunkSize = 6000; // ~1500 tokens per chunk
  var chunks = [];
  for (var c = 0; c < materialPart.length; c += chunkSize) {
    chunks.push(materialPart.substring(c, c + chunkSize));
  }

  var summaries = [];
  for (var ci = 0; ci < chunks.length; ci++) {
    // Wait between chunks to respect rate limits
    if (ci > 0) {
      await new Promise(function(r) { setTimeout(r, 8000); });
    }

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
      if (sumData.choices && sumData.choices[0]) {
        summaries.push(sumData.choices[0].message.content);
      } else {
        summaries.push(chunks[ci].substring(0, 2000));
      }
    } catch (e) {
      summaries.push(chunks[ci].substring(0, 2000));
    }
  }

  // Wait before final call
  await new Promise(function(r) { setTimeout(r, 8000); });

  // Build compressed message
  var compressedMaterial = summaries.join("\n\n");
  var newContent = questionPart + "\n\n---\nRESUMEN DEL MATERIAL:\n" + compressedMaterial;

  var newMessages = messages.slice();
  newMessages[largestIdx] = { role: messages[largestIdx].role, content: newContent };

  return await callGroq(apiKey, systemPrompt, newMessages, 4096);
}

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

    if (data.error) {
      return Response.json({ error: data.error.message || "Groq API error" }, { status: 500 });
    }

    var text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "Sin respuesta.";
    return Response.json({ text: text });

  } catch (err) {
    return Response.json({ error: "Error de conexión con Groq" }, { status: 500 });
  }
}
