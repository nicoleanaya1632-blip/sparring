"use client";
import { useState, useRef, useEffect } from "react";

const MODE_A = "\n\nREGLAS DE ESCRITURA (siempre):\n1. Sin \"X, no Y\". Dice lo que ES.\n2. Sin repetición.\n3. Punto principal primero.\n4. Sin transiciones vacías.\n5. Lenguaje directo.\nSé conciso. Máximo 500 palabras.";

const TWINS = {
  planning: {
    name: "Director de Planning",
    icon: "🧠",
    color: "#2E75B6",
    prompt: "Eres el Director de Planning de una agencia de publicidad top. 20+ años. Voz del consumidor.\n\nReferentes: Jon Steel, Bill Bernbach, Stanley Pollitt. Insight de calidad: originalidad, relatabilidad, usabilidad, visión.\n\nEVALÚAS:\n1. INSIGHT — ¿Verdad humana o dato disfrazado?\n2. BRIEF — ¿Inspira o informa? ¿Tensión humana?\n3. COHERENCIA — ¿Insight → estrategia → idea fluyen?\n4. CONSUMIDOR — ¿Lo entendería? ¿Le importaría?\n5. DIFERENCIACIÓN — ¿Solo de esta marca?\n\nDEALBREAKERS: Insight falso, brief sin tensión, estrategia genérica, cadena rota.\n\nFORMATO:\n**LO QUE FUNCIONA:** [2-3 puntos]\n**DONDE FLAQUEA:** [Problemas por gravedad]\n**PREGUNTAS QUE TE HARÍA:** [2-3 preguntas]\n**DIRECCIÓN SUGERIDA:** [Hacia dónde]\n**VEREDICTO:** (A) Listo (B) Ajustes (C) Repensar\n\nEspañol con anglicismos del oficio. Honesto, exigente, constructivo." + MODE_A
  },
  creative: {
    name: "Director Creativo",
    icon: "🎨",
    color: "#E74C3C",
    prompt: "Eres el Director Creativo. 20+ años. Guardián de calidad creativa.\n\nReferentes: Bernbach (insight humano), Ogilvy (si no vende no es creativo), Lee Clow (simplificar).\n\nEVALÚAS:\n1. ¿GRAN IDEA? — Territorio extensible.\n2. ¿VERDAD HUMANA? — ¿Desde consumidor o features?\n3. ¿EJECUCIÓN AMPLIFICA? — ¿Craft vívido o decorativo?\n4. ¿PROVOCACIÓN CORRECTA? — ¿Marca o ego?\n5. ¿INTERCAMBIABLE? — Si cambias logo y funciona, falla.\n\nDEALBREAKERS: Seguro/genérico, sin propósito, intercambiable, técnica sobre sustancia.\n\nFORMATO:\n**LA IDEA:** [¿Grande o chica?]\n**EL CRAFT:** [¿Amplifica o decora?]\n**LO QUE RESCATO:** [Lo mejor]\n**LO QUE NO COMPRO:** [Problemas]\n**EMPUJA MÁS AQUÍ:** [Potencial]\n**VEREDICTO:** (A) Vuela (B) Idea sí, ejecución no (C) Otra idea\n\nDirecto, opinado. Español con anglicismos." + MODE_A
  },
  marcas: {
    name: "Director de Marcas",
    icon: "🤝",
    color: "#27AE60",
    prompt: "Eres el Director de Marcas/Cuentas. 20+ años. Pregunta central: '¿Puedo vender esto?'\n\nReferentes: Ogilvy, Peter Dawson, RUMM, Namaky.\n\nEVALÚAS:\n1. ON-BRIEF — ¿Entrega objetivos?\n2. VENDIBLE — ¿Puedo defenderlo ante el cliente?\n3. RUMM — ¿Relevante, inesperado, memorable, motivador?\n4. BENEFICIO — ¿Problema que resuelve o features?\n5. FACTIBILIDAD — ¿Presupuesto y timeline?\n\nDEALBREAKERS: Off-brief, indefendible, muy complejo, riesgo sin retorno.\n\nFORMATO:\n**ALINEACIÓN:** [Sí/No/Parcial]\n**VENDIBILIDAD:** [Objeciones que anticipo]\n**CLIENTE VA A AMAR:** [Qué]\n**CLIENTE VA A CUESTIONAR:** [Qué]\n**CÓMO PRESENTARLO:** [Recomendación]\n**VEREDICTO:** (A) Presentable (B) Ajustar (C) Replantear\n\nDiplomático, firme. Español con anglicismos." + MODE_A
  },
  digital: {
    name: "Director Digital",
    icon: "📱",
    color: "#8E44AD",
    prompt: "Eres el Director Digital. 15+ años. Ideas nativas.\n\nReferentes: Vaynerchuk (atención, nativo, valor primero), Tobaccowala (medible), modelo pillar → micro-content.\n\nEVALÚAS:\n1. NATIVIDAD — ¿Cada plataforma?\n2. ECOSISTEMA — ¿Pillar → micro-content → distribución?\n3. MEDIBILIDAD — ¿KPIs reales? ¿Optimizable?\n4. ATENCIÓN — ¿3-5 segundos enganchan?\n5. VALOR/PEDIDO — ¿Da antes de pedir?\n\nDEALBREAKERS: Afterthought, sin content strategy, inmedible, UX ignorada, vanity metrics.\n\nFORMATO:\n**NATIVIDAD:** [¿Nativo o adaptación?]\n**ECOSISTEMA:** [¿Sistema o suelto?]\n**MEDICIÓN:** [¿KPIs?]\n**LO QUE FUNCIONA:** [Qué]\n**LO QUE FALLA:** [Qué]\n**OPORTUNIDADES:** [Qué no ven]\n**VEREDICTO:** (A) Listo (B) Idea sí, digital no (C) Replantear\n\nData-informed. Español con anglicismos técnicos." + MODE_A
  }
};

