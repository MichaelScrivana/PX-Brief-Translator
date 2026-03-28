import { useState, useEffect, useRef } from "react";
import { SECTIONS } from "./caseStudySections";
import * as XLSX from "xlsx";
import "./styles.css";

const AI_HUB_URL = "https://salmon-island-0f8fa491e.4.azurestaticapps.net";

const SAMPLE_INPUT = `We redesigned the Elevit brand across all markets. The goal was to make it more modern and appeal to younger parents. The team did pack design, brand identity, and some research. Results were positive — research showed improvement in purchase intent. We launched in China first, then EMEA. The design uses a heart shape motif. Jacqueline and Beth led the project.`;

// ── SVG Icons ──
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ── Section SVG Icons (matching Hub style) ──
const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const LayersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const TrendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const PenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
  </svg>
);

const SECTION_ICONS = { tag: TagIcon, target: TargetIcon, layers: LayersIcon, users: UsersIcon, trending: TrendingIcon, send: SendIcon, pen: PenIcon };

const RATING_CONFIG = {
  strong: { label: "Strong", color: "#10b981", icon: "\u2713" },
  vague: { label: "Needs Work", color: "#f59e0b", icon: "\u26A0" },
  missing: { label: "Missing", color: "#ef4444", icon: "\u2717" },
};

// Demo output for when no API is configured
const DEMO_RESULT = {
  sections: {
    title: {
      rating: "vague",
      content: "Elevit: Brand Redesign",
      suggestions: ["Good brand name, but specify the scope — is this a full redesign or a refresh? Consider: 'Elevit: Global Brand Redesign & Identity Evolution'"],
    },
    objective: {
      rating: "vague",
      content: "Make the Elevit brand more modern and appeal to younger parents across all markets.",
      suggestions: [
        "Too generic — 'more modern' doesn't tell us the strategic ambition. What was the brand positioning goal?",
        "Add consumer context: who are these younger parents? What life stage?",
        "Compare to the gold standard: 'position itself as a global category leader supporting consumers from pre-conception through the first 2000 days'",
      ],
    },
    services: {
      rating: "vague",
      content: "Pack Design, Brand Identity, Research",
      suggestions: [
        "'Some research' is vague — was this Product Research, Consumer Research, or both?",
        "Was there Science Storytelling, Graphic Innovation, or Graphics Business Protection involved?",
        "List all PX capabilities that contributed to the project",
      ],
    },
    team: {
      rating: "vague",
      content: "Jacqueline, Beth",
      suggestions: [
        "Include full names (last names) for proper attribution",
        "Are there other team members? The Elevit project had 5 core team members",
      ],
    },
    outcomes: {
      rating: "vague",
      content: "Research showed improvement in purchase intent.",
      suggestions: [
        "This is the weakest section — 'positive results' and 'improvement' tell us nothing",
        "Add specific numbers: what was the purchase intent before vs. after? In which markets?",
        "Include research methodology (e.g., 'validated via EyeSee research')",
        "Add other metrics: findability, navigation clarity, emotional response, trademark status",
      ],
    },
    launch: {
      rating: "vague",
      content: "Launched in China first, then EMEA.",
      suggestions: [
        "Add specific years/dates for each market",
        "Are there future markets planned? Include the full rollout timeline",
      ],
    },
    detail: {
      rating: "vague",
      content: "The design uses a heart shape motif.",
      suggestions: [
        "Expand significantly — what is the design rationale behind the heart motif?",
        "Describe the Brand World: what visual system was created?",
        "What distinctive brand assets were developed?",
        "Was there a science storytelling component?",
        "How was graphic adaptation handled across markets?",
      ],
    },
  },
  overallScore: 3,
  summary: "This summary captures the basics but reads like internal notes, not a case study. Every section needs more specificity — especially Outcomes (add real metrics) and Design Detail (tell the creative story). The Elevit project has strong material; this draft doesn't yet do it justice.",
};

