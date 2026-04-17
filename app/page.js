"use client";
import { useState, useRef, useEffect } from "react";

var TWIN_BREVITY = "\n\nMáximo 150 palabras. Sin introducción. Sin resumen al final. No repitas la pregunta. Responde directo, como en una conversación.";

var RICARDO_PROMPT = "Eres Ricardo Chadwick — Richy — CCO y Socio Fundador de Fahrenheit DDB Perú. Llevas más de 30 años en publicidad. Empezaste en JWT Lima en 1992, dirigiste Pragma D'Arcy, viviste 7 años en Italia (BGS D'Arcy y Red Cell Milán), y en 2009 fundaste Fahrenheit. 11+ Cannes Lions traídos al Perú, dos Oros. Dos veces mejor director de cine publicitario del país en El Ojo. Hace poco terminaste un máster en literatura en España. Estás escribiendo ficción.\n\nTu forma de pensar: Para ti la solución al problema y la ejecución son cosas distintas. La solución debe ser la más eficiente — aunque sea convencional. La ejecución sí tiene que sorprender, conectar, sacar al consumidor de su zona. Una pieza que no vende es estafar al cliente. Preferirías una pieza aburrida que funciona a una brillante que no. El último lugar donde quieres discutir es en creatividad — eso se zanja en el brief. Si alguien te demuestra que estás equivocado, lo aceptas sin drama: lo que importa es que funcione, no quién gana la discusión.\n\nA veces, cuando viene naturalmente al caso, referencias anécdotas concretas: el brief de Kimberly que aprobaste de inmediato porque sabías que ganaría Cannes, Promart La Hija Perfecta que se construyó lento, BBVA con Pedro Suárez Vértiz que tomó meses con un comité internacional, Plaza Vea Perussian Prices que convirtió a \"Plaza Fea\" en el cliente más premiado. Solo cuando vienen al caso — no como ilustración obligada.\n\nTe influye el cine y la literatura (Javier Marías, Vargas Llosa). No lees publicidad. Admiras a Sergio Franco, a Alberto Goachet.\n\nTu frase: \"La vida es dura pero da revanchas.\"\n\nCómo hablas: mezclas anglicismos del oficio (brief, craft, gut feeling, planning) con español. Tienes humor seco. Eres directo sin ser cruel. Eres humilde con tus logros.\n\nCuando alguien te muestra algo o te pregunta algo, reaccionas como lo harías en una reunión real. No sigues una estructura. Si algo te parece mal planteado, lo dices. Si la pregunta no tiene que ver con creatividad sino con estrategia, lo notas. Respondes lo que te preguntan — no lo que crees que deberían preguntarte." + TWIN_BREVITY;

