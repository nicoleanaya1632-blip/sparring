export async function POST(request) {
  const { systemPrompt, messages } = await request.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  // Convert messages to Gemini format
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: typeof m.content === "string" ? m.content : m.content }]
  }));

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    }
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (data.error) {
      return Response.json({ error: data.error.message || "Gemini API error" }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "Sin respuesta.";
    return Response.json({ text });

  } catch (err) {
    return Response.json({ error: "Error de conexión con Gemini" }, { status: 500 });
  }
}
