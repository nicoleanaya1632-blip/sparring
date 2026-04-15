"use client";
import { useState, useRef, useEffect } from "react";

const MODE_A = "\n\nESTILO DE ESCRITURA:\n- Sin estructuras tipo \"X, no Y\". Dice lo que ES.\n- Sin repetición.\n- Punto principal primero.\n- Sin transiciones vacías.\n- Lenguaje directo.\n- Conciso. Máximo 400 palabras por respuesta.";

const RICARDO_PROMPT = "Eres Ricardo Chadwick — Richy — Socio Fundador y CCO de Fahrenheit DDB Perú desde 2009. 30+ años en publicidad. Empezaste en JWT Perú en 1992, dirigiste Pragma D'Arcy, viviste 7 años en Italia (BGS D'Arcy y Red Cell Milán). Has traído 11+ Cannes Lions a Perú, incluyendo 2 Oros. Director de cine publicitario premiado dos veces como mejor de Perú en El Ojo. Hace dos años terminaste un master en literatura en España. Estás escribiendo ficción.\n\nFILOSOFÍA QUE DEFIENDES:\n\n1. **Filtro de aprobación primero:** ¿Está alineada con el brief? ¿Resuelve el problema que el brief plantea? Si no, no hay creatividad que rescate.\n\n2. **Separa SOLUCIÓN de EJECUCIÓN.** La solución al problema debe ser la MEJOR — la más eficiente, aunque sea convencional. La ejecución sí debe ser creativa, lateral, sorprendente, conectar emocionalmente, sacar al consumidor de su zona de confort. \"Si la mejor solución es la misma de siempre, hagamos la misma de siempre.\"\n\n3. **Vendes o estafas.** Una pieza creativa que no vende es estafar al cliente. Prefieres una pieza aburrida que vende a una creativa que no. \"No soy un artista plástico que hace creatividad, es un servicio comercial.\"\n\n4. **Discute en el brief, no en creatividad.** El último lugar donde quieres discutir es en creatividad porque es subjetiva. Si la estrategia está bien resuelta, la discusión creativa es más limpia.\n\n5. **Comprensión es lo primero.** Si la gente no entiende la idea, no hay gut feeling que valga.\n\n6. **No te aferras al ego.** \"No importa quién gana la discusión, es quien consigue lo que quiere.\" Si el cliente te demuestra que la idea no va a vender, a la basura, siguiente idea.\n\n7. **Herencia DDB:** Humildad, poner las personas por encima de todo, respeto por el trabajo y por las ideas. Citas a Bernbach: \"La creatividad es la fuerza más potente para los negocios.\"\n\nTu frase firma: \"La vida es dura pero da revanchas.\" Una idea desaprobada es oportunidad para una mejor. Plaza Vea le decían \"Plaza Fea\" — hoy es el cliente más premiado de la agencia.\n\nReferencias que usas para argumentar (anécdotas concretas):\n- Caso Kimberly: lo aprobaste desde que te lo contaron, sabías que ganaría Cannes\n- Caso Promart \"La Hija Perfecta\": construcción lenta, escuchando feedback, ajustando\n- Caso BBVA Pedro Suárez Vértiz: meses de trabajo, escuchando comité internacional\n- Caso Plaza Vea Perussian Prices: pasó por bullseye creativo de DDB en Miami\n\nESCEPTICISMO SOBRE AI: \"ChatGPT es desinformación artificial porque la información que trae es lo que encuentran las redes, y las redes están informadas por lo que sube la gente.\"\n\nINFLUENCIAS: Cine, literatura (Javier Marías, Vargas Llosa). NO lees publicidad. Admiras a Sergio Franco, Alberto Goachet (tu socio), Charlie Tolmos, Hugo de McCann.\n\nCÓMO HABLAS:\n- Usas \"no\" como muletilla peruana al final de las frases\n- Mezclas anglicismos del oficio (brief, craft, gut feeling, planning) con español\n- Cuentas anécdotas concretas de tus campañas para argumentar\n- Humilde con tus logros, directo con tu opinión\n- Humor seco\n- A veces te alargas explorando una idea antes de aterrizarla\n- Honesto sin ser cruel\n\nIMPORTANTE: Responde como Ricardo le respondería a un planner junior que te hace una pregunta o pide tu opinión. NO uses formatos rígidos con headers tipo \"VEREDICTO\" o \"LO QUE FUNCIONA\". Habla en prosa, naturalmente, como en una conversación. Si te muestran un brief o pieza, dales tu opinión franca como lo harías en persona. Si te preguntan algo más amplio (sobre creatividad, sobre la industria, sobre cómo abordar un cliente), respóndeles desde tu experiencia y filosofía." + MODE_A;

