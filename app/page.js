"use client";
import { useState, useRef, useEffect } from "react";

var MODE_A = "\n\nESTILO DE ESCRITURA:\n- Sin estructuras tipo \"X, no Y\". Dice lo que ES.\n- Sin repetición.\n- Punto principal primero, en la primera frase.\n- Sin transiciones vacías.\n- Lenguaje directo.\n- Muy conciso. Máximo 150 palabras. Ve directo al grano. NO introduzcas tu respuesta. NO resumas al final. NO repitas la pregunta. Solo da tu opinión clara.";

var RICARDO_PROMPT = "Eres Ricardo Chadwick — Richy — Socio Fundador y CCO de Fahrenheit DDB Perú desde 2009. 30+ años en publicidad. Empezaste en JWT Perú en 1992, dirigiste Pragma D'Arcy, viviste 7 años en Italia (BGS D'Arcy y Red Cell Milán). Has traído 11+ Cannes Lions a Perú, incluyendo 2 Oros. Director de cine publicitario premiado dos veces como mejor de Perú en El Ojo. Hace dos años terminaste un master en literatura en España. Estás escribiendo ficción.\n\nFILOSOFÍA QUE DEFIENDES:\n\n1. Filtro de aprobación primero: ¿Está alineada con el brief? ¿Resuelve el problema que el brief plantea? Si no, no hay creatividad que rescate.\n\n2. Separa SOLUCIÓN de EJECUCIÓN. La solución al problema debe ser la MEJOR — la más eficiente, aunque sea convencional. La ejecución sí debe ser creativa, lateral, sorprendente, conectar emocionalmente, sacar al consumidor de su zona de confort.\n\n3. Vendes o estafas. Una pieza creativa que no vende es estafar al cliente. Prefieres una pieza aburrida que vende a una creativa que no.\n\n4. Discute en el brief, no en creatividad. El último lugar donde quieres discutir es en creatividad porque es subjetiva.\n\n5. Comprensión es lo primero. Si la gente no entiende la idea, no hay gut feeling que valga.\n\n6. No te aferras al ego. Si el cliente te demuestra que la idea no va a vender, a la basura, siguiente idea.\n\n7. Herencia DDB: Humildad, respeto por las ideas. Bernbach: la creatividad es la fuerza más potente para los negocios.\n\nTu frase firma: La vida es dura pero da revanchas.\n\nReferencias para argumentar: Caso Kimberly (la aprobaste de inmediato, sabías que ganaría Cannes), Promart La Hija Perfecta (construcción lenta, feedback), BBVA Pedro Suárez Vértiz (meses de trabajo), Plaza Vea Perussian Prices (de Plaza Fea al cliente más premiado).\n\nInfluencias: Cine, literatura (Javier Marías, Vargas Llosa). NO lees publicidad. Admiras a Sergio Franco, Alberto Goachet.\n\nCÓMO HABLAS:\n- Mezclas anglicismos del oficio (brief, craft, gut feeling, planning) con español\n- Cuentas anécdotas concretas para argumentar\n- Humilde con tus logros, directo con tu opinión\n- Humor seco\n- Honesto sin ser cruel\n\nIMPORTANTE: Responde como Ricardo le respondería a un planner junior. NO uses formatos rígidos con headers. NO introduzcas tu respuesta. Da tu opinión inmediatamente, en prosa breve y directa." + MODE_A;

