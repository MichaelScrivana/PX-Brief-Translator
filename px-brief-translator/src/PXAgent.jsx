import { useState, useRef, useEffect } from "react";

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

const TOOLS_INFO = [
  {
    name: "Brief Translator",
    url: "https://proud-moss-0a781bf03.1.azurestaticapps.net",
    description: "Takes a project brief and generates six tailored working briefs for each PX sub-home.",
  },
  {
    name: "Persona Generator",
    url: "https://calm-mushroom-0cfaf7f0f.1.azurestaticapps.net",
    description: "Synthesizes consumer personas with health contexts, decision styles, and journey maps.",
  },
];

const QUICK_REPLIES = {
  "What tools are available?": `Here are the PX AI tools:\n\n• **Brief Translator** — Takes a project brief and generates six tailored working briefs for each PX sub-home (Research, Brand, Product, Innovation, Engineering, Graphics).\n→ [Open Brief Translator](${TOOLS_INFO[0].url})\n\n• **Persona Generator** — Synthesizes rich consumer personas with health contexts, decision styles, AI agent behaviors, and deep-dive journey maps.\n→ [Open Persona Generator](${TOOLS_INFO[1].url})`,
  "How do I get started?": `Great question! Here's how to get started:\n\n1. **Set up your API** — Click "API Setup" in any tool to configure your provider (Bayer myGenAssist, Azure OpenAI, or Anthropic Claude).\n\n2. **Brief Translator** — Paste or upload a project brief, then click "Translate" to generate sub-home working briefs.\n\n3. **Persona Generator** — Click "Start" to run the synthesis loop and generate consumer personas. You can deep-dive into each one and test concepts.\n\nNeed help with a specific tool?`,
  "Take me to Brief Translator": `Here's the link:\n\n→ [Open Brief Translator](${TOOLS_INFO[0].url})\n\nThis tool takes a single project brief and generates six tailored working briefs for each PX sub-home.`,
  "Take me to Persona Generator": `Here's the link:\n\n→ [Open Persona Generator](${TOOLS_INFO[1].url})\n\nThis tool synthesizes consumer personas with health contexts, AI agent behaviors, and journey maps.`,
};

export default function PXAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the PX AI assistant. I can help you navigate the tools and answer questions.\n\nTry asking me what's available or how to get started!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Check for quick replies (fuzzy match)
    const lowerText = text.toLowerCase();
    let reply = null;

    if (lowerText.includes("tool") || lowerText.includes("available") || lowerText.includes("what can")) {
      reply = QUICK_REPLIES["What tools are available?"];
    } else if (lowerText.includes("start") || lowerText.includes("how do") || lowerText.includes("begin") || lowerText.includes("setup")) {
      reply = QUICK_REPLIES["How do I get started?"];
    } else if (lowerText.includes("brief") && (lowerText.includes("go") || lowerText.includes("open") || lowerText.includes("take") || lowerText.includes("link"))) {
      reply = QUICK_REPLIES["Take me to Brief Translator"];
    } else if (lowerText.includes("persona") && (lowerText.includes("go") || lowerText.includes("open") || lowerText.includes("take") || lowerText.includes("link"))) {
      reply = QUICK_REPLIES["Take me to Persona Generator"];
    } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      reply = "Hey! How can I help? I can tell you about the available tools, help you get started, or take you to a specific tool.";
    } else if (lowerText.includes("thank")) {
      reply = "You're welcome! Let me know if you need anything else.";
    } else {
      reply = `I can help you navigate the PX AI tools! Try asking:\n\n• "What tools are available?"\n• "How do I get started?"\n• "Take me to Brief Translator"\n• "Take me to Persona Generator"`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = ["What tools are available?", "How do I get started?"];

  // Render markdown-like links
  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      // Convert [text](url) to clickable links
      const linkified = line.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #0071e3; text-decoration: none;">$1 ↗</a>'
      );
      const bolded = linkified.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const isBullet = line.startsWith("• ") || line.startsWith("→ ");

      return (
        <span key={i}>
          {isBullet ? (
            <span className="pxa-bullet" dangerouslySetInnerHTML={{ __html: bolded }} />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: bolded }} />
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {!open && (
        <button className="pxa-fab" onClick={() => setOpen(true)} title="PX Assistant">
          <ChatIcon />
          <span className="pxa-fab-label">PX Agent</span>
        </button>
      )}

      {open && (
        <div className="pxa-panel">
          <div className="pxa-header">
            <div className="pxa-header-left">
              <span className="pxa-header-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                </svg>
              </span>
              <div>
                <div className="pxa-header-title">PX Agent</div>
                <div className="pxa-header-status">Navigation & help</div>
              </div>
            </div>
            <button className="pxa-close" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className="pxa-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`pxa-msg ${msg.role === "user" ? "pxa-msg-user" : "pxa-msg-assistant"}`}>
                {msg.role === "assistant" && (
                  <div className="pxa-avatar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                )}
                <div className={`pxa-bubble ${msg.role === "user" ? "pxa-bubble-user" : "pxa-bubble-assistant"}`}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="pxa-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="pxa-suggestion" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="pxa-input-area">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about PX tools..."
              className="pxa-input"
            />
            <button className="pxa-send" onClick={handleSend} disabled={!input.trim()} title="Send">
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