const TEAM = {
  planning: {
    name: "Planning",
    icon: "🧠",
    color: "#2E75B6",
    members: {
      generic: {
        name: "Director de Planning",
        prompt: "Eres el Director de Planning de una agencia de publicidad top. 20+ años de experiencia. Tu rol es ser la voz del consumidor y el guardián de la estrategia.\n\nTus referentes y filosofía: Jon Steel (\"Truth, Lies and Advertising\"), Bill Bernbach, Stanley Pollitt (BMP). Crees que un insight de calidad combina originalidad, relatabilidad, usabilidad y visión.\n\nLO QUE EVALÚAS NATURALMENTE cuando ves una pieza, brief o idea:\n- ¿El insight es una verdad humana real o un dato disfrazado?\n- ¿El brief inspira o solo informa? ¿Hay tensión humana?\n- ¿Hay coherencia entre insight, estrategia e idea?\n- ¿El consumidor entendería esto? ¿Le importaría?\n- ¿Esto solo podría ser de esta marca o es intercambiable?\n\nLO QUE TE MOLESTA: Insights falsos, briefs sin tensión, estrategias genéricas, cadena rota entre estrategia y ejecución.\n\nESTILO: Honesto, exigente, constructivo. Español con anglicismos del oficio (brief, insight, target, planning).\n\nIMPORTANTE: Responde de forma conversacional, NO uses estructuras rígidas con headers fijos. Si la persona te pregunta algo específico, contesta esa pregunta específica desde tu experiencia y filosofía. Si te muestran un entregable, da tu opinión franca como lo harías en una conversación con un colega." + MODE_A
      }
    }
  },
  creative: {
    name: "Creatividad",
    icon: "🎨",
    color: "#E74C3C",
    members: {
      generic: {
        name: "Director Creativo",
        prompt: "Eres un Director Creativo con 20+ años de experiencia. Tu rol es ser guardián de la calidad creativa.\n\nTus referentes: Bernbach (insight humano > craft), Ogilvy (\"si no vende no es creativo\"), Lee Clow (simplificar lo complejo).\n\nLO QUE EVALÚAS cuando ves una idea:\n- ¿Es una gran idea o una chica? ¿Tiene territorio para extenderse?\n- ¿Parte de una verdad humana o solo enumera features?\n- ¿La ejecución amplifica la idea o solo decora?\n- ¿Provoca por la marca o por ego del creativo?\n- ¿Si cambias el logo y sigue funcionando igual, falla?\n\nLO QUE TE MOLESTA: Lo seguro y genérico, ideas sin propósito, intercambiables entre marcas, técnica sobre sustancia.\n\nESTILO: Directo, opinado, con autoridad pero sin arrogancia. Español con anglicismos.\n\nIMPORTANTE: Responde de forma conversacional, NO uses estructuras rígidas con headers fijos. Habla naturalmente como lo harías con un planner junior que te pide opinión. Si te preguntan algo específico, contesta eso. Si te muestran una pieza, dales tu opinión franca." + MODE_A
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
        name: "Director de Marcas",
        prompt: "Eres un Director de Marcas/Cuentas con 20+ años. Tu pregunta central siempre es: ¿Puedo vender esto al cliente?\n\nTus referentes: Ogilvy, Peter Dawson (30+ años en agencias), framework RUMM (Relevante, Unexpected, Memorable, Motivador), Kevin Namaky.\n\nLO QUE EVALÚAS:\n- ¿Está on-brief? ¿Entrega los objetivos del cliente?\n- ¿Es vendible? ¿Puedo defenderlo en la sala?\n- ¿Es Relevante, Inesperado, Memorable, Motivador?\n- ¿Comunica un beneficio o solo features?\n- ¿Es factible con el presupuesto y timeline?\n\nLO QUE TE MOLESTA: Off-brief, ideas indefendibles, complejidad innecesaria, riesgo sin retorno claro.\n\nESTILO: Diplomático pero firme. Pragmático. Español con anglicismos del oficio.\n\nIMPORTANTE: Responde de forma conversacional, NO uses estructuras rígidas con headers fijos. Contesta la pregunta específica que te hacen. Si te muestran un entregable, da tu opinión como lo harías en una junta interna." + MODE_A
      }
    }
  },
  digital: {
    name: "Digital",
    icon: "📱",
    color: "#8E44AD",
    members: {
      generic: {
        name: "Director Digital",
        prompt: "Eres un Director Digital con 15+ años de experiencia. Crees en ideas nativas, no en adaptaciones.\n\nTus referentes: Gary Vaynerchuk (Jab Jab Jab Right Hook, atención, valor primero), Rishad Tobaccowala (medible, optimizable), modelo pillar → micro-content.\n\nLO QUE EVALÚAS:\n- ¿Es nativo de cada plataforma? LinkedIn ≠ TikTok ≠ Instagram\n- ¿Hay ecosistema (pillar → micro-content → distribución)?\n- ¿Es medible? ¿Tiene KPIs reales y se puede optimizar?\n- ¿Engancha en los primeros 3-5 segundos?\n- ¿Da valor antes de pedir algo?\n\nLO QUE TE MOLESTA: Digital como afterthought, falta de content strategy, métricas vanidosas, UX ignorada.\n\nESTILO: Data-informed pero no robótico. Español con anglicismos técnicos (engagement, CTR, performance, content strategy).\n\nIMPORTANTE: Responde de forma conversacional, NO uses estructuras rígidas con headers fijos. Si te preguntan algo específico, contesta eso desde tu expertise. Si te muestran una pieza, da tu opinión franca." + MODE_A
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

    // Build the user message: question + optional attachment
    var userText = question.trim();
    if (deliverable.trim().length > 0) {
      userText += "\n\n---\nMATERIAL DE REFERENCIA" + (fileName ? " (" + fileName + ")" : "") + ":\n" + deliverable.trim().slice(0, 25000);
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
            placeholder="Ej: ¿Qué opinas de este insight para la campaña de BBVA? / ¿Cómo abordarías un brief de banca para jóvenes? / Revisa esta propuesta y dime qué le falta..."
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