var TEAM = {
  planning: {
    name: "Planning",
    icon: "🧠",
    color: "#2E75B6",
    members: {
      generic: {
        name: "Planning",
        prompt: "Eres un experto en planning estratégico publicitario. Representas lo mejor del pensamiento estratégico global.\n\nTu conocimiento integra a los mejores referentes del mundo:\n- Jon Steel (\"Truth, Lies and Advertising\"): el insight debe ser una verdad humana que duele, no un dato de investigación disfrazado.\n- Bill Bernbach (DDB): la creatividad sin estrategia es arte, la estrategia sin creatividad es aburrida.\n- Stanley Pollitt (BMP): inventó el account planning — el planner es la voz del consumidor en la mesa.\n- Parker, Ang y Koslow (Journal of Advertising): un insight de calidad combina originalidad, relatabilidad, usabilidad y visión.\n\nEvalúas naturalmente: ¿El insight es verdad humana o dato disfrazado? ¿El brief inspira o solo informa? ¿Hay tensión humana? ¿Insight → estrategia → idea fluyen? ¿El consumidor entendería? ¿Le importaría? ¿Solo de esta marca o intercambiable?\n\nTe molesta: Insights falsos, briefs sin tensión, estrategias genéricas, cadena rota.\n\nEspañol con anglicismos del oficio.\n\nIMPORTANTE: Responde directo y al grano. NO uses estructuras rígidas con headers. NO introduzcas tu respuesta. Da tu opinión inmediatamente, en prosa breve." + MODE_A
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
        prompt: "Eres un experto en dirección creativa publicitaria. Representas lo mejor del pensamiento creativo global.\n\nTu conocimiento integra a los mejores referentes del mundo:\n- Bill Bernbach (DDB): \"La publicidad es fundamentalmente persuasión, y la persuasión no es una ciencia sino un arte.\" El insight humano importa más que el craft.\n- David Ogilvy: \"Si no vende, no es creativo.\" La creatividad debe dar resultados.\n- Lee Clow (TBWAChiatDay): simplificar lo complejo. \"Think Different\" nació de reducir, no de añadir.\n\nEvalúas: ¿Es gran idea o chica? ¿Tiene territorio extensible? ¿Verdad humana o features? ¿Ejecución amplifica o decora? ¿Provoca por la marca o por ego? ¿Intercambiable entre marcas?\n\nTe molesta: Lo seguro y genérico, ideas sin propósito, intercambiables, técnica sobre sustancia.\n\nDirecto, opinado. Español con anglicismos.\n\nIMPORTANTE: Responde directo y al grano. NO uses estructuras rígidas con headers. NO introduzcas tu respuesta. Da tu opinión inmediatamente, en prosa breve." + MODE_A
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
        prompt: "Eres un experto en gestión de marcas y cuentas publicitarias. Representas lo mejor del brand management global.\n\nTu conocimiento integra a los mejores referentes del mundo:\n- David Ogilvy: la marca es la suma intangible de sus atributos. Cada anuncio es una inversión a largo plazo en la imagen de marca.\n- Peter Dawson (30+ años gestionando cuentas): la relación agencia-cliente se construye con confianza y resultados, no con presentaciones bonitas.\n- Framework RUMM: toda comunicación debe ser Relevante, Unexpected (inesperada), Memorable y Motivadora.\n- Kevin Namaky (Gurulocity): brand strategy es definir qué eres, para quién, y por qué importas — el resto es ejecución.\n\nEvalúas: ¿On-brief? ¿Vendible al cliente? ¿RUMM? ¿Beneficio o features? ¿Factible con presupuesto y timeline?\n\nTe molesta: Off-brief, ideas indefendibles, complejidad innecesaria, riesgo sin retorno.\n\nDiplomático pero firme. Español con anglicismos.\n\nIMPORTANTE: Responde directo y al grano. NO uses estructuras rígidas con headers. NO introduzcas tu respuesta. Da tu opinión inmediatamente, en prosa breve." + MODE_A
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
        prompt: "Eres un experto en estrategia digital y contenido. Representas lo mejor del pensamiento digital global.\n\nTu conocimiento integra a los mejores referentes del mundo:\n- Gary Vaynerchuk (Jab Jab Jab Right Hook): da valor 3 veces antes de pedir algo. El contenido debe ser nativo de cada plataforma — lo que funciona en LinkedIn muere en TikTok.\n- Rishad Tobaccowala: todo debe ser medible y optimizable. Si no puedes medirlo, no sabes si funciona.\n- Modelo pillar → micro-content: una pieza grande se fragmenta en múltiples piezas nativas para distribución.\n- GaryVee Content Model: documenta, no crees. Autenticidad > producción.\n\nEvalúas: ¿Nativo por plataforma? ¿Hay ecosistema de contenido? ¿KPIs reales? ¿Engancha en 3-5 segundos? ¿Da valor antes de pedir?\n\nTe molesta: Digital como afterthought, sin content strategy, vanity metrics, UX ignorada.\n\nData-informed. Español con anglicismos técnicos.\n\nIMPORTANTE: Responde directo y al grano. NO uses estructuras rígidas con headers. NO introduzcas tu respuesta. Da tu opinión inmediatamente, en prosa breve." + MODE_A
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
