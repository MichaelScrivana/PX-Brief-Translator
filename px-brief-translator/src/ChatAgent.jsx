import { useState, useRef, useEffect, useCallback } from "react";

// ── SVG Icons ──
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
  </svg>
);

const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// The "base" MGA chat option — always available
const BASE_OPTION = { key: "__mga_chat__", name: "MGA Chat", id: null, isBase: true };

const MGA_BASE = "https://chat.int.bayer.com/api/v2";

export default function ChatAgent({ brief, outputs, subHomes, provider, apiConfig, darkMode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // ── Build the options list: base MGA Chat + custom assistants ──
  const customAssistants = apiConfig.bayerAssistants || [];
  const allOptions = [
    BASE_OPTION,
    ...customAssistants.map((a, i) => ({ key: a.id, name: a.name || `Assistant ${i + 1}`, id: a.id, isBase: false })),
  ];
  const [activeKey, setActiveKey] = useState(BASE_OPTION.key);
  const activeOption = allOptions.find((o) => o.key === activeKey) || allOptions[0];

  // Per-option state: message histories (one per assistant/option)
  const historiesRef = useRef({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isBayer = provider === "bayer";
  const showPickerBar = isBayer && allOptions.length > 1;

  // ── Welcome message ──
  useEffect(() => {
    const count = customAssistants.length;
    let welcome = "Hi! I'm the PX Brief Agent powered by MGA. Ask me anything about the project brief or the sub-home working briefs.";
    if (count > 0) {
      welcome += `\n\nYou also have ${count} custom assistant${count > 1 ? "s" : ""} available — switch between them using the selector above.`;
    }
    welcome += "\n\n• \"What are the key objectives in this brief?\"\n• \"Compare the Research and Brand Design outputs\"\n• \"What gaps did Engineering flag?\"";
    setMessages([{ role: "assistant", content: welcome }]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  // Brief/outputs changed — no special handling needed since context is sent as system prompt each time

  // ── Switch option: save/restore history ──
  const switchOption = useCallback((key) => {
    // Save current
    historiesRef.current[activeKey] = [...messages];
    setActiveKey(key);
    setShowPicker(false);

    const target = allOptions.find((o) => o.key === key);
    if (historiesRef.current[key]) {
      setMessages(historiesRef.current[key]);
    } else {
      const label = target?.isBase ? "MGA Chat" : target?.name || "assistant";
      setMessages([{ role: "assistant", content: `Switched to **${label}**. Ask me anything about the brief!` }]);
    }
  }, [activeKey, messages, allOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiConfig.bayerToken}`,
  });

  // ── Brief context builder ──
  const buildBriefContext = () => {
    let ctx = "";
    if (brief) ctx += `Here is the current project brief:\n\n${brief}\n\n`;
    if (Object.keys(outputs).length > 0) {
      ctx += `Here are the generated sub-home working briefs:\n\n`;
      subHomes.forEach((sh) => {
        if (outputs[sh.id]) ctx += `--- ${sh.icon} ${sh.label} ---\n${outputs[sh.id]}\n\n`;
      });
    }
    return ctx;
  };

  const buildSystemPrompt = () => {
    let sys = `You are the PX Brief Agent, an AI assistant for Bayer's Product Experience organization. You help users understand, analyze, and ask questions about project briefs and the AI-generated sub-home working briefs.\n\nBe concise, specific, and helpful. Reference specific sections and details. Use plain language. When comparing sub-homes, highlight key differences clearly.\n\nHere is the current context:\n\n`;
    if (brief) sys += `## ORIGINAL PROJECT BRIEF\n${brief}\n\n`;
    else sys += `## ORIGINAL PROJECT BRIEF\nNo brief has been entered yet.\n\n`;
    if (Object.keys(outputs).length > 0) {
      sys += `## GENERATED SUB-HOME WORKING BRIEFS\n\n`;
      subHomes.forEach((sh) => {
        if (outputs[sh.id]) sys += `### ${sh.icon} ${sh.label}\n${outputs[sh.id]}\n\n`;
      });
    }
    return sys;
  };

  // ══════════════════════════════════════════════
  //  MGA Chat Completions (base mode)
  // ══════════════════════════════════════════════

  const callMGAChatCompletions = async (conversationMessages) => {
    const res = await fetch(`${MGA_BASE}/chat/completions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        model: apiConfig.bayerModel || "gpt-4o",
        messages: [{ role: "system", content: buildSystemPrompt() }, ...conversationMessages],
        max_tokens: 1500,
        temperature: 0.5,
      }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.detail || e.error?.message || `API error ${res.status}`);
    }
    return (await res.json()).choices[0].message.content;
  };

  // ══════════════════════════════════════════════
  //  MGA Assistants via Chat Completions
  //  (MGA routes assistants through the same
  //   chat/completions endpoint using assistant_id)
  // ══════════════════════════════════════════════

  const callMGAAssistant = async (conversationMessages, assistantId) => {
    // Build messages array: include brief context as a system-level intro
    const systemCtx = buildSystemPrompt();
    const allMessages = [
      { role: "system", content: systemCtx },
      ...conversationMessages,
    ];

    const res = await fetch(`${MGA_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "mga-project": assistantId, // MGA uses this header to route to the assistant
      },
      body: JSON.stringify({
        model: apiConfig.bayerModel || "gpt-4o",
        assistant_id: assistantId, // Also pass in body for compatibility
        messages: allMessages,
        max_tokens: 1500,
        temperature: 0.5,
      }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.detail || e.error?.message || `Assistant API error ${res.status}`);
    }
    return (await res.json()).choices[0].message.content;
  };

  // ══════════════════════════════════════════════
  //  Fallback for non-Bayer providers
  // ══════════════════════════════════════════════

  const callOtherProvider = async (apiMessages) => {
    if (provider === "azure") {
      const url = `${apiConfig.azureEndpoint.replace(/\/$/, "")}/openai/deployments/${apiConfig.azureDeployment}/chat/completions?api-version=${apiConfig.azureApiVersion}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": apiConfig.apiKey },
        body: JSON.stringify({ messages: [{ role: "system", content: buildSystemPrompt() }, ...apiMessages], max_tokens: 1500, temperature: 0.5 }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${res.status}`); }
      return (await res.json()).choices[0].message.content;
    }
    // anthropic
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiConfig.apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: buildSystemPrompt(), messages: apiMessages }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${res.status}`); }
    return (await res.json()).content[0].text;
  };

  // ══════════════════════════════════════════════
  //  SEND MESSAGE — routes based on active option
  // ══════════════════════════════════════════════

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let reply;
      const conversationHistory = newMessages.filter((_, i) => i > 0).map((m) => ({ role: m.role, content: m.content }));

      if (isBayer && activeOption.isBase) {
        // ── Base: MGA LLM via chat completions ──
        reply = await callMGAChatCompletions(conversationHistory);
      } else if (isBayer && !activeOption.isBase) {
        // ── Custom assistant: chat completions with assistant_id ──
        reply = await callMGAAssistant(conversationHistory, activeOption.id);
      } else {
        // ── Azure / Anthropic fallback ──
        reply = await callOtherProvider(conversationHistory);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I ran into an error: ${err.message}` }]);
    }
    setLoading(false);
  };

  // ── Reset current option's state ──
  const resetThread = () => {
    delete historiesRef.current[activeKey];
    setMessages([{ role: "assistant", content: "Conversation reset. Ask me anything about the brief!" }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const hasContext = brief || Object.keys(outputs).length > 0;
  const suggestions = ["Summarize the brief in 3 bullets", "What gaps were flagged?", "Compare all sub-home outputs"];
  const handleSuggestion = (text) => { setInput(text); inputRef.current?.focus(); };

  // ── Determine header label ──
  const headerTitle = activeOption.isBase
    ? "MGA Chat"
    : activeOption.name || "MGA Assistant";
  const headerStatus = activeOption.isBase
    ? `${apiConfig.bayerModel || "gpt-4o"}${hasContext ? " • Brief loaded" : ""}`
    : `MGA Assistant${hasContext ? " • Brief loaded" : ""}`;

  return (
    <>
      {/* ── Floating chat button ── */}
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} title="Ask the Brief Agent">
          <ChatIcon />
          <span className="chat-fab-label">Ask Agent</span>
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <span className="chat-header-icon">
                {activeOption.isBase ? <BotIcon /> : <SparkleIcon />}
              </span>
              <div>
                <div className="chat-header-title">{headerTitle}</div>
                <div className="chat-header-status">{headerStatus}</div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="chat-reset" onClick={resetThread} title="Reset conversation">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
              <button className="chat-close" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* ── Agent picker ── */}
          {showPickerBar && (
            <div className="assistant-picker">
              <button className="assistant-picker-btn" onClick={() => setShowPicker(!showPicker)}>
                {activeOption.isBase ? <BotIcon /> : <SparkleIcon />}
                <span>{activeOption.name}</span>
                <ChevronIcon />
              </button>
              {showPicker && (
                <div className="assistant-picker-dropdown">
                  {allOptions.map((opt) => (
                    <button
                      key={opt.key}
                      className={`assistant-picker-option ${opt.key === activeKey ? "assistant-picker-active" : ""}`}
                      onClick={() => switchOption(opt.key)}
                    >
                      <span className="assistant-picker-dot" style={{ background: opt.key === activeKey ? "var(--accent)" : "var(--border-s)" }} />
                      <div className="assistant-picker-info">
                        <span className="assistant-picker-name">{opt.name}</span>
                        <span className="assistant-picker-id">
                          {opt.isBase ? `Chat completions • ${apiConfig.bayerModel || "gpt-4o"}` : opt.id?.slice(0, 24) + "..."}
                        </span>
                      </div>
                      {opt.key === activeKey && <span className="assistant-picker-check">&#10003;</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-assistant"}`}>
                {msg.role === "assistant" && (
                  <div className="chat-avatar">
                    {activeOption.isBase ? <BotIcon /> : <SparkleIcon />}
                  </div>
                )}
                <div className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                  {msg.content.split("\n").map((line, j) => (
                    <span key={j}>
                      {line.startsWith("• ") ? (
                        <span className="chat-bullet">{line}</span>
                      ) : line.includes("**") ? (
                        <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                      ) : (
                        line
                      )}
                      {j < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg chat-msg-assistant">
                <div className="chat-avatar">{activeOption.isBase ? <BotIcon /> : <SparkleIcon />}</div>
                <div className="chat-bubble chat-bubble-assistant">
                  <div className="chat-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && hasContext && (
            <div className="chat-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="chat-suggestion" onClick={() => handleSuggestion(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasContext ? "Ask about the brief..." : "Enter a brief first to get started..."}
              className="chat-input"
              rows={1}
              disabled={loading}
            />
            <button className="chat-send" onClick={sendMessage} disabled={!input.trim() || loading} title="Send">
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
