export async function POST(request) {
  const { systemPrompt, messages } = await request.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  // Process messages - extract text from files if present
  const processedMessages = [];
  for (const m of messages) {
    if (m.file && m.file.data) {
      let extractedText = "";
      try {
        const buffer = Buffer.from(m.file.data, "base64");

        if (m.file.mimeType === "application/pdf") {
          const pdfParse = (await import("pdf-parse")).default;
          const pdf = await pdfParse(buffer);
          extractedText = pdf.text;
        } else if (m.file.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          extractedText = result.value;
        } else if (m.file.mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
          // Extract text from PPTX (ZIP of XML files)
          const { Readable } = await import("stream");
          const { createUnzip } = await import("zlib");
          // Simple XML text extraction
          const text = buffer.toString("utf8", 0, Math.min(buffer.length, 500000));
          const matches = text.match(/<a:t>([^<]+)<\/a:t>/g) || [];
          extractedText = matches.map(m => m.replace(/<\/?a:t>/g, "")).join("\n");
          if (!extractedText) extractedText = "[No se pudo extraer texto del PPTX. Intenta copiar y pegar el contenido.]";
        }
      } catch (err) {
        extractedText = "[Error al procesar archivo. Intenta copiar y pegar el contenido.]";
      }

      processedMessages.push({
        role: m.role,
        content: m.content + "\n\nCONTENIDO DEL DOCUMENTO:\n" + extractedText.slice(0, 30000)
      });
    } else {
      processedMessages.push({ role: m.role, content: m.content });
    }
  }

  const groqMessages = [
    { role: "system", content: systemPrompt },
    ...processedMessages
  ];

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (data.error) {
      return Response.json({ error: data.error.message || "Groq API error" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content || "Sin respuesta.";
    return Response.json({ text });

  } catch (err) {
    return Response.json({ error: "Error de conexión con Groq" }, { status: 500 });
  }
}