export default function CaseStudySharpener() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "## PX Case Study Sharpener\n\nHi! I'll help you build a case study ready for PX.com. How would you like to work?\n\n**Option 1 — Walk me through it**\nWe'll go section by section: Title, Objective, Key Services, Core Team, Outcomes, Launch, and Design Detail. I'll guide you through each one.\n\n**Option 2 — Paste what you have**\nDrop in whatever you've got — notes, emails, bullet points — and I'll review it all at once and give you my assessment.\n\nWhich do you prefer?" },
  ]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Backend API ──
  const API_BASE = import.meta.env.VITE_API_BASE ?? "";
  const [showConfig, setShowConfig] = useState(false);
  const [configSaved] = useState(true); // Always connected via backend

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, result]);

  const isDemo = false; // Always live — connected via backend to Foundry agent

  const callAPI = async (allMessages) => {
    const apiMessages = allMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || `API error ${res.status}`);
    }
    const data = await res.json();
    return data.response;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setError(""); setLoading(true);

    if (isDemo) {
      await new Promise((r) => setTimeout(r, 1500));
      setMessages((prev) => [...prev, { role: "assistant", content: "## Project Title\n\n**What I found:**\nElevit: Brand Redesign\n\n**What's missing or could be stronger:**\n- Good brand name, but specify the scope — is this a full redesign or a refresh?\n\n**My suggestion:**\n**Elevit: Global Brand Redesign & Identity Evolution**\n\n---\n\nReady to move to **Objective**? Or would you like to refine the title?" }]);
      setLoading(false);
      return;
    }

    try {
      const raw = await callAPI(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: raw }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Something went wrong: ${e.message}` }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "#10b981";
    if (score >= 5) return "#f59e0b";
    return "#ef4444";
  };

  const [exporting, setExporting] = useState(false);

  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Ask Claude to compile the conversation into structured sections
      const exportPrompt = [
        ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
        {
          role: "user",
          content: `Based on our conversation so far, compile the final case study into this exact JSON format. Use the best version of each section from our discussion. If a section wasn't covered, leave it as an empty string.

{
  "title": "Project title",
  "objective": "The objective text",
  "services": "Key services as a bullet list",
  "team": "Core team names",
  "outcomes": "Outcomes as a bullet list",
  "launch": "Launch timeline",
  "detail": "Design detail text"
}

Respond with ONLY the JSON, no other text.`
        }
      ];

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: exportPrompt.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) throw new Error("Failed to compile case study");
      const data = await res.json();
      const raw = data.response;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse response");
      const s = JSON.parse(jsonMatch[0]);

      // Build Excel matching PX-template.xlsx structure
      const rows = [
        ["PX.com", ""],
        ["Section", "Text"],
        ["Header", "Project"],
        ["", s.title || ""],
        ["", ""],
        ["Overview", ""],
        ["left-side", "Objective"],
        ["", s.objective || ""],
        ["", "Key Services"],
        ["", s.services || ""],
        ["", "Core Team"],
        ["", s.team || ""],
        ["right-side", "Outcomes"],
        ["", s.outcomes || ""],
        ["", "Launch"],
        ["", s.launch || ""],
        ["", ""],
        ["Detail", ""],
        ["Detail", ""],
        ["Image 1", "Design Detail"],
        ["", s.detail || ""],
      ];

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 15 }, { wch: 80 }];
      // Apply text wrap to all column B cells
      for (let r = 0; r < rows.length; r++) {
        const cell = ws[XLSX.utils.encode_cell({ r, c: 1 })];
        if (cell) {
          if (!cell.s) cell.s = {};
          cell.s.alignment = { wrapText: true, vertical: "top" };
        }
      }
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const filename = (s.title || "CaseStudy").replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "-");
      XLSX.writeFile(wb, `PX-CaseStudy-${filename}.xlsx`);
    } catch (e) {
      setError(`Export failed: ${e.message}`);
    }
    setExporting(false);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <a href={AI_HUB_URL} className="header-home-link" title="PX AI Hub Home">
            <img src="/img/PX-logo-blk@3x.png" alt="PX" className="logo-circle" />
          </a>
          <span className="header-title">AI Hub</span>
        </div>
        <div className="header-right">
          <span className="header-badge">Case Study Sharpener</span>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Light mode" : "Dark mode"}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <main className="main">
        {error && <div className="error-banner">{error}</div>}

        {/* ── Chat Dialog ── */}
        <div className="chat-conversation">
          <div className="chat-dialog-header">
            <div className="chat-dialog-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="chat-dialog-title">PX Case Study Sharpener</div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-assistant"}`}>
                {msg.role === "assistant" && (
                  <div className="chat-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                )}
                <div className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                  {msg.content.split("\n").map((line, j) => {
                    // Headers
                    if (line.startsWith("### ")) return <h4 key={j} className="chat-h4">{line.slice(4)}</h4>;
                    if (line.startsWith("## ")) return <h3 key={j} className="chat-h3">{line.slice(3)}</h3>;
                    if (line.startsWith("# ")) return <h2 key={j} className="chat-h2">{line.slice(2)}</h2>;
                    // Horizontal rule
                    if (line.trim() === "---") return <hr key={j} className="chat-hr" />;
                    // Empty line
                    if (!line.trim()) return <div key={j} className="chat-spacer" />;
                    // Bullet points
                    const isBullet = line.match(/^(\s*[-•]\s)/);
                    // Inline formatting: bold, italic, inline code
                    let html = line
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`(.*?)`/g, '<code class="chat-code">$1</code>');
                    if (isBullet) {
                      html = html.replace(/^\s*[-•]\s/, '');
                      return <div key={j} className="chat-bullet"><span className="chat-bullet-dot" /><span dangerouslySetInnerHTML={{ __html: html }} /></div>;
                    }
                    return <p key={j} className="chat-p" dangerouslySetInnerHTML={{ __html: html }} />;
                  })}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg chat-msg-assistant">
                <div className="chat-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="chat-bubble chat-bubble-assistant">
                  <div className="chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            {/* Export button — shows after first assistant response */}
            {messages.length > 2 && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="export-btn" onClick={exportToExcel} disabled={exporting} title="Export to PX template">
                  {exporting ? (
                    <><div className="spinner" style={{ width: 14, height: 14 }} /> Compiling...</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export to Excel
                    </>
                  )}
                </button>
                <a
                  href="https://bayergroup.sharepoint.com/sites/PackagingDesign299/_layouts/15/Doc.aspx?sourcedoc=%7B14D6CD0D-24B1-422F-A03F-32645C67C964%7D&file=px_com%20master%20template.xlsx&action=default&mobileredirect=true&DefaultItemOpen=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="export-btn export-btn-sp"
                  title="Open PX template on SharePoint"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in SharePoint
                </a>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Chat Input ── */}
          <div className="chat-input-bar">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your project summary here..."
              className="chat-input"
              rows={1}
              disabled={loading}
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || loading} title="Send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