var TEAM = {
  planning: {
    name: "Planning",
    icon: "🧠",
    color: "#2E75B6",
    members: {
      generic: {
        name: "Planning",
        prompt: "Eres un planner estratégico senior. Llevas años en esto y tienes un criterio formado. Tu forma de ver el trabajo tiene raíces profundas en Jon Steel — el insight es una verdad humana que incomoda, no un dato de investigación disfrazado — en Stanley Pollitt, que inventó el account planning porque el planner tiene que ser la voz del consumidor en la mesa, y en la escuela de Bernbach, donde estrategia y creatividad no son opuestos sino que una necesita a la otra.\n\nCuando alguien te muestra algo o te hace una pregunta, reaccionas desde ese lugar. No pasas por un checklist. Si el insight suena falso, lo notas. Si el brief no tiene tensión real, lo ves. Si la cadena insight → estrategia → idea está rota, ahí apuntas. Pero también puedes simplemente responder lo que te preguntan sin necesidad de evaluar todo lo demás.\n\nHablas con criterio, en español, mezclando anglicismos del oficio cuando salen naturalmente. Directo. Sin headers. Sin estructura fija." + TWIN_BREVITY
      }
    }
  },
  creative: {
    name: "Creatividad",
    icon: "🎨",
    color: "#E74C3C",
    members: {
      generic: {
        name: "Creatividad",
        prompt: "Eres un director creativo senior. Llevas años mirando trabajo — bueno y malo — y eso te dio criterio. Internalizaste a Bernbach (el insight humano antes que el craft), a Ogilvy (si no vende, no es creativo), a Lee Clow (simplificar lo complejo, no decorarlo).\n\nCuando alguien te muestra algo o te pregunta algo, reaccionas desde ese lugar. Ves si la idea es grande o chica. Si la ejecución amplifica o solo decora. Si hay una verdad humana detrás o solo features. Si la pieza podría ser de cualquier marca o solo de esa. Pero no evalúas por obligación — si te preguntan algo concreto, respondes eso.\n\nTienes opiniones fuertes pero no eres cruel. Directo, en español con anglicismos del oficio. Sin headers. Sin estructura fija." + TWIN_BREVITY
      },
      ricardo: {
        name: "Ricardo Chadwick",
        subtitle: "CCO Fahrenheit DDB",
        prompt: RICARDO_PROMPT
      }
    }
  },
  marcas: {
    name: "Marcas",
    icon: "🤝",
    color: "#27AE60",
    members: {
      generic: {
        name: "Marcas",
        prompt: "Eres un director de cuentas y brand strategist senior. Conoces los dos lados de la mesa — agencia y cliente — y eso te da una perspectiva que no todo el mundo tiene. Tu criterio viene de Ogilvy (cada pieza es una inversión a largo plazo en la imagen de marca), de Peter Dawson (la confianza con el cliente se construye con resultados, no con presentaciones bonitas), y de años aprendiendo qué ideas se pueden defender y cuáles no sobreviven el primer contacto con la realidad.\n\nCuando alguien te muestra algo o te pregunta, reaccionas desde ahí. Si algo está off-brief, lo dices. Si es indefendible con el cliente, lo adviertes. Si la complejidad no está justificada, lo notas. Pero no todo es una evaluación — si te hacen una pregunta específica, la respondes.\n\nDiplomático pero firme. En español con anglicismos del oficio. Sin headers. Sin estructura fija." + TWIN_BREVITY
      }
    }
  },
  digital: {
    name: "Digital",
    icon: "📱",
    color: "#8E44AD",
    members: {
      generic: {
        name: "Digital",
        prompt: "Eres un estratega digital senior. Tu forma de ver el trabajo viene de GaryVee — da valor antes de pedir, el contenido tiene que ser nativo de cada plataforma, lo que funciona en LinkedIn muere en TikTok — de Tobaccowala, que dice que si no puedes medirlo no sabes si funciona, y de años viendo cómo la mayoría trata lo digital como afterthought.\n\nCuando alguien te muestra algo o te pregunta, reaccionas desde ahí. Ves si el contenido ignora las dinámicas de la plataforma. Si los KPIs son vanity metrics o tienen sentido real. Si la estrategia digital está conectada con la de marca o flota sola. Pero no evalúas por obligación — si te hacen una pregunta concreta, la respondes.\n\nData-informed pero no frío. En español con anglicismos técnicos cuando salen naturalmente. Sin headers. Sin estructura fija." + TWIN_BREVITY
      }
    }
  }
};

async function extractTextFromFile(file) {
  var name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv")) return await file.text();
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
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: systemPrompt, messages: messages }),
    });
    var data = await res.json();
    if (data.error) return "⚠️ " + data.error;
    return data.text;
  } catch (e) { return "⚠️ Error de conexión. Intenta de nuevo."; }
}

function selectionKey(area, member) { return area + ":" + member; }
function parseKey(key) { var p = key.split(":"); return { area: p[0], member: p[1] }; }

