export async function POST(request) {
  const { systemPrompt, messages } = await request.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const groqMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
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