async function extractTextFromFile(file) {
  var name = file.name.toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv")) {
    return await file.text();
  }

  if (name.endsWith(".pdf")) {
    try {
      var pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) return "[Cargando lector de PDF, intenta de nuevo en unos segundos]";
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      var buffer = await file.arrayBuffer();
      var pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      var text = "";
      var maxPages = Math.min(pdf.numPages, 50);
      for (var i = 1; i <= maxPages; i++) {
        var page = await pdf.getPage(i);
        var content = await page.getTextContent();
        text += content.items.map(function(item) { return item.str; }).join(" ") + "\n\n";
      }
      return text || "[No se pudo extraer texto del PDF]";
    } catch (e) { return "[Error al leer PDF. Intenta copiar y pegar el texto.]"; }
  }

  if (name.endsWith(".docx") || name.endsWith(".pptx")) {
    try {
      var JSZipLib = window.JSZip;
      if (!JSZipLib) return "[Cargando lector, intenta de nuevo en unos segundos]";
      var buffer = await file.arrayBuffer();
      var zip = await JSZipLib.loadAsync(buffer);
      if (name.endsWith(".docx")) {
        var docXml = await zip.file("word/document.xml").async("string");
        return docXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
      if (name.endsWith(".pptx")) {
        var allText = "";
        var slideFiles = Object.keys(zip.files).filter(function(f) { return f.match(/ppt\/slides\/slide\d+\.xml/); }).sort();
        for (var idx = 0; idx < slideFiles.length; idx++) {
          var xml = await zip.files[slideFiles[idx]].async("string");
          var matches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
          allText += matches.map(function(m) { return m.replace(/<\/?a:t>/g, ""); }).join(" ") + "\n\n";
        }
        return allText || "[No se pudo extraer texto del PPTX]";
      }
    } catch (e) { return "[Error al leer archivo. Intenta copiar y pegar el texto.]"; }
  }

  try { return await file.text(); } catch (e) { return "[Formato no soportado]"; }
}

async function callTwin(systemPrompt, messages) {
  try {
    var res = await fetch("/api/sparring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: systemPrompt, messages: messages }),
    });
    var data = await res.json();
    if (data.error) return "⚠️ " + data.error;
    return data.text;
  } catch (e) {
    return "⚠️ Error de conexión. Intenta de nuevo.";
  }
}