function AreaCard({ areaId, area, selected, onToggle }) {
  var memberIds = Object.keys(area.members);
  return (
    <div style={{ border: "1px solid " + area.color + "33", borderRadius: 12, background: "#0f0f0f", marginBottom: 10, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", background: area.color + "10", borderBottom: "1px solid " + area.color + "22", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{area.icon}</span>
        <span style={{ fontWeight: 700, color: area.color, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{area.name}</span>
      </div>
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {memberIds.map(function(memberId) {
          var member = area.members[memberId];
          var key = selectionKey(areaId, memberId);
          var isOn = selected.includes(key);
          return (
            <button key={memberId} onClick={function() { onToggle(key); }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              border: isOn ? "1.5px solid " + area.color : "1.5px solid #222",
              borderRadius: 8, background: isOn ? area.color + "15" : "#161616",
              cursor: "pointer", transition: "all 0.15s", textAlign: "left", width: "100%",
            }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, border: isOn ? "1.5px solid " + area.color : "1.5px solid #444", background: isOn ? area.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{isOn ? "✓" : ""}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: isOn ? area.color : "#bbb", fontWeight: 600, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{member.name}</div>
                {member.subtitle && <div style={{ color: "#555", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{member.subtitle}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MessageBubble({ role, text, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{role === "user" ? "Tú" : "Twin"}</div>
      <div style={{ padding: "12px 16px", borderRadius: 10, background: role === "user" ? "#1a1a1a" : color + "08", border: role === "user" ? "1px solid #2a2a2a" : "1px solid " + color + "22", color: "#ccc", fontSize: 14, lineHeight: 1.7, fontFamily: "'Inter', -apple-system, sans-serif", whiteSpace: "pre-wrap" }}>
        {text.split(/(\*\*[^*]+\*\*)/).map(function(part, i) {
          if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} style={{ color: color, fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
}

function TwinCard({ twinKey, area, member, conversation, loading, onReply }) {
  var replyState = useState(""); var reply = replyState[0]; var setReply = replyState[1];
  var sendState = useState(false); var sending = sendState[0]; var setSending = sendState[1];
  var endRef = useRef(null);
  useEffect(function() { if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" }); }, [conversation]);

  var handleReply = async function() {
    if (!reply.trim() || sending) return;
    var msg = reply.trim();
    setReply(""); setSending(true);
    await onReply(twinKey, msg);
    setSending(false);
  };

  var visible = (conversation || []).filter(function(m) { return m.display !== false; });

  return (
    <div style={{ border: "1px solid " + area.color + "33", borderRadius: 12, background: "#111", overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "14px 20px", background: area.color + "15", borderBottom: "1px solid " + area.color + "33", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{area.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: area.color, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>{member.name}</div>
          {member.subtitle && <div style={{ color: "#666", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{member.subtitle}</div>}
        </div>
      </div>
      <div style={{ padding: "16px 20px", maxHeight: 500, overflowY: "auto" }}>
        {visible.map(function(msg, i) { return <MessageBubble key={i} role={msg.role} text={msg.text} color={area.color} />; })}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#666", padding: "8px 0" }}>
            <div style={{ width: 14, height: 14, border: "2px solid " + area.color, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Pensando...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {visible.length > 0 && !loading && (
        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8 }}>
          <input value={reply} onChange={function(e) { setReply(e.target.value); }}
            onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
            placeholder="Sigue la conversación..." disabled={sending}
            style={{ flex: 1, padding: "10px 14px", background: "#0a0a0a", border: "1px solid #222", borderRadius: 8, color: "#ccc", fontSize: 13, fontFamily: "'Inter', sans-serif" }} />
          <button onClick={handleReply} disabled={!reply.trim() || sending}
            style={{ padding: "10px 18px", background: reply.trim() && !sending ? area.color : "#1a1a1a", color: reply.trim() && !sending ? "#fff" : "#444", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: sending ? "wait" : "pointer", fontFamily: "'JetBrains Mono', monospace" }}>→</button>
        </div>
      )}
    </div>
  );
}

function FileUpload({ onFileContent, fileName, onClear }) {
  var inputRef = useRef(null);
  var dragState = useState(false); var dragging = dragState[0]; var setDragging = dragState[1];
  var procState = useState(false); var processing = procState[0]; var setProcessing = procState[1];
  var errState = useState(null); var error = errState[0]; var setError = errState[1];

  var readFile = async function(file) {
    setError(null); setProcessing(true);
    try {
      var text = await extractTextFromFile(file);
      if (text && text.length > 0) onFileContent(text, file.name);
      else setError("No se pudo extraer texto. Copia y pega.");
    } catch (err) { setError("Error al leer archivo."); }
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
  var selState = useState(["creative:ricardo"]); var selected = selState[0]; var setSelected = selState[1];
  var qState = useState(""); var question = qState[0]; var setQuestion = qState[1];
  var delState = useState(""); var deliverable = delState[0]; var setDeliverable = delState[1];
  var convState = useState({}); var conversations = convState[0]; var setConversations = convState[1];
  var loadState = useState({}); var loading = loadState[0]; var setLoading = loadState[1];
  var runState = useState(false); var running = runState[0]; var setRunning = runState[1];
  var attachState = useState(false); var showAttach = attachState[0]; var setShowAttach = attachState[1];
  var fnState = useState(null); var fileName = fnState[0]; var setFileName = fnState[1];
  var resultsRef = useRef(null);

  var toggleTwin = function(key) { setSelected(function(prev) { return prev.includes(key) ? prev.filter(function(x) { return x !== key; }) : prev.concat([key]); }); };
  var clearFile = function() { setDeliverable(""); setFileName(null); setShowAttach(false); };
  var hasContent = question.trim().length > 0;

  var runEvaluation = async function() {
    if (!hasContent || selected.length === 0) return;
    setRunning(true); setConversations({});
    var initLoading = {}; selected.forEach(function(k) { initLoading[k] = true; }); setLoading(initLoading);
    setTimeout(function() { if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: "smooth" }); }, 200);

    var userText = question.trim();
    if (deliverable.trim().length > 0) {
      userText += "\n\n---\nMATERIAL DE REFERENCIA" + (fileName ? " (" + fileName + ")" : "") + ":\n" + deliverable.trim();
    }

    var promises = selected.map(function(key, i) {
      return new Promise(function(resolve) { setTimeout(resolve, i * 15000); }).then(async function() {
        var parsed = parseKey(key);
        var member = TEAM[parsed.area].members[parsed.member];
        var msgs = [{ role: "user", content: userText }];
        var result = await callTwin(member.prompt, msgs);
        setConversations(function(prev) {
          var next = Object.assign({}, prev);
          next[key] = [
            { role: "user", text: userText, display: false },
            { role: "assistant", text: result }
          ];
          return next;
        });
        setLoading(function(prev) { var next = Object.assign({}, prev); next[key] = false; return next; });
      });
    });
    await Promise.all(promises);
    setRunning(false);
  };

  var handleReply = async function(twinKey, replyText) {
    var conv = conversations[twinKey] || [];
    var newConv = conv.concat([{ role: "user", text: replyText }]);
    setConversations(function(prev) { var next = Object.assign({}, prev); next[twinKey] = newConv; return next; });
    setLoading(function(prev) { var next = Object.assign({}, prev); next[twinKey] = true; return next; });
    var parsed = parseKey(twinKey);
    var member = TEAM[parsed.area].members[parsed.member];
    var apiMessages = newConv.map(function(m) { return { role: m.role, content: m.text }; });
    var result = await callTwin(member.prompt, apiMessages);
    setConversations(function(prev) { var next = Object.assign({}, prev); next[twinKey] = prev[twinKey].concat([{ role: "assistant", text: result }]); return next; });
    setLoading(function(prev) { var next = Object.assign({}, prev); next[twinKey] = false; return next; });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#eee", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } } textarea:focus, input:focus { outline: none; border-color: #2E75B6 !important; } textarea::placeholder, input::placeholder { color: #444; } * { box-sizing: border-box; }"}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, margin: 0, letterSpacing: -1.5, fontFamily: "'JetBrains Mono', monospace", color: "#fff" }}>SPARRING</h1>
          <p style={{ color: "#555", fontSize: 14, margin: "8px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>Conversa con tus stakeholders — Fahrenheit DDB</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Panel</label>
          <div style={{ marginTop: 10 }}>
            {Object.entries(TEAM).map(function(entry) { return <AreaCard key={entry[0]} areaId={entry[0]} area={entry[1]} selected={selected} onToggle={toggleTwin} />; })}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Tu pregunta</label>
          <textarea value={question} onChange={function(e) { setQuestion(e.target.value); }}
            placeholder="Ej: ¿Qué opinas de este insight? / ¿Cómo abordarías un brief de banca para jóvenes? / Revisa esta propuesta..."
            rows={4}
            style={{ width: "100%", marginTop: 8, padding: "14px 16px", background: "#141414", border: "1px solid #222", borderRadius: 8, color: "#ccc", fontSize: 14, lineHeight: 1.5, fontFamily: "'Inter', sans-serif", resize: "vertical" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          {!showAttach && !fileName && deliverable.trim().length === 0 ? (
            <button onClick={function() { setShowAttach(true); }}
              style={{ background: "none", border: "1px dashed #333", borderRadius: 8, padding: "10px 14px", color: "#666", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", width: "100%" }}>
              + Adjuntar material de referencia (opcional)
            </button>
          ) : (
            <div>
              <label style={{ fontSize: 12, color: "#666", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Material de referencia <span style={{ color: "#444", fontWeight: 400 }}>(opcional)</span></label>
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <FileUpload onFileContent={function(text, name) { setDeliverable(text); setFileName(name); }} fileName={fileName} onClear={clearFile} />
              </div>
              {!fileName && (
                <textarea value={deliverable} onChange={function(e) { setDeliverable(e.target.value); }} placeholder="O pega aquí el brief, la propuesta, el insight..." rows={5}
                  style={{ width: "100%", padding: 14, background: "#141414", border: "1px solid #222", borderRadius: 8, color: "#ccc", fontSize: 13, lineHeight: 1.5, resize: "vertical", fontFamily: "'Inter', sans-serif" }} />
              )}
            </div>
          )}
        </div>

        <button onClick={runEvaluation} disabled={running || !hasContent || selected.length === 0}
          style={{ width: "100%", padding: "16px 0", fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: running || !hasContent || selected.length === 0 ? "#1a1a1a" : "#2E75B6", color: running || !hasContent || selected.length === 0 ? "#444" : "#fff", border: "none", borderRadius: 10, cursor: running ? "wait" : "pointer", transition: "all 0.2s" }}
        >{running ? "Pensando..." : "PREGUNTAR → " + selected.length + " twin" + (selected.length !== 1 ? "s" : "")}</button>

        <div ref={resultsRef} style={{ marginTop: 40 }}>
          {selected.map(function(key) {
            if (!conversations[key] && !loading[key]) return null;
            var parsed = parseKey(key);
            var area = TEAM[parsed.area];
            var member = area.members[parsed.member];
            return <TwinCard key={key} twinKey={key} area={area} member={member} conversation={conversations[key] || []} loading={loading[key]} onReply={handleReply} />;
          })}
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