function TwinToggle({ id, twin, selected, onToggle }) {
  var isOn = selected.includes(id);
  return (
    <button onClick={function() { onToggle(id); }} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
      border: isOn ? "2px solid " + twin.color : "2px solid #2a2a2a",
      borderRadius: 10, background: isOn ? twin.color + "15" : "#1a1a1a",
      cursor: "pointer", transition: "all 0.2s", width: "100%",
    }}>
      <span style={{ fontSize: 22 }}>{twin.icon}</span>
      <span style={{ color: isOn ? twin.color : "#888", fontWeight: 600, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>{twin.name}</span>
      <span style={{
        marginLeft: "auto", width: 18, height: 18, borderRadius: 4,
        border: isOn ? "2px solid " + twin.color : "2px solid #444",
        background: isOn ? twin.color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#fff", fontWeight: 700,
      }}>{isOn ? "✓" : ""}</span>
    </button>
  );
}

function MessageBubble({ role, text, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
        {role === "user" ? "Tú" : "Twin"}
      </div>
      <div style={{
        padding: "12px 16px", borderRadius: 10,
        background: role === "user" ? "#1a1a1a" : color + "08",
        border: role === "user" ? "1px solid #2a2a2a" : "1px solid " + color + "22",
        color: "#ccc", fontSize: 14, lineHeight: 1.7,
        fontFamily: "'Inter', -apple-system, sans-serif", whiteSpace: "pre-wrap",
      }}>
        {text.split(/(\*\*[^*]+\*\*)/).map(function(part, i) {
          if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} style={{ color: color, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
}

function TwinCard({ twinId, twin, conversation, loading, onReply }) {
  var replyState = useState("");
  var reply = replyState[0];
  var setReply = replyState[1];
  var sendState = useState(false);
  var sending = sendState[0];
  var setSending = sendState[1];
  var endRef = useRef(null);
  useEffect(function() { if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" }); }, [conversation]);

  var handleReply = async function() {
    if (!reply.trim() || sending) return;
    var msg = reply.trim();
    setReply("");
    setSending(true);
    await onReply(twinId, msg);
    setSending(false);
  };

  var visible = (conversation || []).filter(function(m) { return m.display !== false; });

  return (
    <div style={{ border: "1px solid " + twin.color + "33", borderRadius: 12, background: "#111", overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "14px 20px", background: twin.color + "15", borderBottom: "1px solid " + twin.color + "33", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{twin.icon}</span>
        <span style={{ fontWeight: 700, color: twin.color, fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>{twin.name}</span>
      </div>
      <div style={{ padding: "16px 20px", maxHeight: 500, overflowY: "auto" }}>
        {visible.map(function(msg, i) { return <MessageBubble key={i} role={msg.role} text={msg.text} color={twin.color} />; })}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#666", padding: "8px 0" }}>
            <div style={{ width: 14, height: 14, border: "2px solid " + twin.color, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Evaluando...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {visible.length > 0 && !loading && (
        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8 }}>
          <input value={reply} onChange={function(e) { setReply(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
            placeholder="Responde al twin..." disabled={sending}
            style={{ flex: 1, padding: "10px 14px", background: "#0a0a0a", border: "1px solid #222", borderRadius: 8, color: "#ccc", fontSize: 13, fontFamily: "'Inter', sans-serif" }} />
          <button onClick={handleReply} disabled={!reply.trim() || sending}
            style={{ padding: "10px 18px", background: reply.trim() && !sending ? twin.color : "#1a1a1a", color: reply.trim() && !sending ? "#fff" : "#444", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: sending ? "wait" : "pointer", fontFamily: "'JetBrains Mono', monospace" }}>→</button>
        </div>
      )}
    </div>
  );
}

function FileUpload({ onFileContent, fileName, onClear }) {
  var inputRef = useRef(null);
  var dragState = useState(false);
  var dragging = dragState[0];
  var setDragging = dragState[1];
  var procState = useState(false);
  var processing = procState[0];
  var setProcessing = procState[1];
  var errState = useState(null);
  var error = errState[0];
  var setError = errState[1];

  var readFile = async function(file) {
    setError(null);
    setProcessing(true);
    try {
      var text = await extractTextFromFile(file);
      if (text && text.length > 0) {
        onFileContent(text, file.name);
      } else {
        setError("No se pudo extraer texto. Intenta copiar y pegar.");
      }
    } catch (err) {
      setError("Error al leer archivo. Copia y pega el texto.");
    }
    setProcessing(false);
  };

  return (
    <div>
      {!fileName ? (
        <div onDragOver={function(e) { e.preventDefault(); setDragging(true); }} onDragLeave={function() { setDragging(false); }}
          onDrop={function(e) { e.preventDefault(); setDragging(false); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) readFile(f); }}
          onClick={function() { if (inputRef.current) inputRef.current.click(); }}
          style={{ border: "2px dashed " + (dragging ? "#2E75B6" : "#2a2a2a"), borderRadius: 10, padding: "28px 16px", textAlign: "center", cursor: "pointer", background: dragging ? "#2E75B610" : "#141414" }}>
          <input ref={inputRef} type="file" accept=".txt,.md,.csv,.pdf,.docx,.pptx" style={{ display: "none" }} onChange={function(e) { var f = e.target.files && e.target.files[0]; if (f) readFile(f); }} />
          {processing ? <p style={{ color: "#2E75B6", fontSize: 13, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>Extrayendo texto...</p>
            : <><p style={{ color: "#888", fontSize: 24, margin: "0 0 8px" }}>📄</p><p style={{ color: "#666", fontSize: 13, margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace" }}>Arrastra o haz clic</p><p style={{ color: "#444", fontSize: 11, margin: 0 }}>.pdf .docx .pptx .txt .md</p></>}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#141414", border: "1px solid #2E75B644", borderRadius: 8 }}>
          <span>📄</span>
          <span style={{ color: "#2E75B6", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</span>
          <button onClick={onClear} style={{ background: "none", border: "1px solid #333", borderRadius: 6, color: "#888", fontSize: 11, padding: "4px 12px", cursor: "pointer" }}>✕</button>
        </div>
      )}
      {error && <p style={{ color: "#E74C3C", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}

export default function Home() {
  var selState = useState(["planning"]);
  var selected = selState[0];
  var setSelected = selState[1];
  var delState = useState("");
  var deliverable = delState[0];
  var setDeliverable = delState[1];
  var ctxState = useState("");
  var context = ctxState[0];
  var setContext = ctxState[1];
  var convState = useState({});
  var conversations = convState[0];
  var setConversations = convState[1];
  var loadState = useState({});
  var loading = loadState[0];
  var setLoading = loadState[1];
  var runState = useState(false);
  var running = runState[0];
  var setRunning = runState[1];
  var modeState = useState("text");
  var inputMode = modeState[0];
  var setInputMode = modeState[1];
  var fnState = useState(null);
  var fileName = fnState[0];
  var setFileName = fnState[1];
  var resultsRef = useRef(null);

  var toggleTwin = function(id) { setSelected(function(prev) { return prev.includes(id) ? prev.filter(function(x) { return x !== id; }) : prev.concat([id]); }); };
  var clearFile = function() { setDeliverable(""); setFileName(null); };
  var hasContent = deliverable.trim().length > 0;

  var runEvaluation = async function() {
    if (!hasContent || selected.length === 0) return;
    setRunning(true);
    setConversations({});
    var initLoading = {};
    selected.forEach(function(id) { initLoading[id] = true; });
    setLoading(initLoading);
    setTimeout(function() { if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: "smooth" }); }, 200);

    var ctxText = context.trim() ? "CONTEXTO:\n" + context.trim() + "\n\n" : "";
    var userText = ctxText + "ENTREGABLE A EVALUAR:\n" + deliverable.trim().slice(0, 25000);

    var promises = selected.map(function(id, i) {
      return new Promise(function(resolve) { setTimeout(resolve, i * 15000); }).then(async function() {
        var msgs = [{ role: "user", content: userText }];
        var result = await callTwin(TWINS[id].prompt, msgs);
        setConversations(function(prev) {
          var next = Object.assign({}, prev);
          next[id] = [
            { role: "user", text: fileName ? "[📄 " + fileName + "]" : userText.slice(0, 200) + "...", display: false },
            { role: "assistant", text: result }
          ];
          return next;
        });
        setLoading(function(prev) { var next = Object.assign({}, prev); next[id] = false; return next; });
      });
    });
    await Promise.all(promises);
    setRunning(false);
  };

  var handleReply = async function(twinId, replyText) {
    var conv = conversations[twinId] || [];
    var newConv = conv.concat([{ role: "user", text: replyText }]);
    setConversations(function(prev) { var next = Object.assign({}, prev); next[twinId] = newConv; return next; });
    setLoading(function(prev) { var next = Object.assign({}, prev); next[twinId] = true; return next; });

    var apiMessages = newConv.map(function(m) { return { role: m.role, content: m.text }; });
    var result = await callTwin(TWINS[twinId].prompt, apiMessages);
    setConversations(function(prev) { var next = Object.assign({}, prev); next[twinId] = prev[twinId].concat([{ role: "assistant", text: result }]); return next; });
    setLoading(function(prev) { var next = Object.assign({}, prev); next[twinId] = false; return next; });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#eee", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } } textarea:focus, input:focus { outline: none; border-color: #2E75B6 !important; } textarea::placeholder, input::placeholder { color: #444; } * { box-sizing: border-box; }"}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: 0, letterSpacing: -1.5, fontFamily: "'JetBrains Mono', monospace", color: "#fff" }}>SPARRING</h1>
          <p style={{ color: "#555", fontSize: 14, margin: "8px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>Simulador de stakeholders — Fahrenheit DDB</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Panel</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            {Object.entries(TWINS).map(function(entry) { return <TwinToggle key={entry[0]} id={entry[0]} twin={entry[1]} selected={selected} onToggle={toggleTwin} />; })}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Contexto <span style={{ color: "#444", fontWeight: 400 }}>(opcional)</span></label>
          <input value={context} onChange={function(e) { setContext(e.target.value); }} placeholder="Ej: Brief para BBVA, target AB 30-45"
            style={{ width: "100%", marginTop: 8, padding: "12px 16px", background: "#141414", border: "1px solid #222", borderRadius: 8, color: "#ccc", fontSize: 14, fontFamily: "'Inter', sans-serif" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Entregable</label>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[{ id: "text", label: "✏️ Texto" }, { id: "file", label: "📄 Archivo" }].map(function(mode) {
              return <button key={mode.id} onClick={function() { setInputMode(mode.id); if (mode.id === "text") clearFile(); if (mode.id === "file") setDeliverable(""); }}
                style={{ padding: "8px 16px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", background: inputMode === mode.id ? "#1e1e1e" : "transparent", border: inputMode === mode.id ? "1px solid #333" : "1px solid #1a1a1a", borderRadius: 6, color: inputMode === mode.id ? "#ccc" : "#555", cursor: "pointer" }}
              >{mode.label}</button>;
            })}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          {inputMode === "text" ? (
            <textarea value={deliverable} onChange={function(e) { setDeliverable(e.target.value); }} placeholder="Pega tu brief, propuesta, territorio, deck..." rows={8}
              style={{ width: "100%", padding: 16, background: "#141414", border: "1px solid #222", borderRadius: 8, color: "#ccc", fontSize: 14, lineHeight: 1.6, resize: "vertical", fontFamily: "'Inter', sans-serif" }} />
          ) : (
            <FileUpload onFileContent={function(text, name) { setDeliverable(text); setFileName(name); }} fileName={fileName} onClear={clearFile} />
          )}
        </div>

        <button onClick={runEvaluation} disabled={running || !hasContent || selected.length === 0}
          style={{ width: "100%", padding: "16px 0", fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: running || !hasContent || selected.length === 0 ? "#1a1a1a" : "#2E75B6", color: running || !hasContent || selected.length === 0 ? "#444" : "#fff", border: "none", borderRadius: 10, cursor: running ? "wait" : "pointer", transition: "all 0.2s" }}
        >{running ? "Evaluando..." : "SPARRING → " + selected.length + " twin" + (selected.length !== 1 ? "s" : "")}</button>

        <div ref={resultsRef} style={{ marginTop: 40 }}>
          {selected.map(function(id) { return (conversations[id] || loading[id]) ? <TwinCard key={id} twinId={id} twin={TWINS[id]} conversation={conversations[id] || []} loading={loading[id]} onReply={handleReply} /> : null; })}
        </div>

        {Object.keys(conversations).length > 0 && !running && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#141414", borderRadius: 10, border: "1px solid #222" }}>
            <p style={{ color: "#555", fontSize: 12, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>Cada twin mantiene su conversación. Puedes profundizar, cuestionar o pedir alternativas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
