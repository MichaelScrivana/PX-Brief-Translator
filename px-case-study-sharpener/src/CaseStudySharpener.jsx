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

// Case study icon — document with magnifying glass
const CaseStudyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="11" cy="15" r="3" />
    <line x1="13.1" y1="17.1" x2="15" y2="19" />
  </svg>
);

// ── Fun thinking messages (PX-themed) ──
const THINKING_MESSAGES = [
  "Reviewing brand architecture...",
  "Cross-referencing PX case studies...",
  "Checking the creative rationale...",
  "Evaluating pack design impact...",
  "Scanning for missing metrics...",
  "Sharpening the narrative arc...",
  "Consulting the PX playbook...",
  "Assessing consumer insight depth...",
  "Benchmarking against best-in-class...",
  "Polishing the storytelling...",
  "Examining launch strategy...",
  "Calibrating the sharpness meter...",
  "Interrogating vague language...",
  "Channeling design excellence...",
  "Hunting for specificity...",
];

const NewChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
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

const DEFAULT_GUIDELINES = `PX.com Case Study Guidelines

BACKGROUND
The PX.com website captures who we are, our services, our projects (case studies), and contact info. The goal is to build awareness and increase demand from our organisation for our services. Our target audience is primarily global and local marketing, and key members of the Science community.

Our key focus is adding more case studies to capture tangible examples of the diversity of our impact.

CASE STUDY STRUCTURE

Objective: An outline of the core project objective, framed within the context of a brand, capturing the problem statement and target outcome / benefit to the business, consumer and/or environment. Approx 30-40 words maximum.

Key Services: A bullet point list drawn from the master list of 15 PX services (see below). Only use services from this list.

Core Team: The names of the core PX team members (full names).

Outcomes: A bullet point list of key achievements and deliverables. These should ladder up to the objective, and can include milestones (research results, IP granted) as well as in-market impact / business results. Approx 4-6 bullets, each ideally a single sentence, approx 8-15 words maximum.

Launch: Target or actual launch date and key markets / regions.

Image Text: Hero image captures the essence of the project. Supplementary images with text bring to life key deliverables, often linked to our services.

OPTIMISATION GOALS
- Ensure consistency in language, tone and detail across all case studies
- Vocabulary relevant to our SME but clear to non-experts of PX disciplines
- Copy delivers on the intent of each section as framed above
- Services must be from the master list of 15 PX services only
- Optimise phrasing to maximise clarity and impact related to our mission
- Optimise word count per section guidelines above

MASTER LIST OF 15 PX SERVICES

Product Research:
- Foundational Product Insights
- Science Insights
- Product Research
- Product Claims

Design:
- Futuring
- Brand Identity (2D & 3D)
- Brand World
- Science Storytelling
- Product Experience Design

Packaging:
- Packaging Strategy
- Packaging Innovation
- Packaging Business Protection
- Graphic Innovation
- Graphic Business Protection
- Environmental Claims
- Data Analytics & Reporting`;

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
  const INITIAL_MESSAGE = { role: "assistant", content: "## PX Case Study Sharpener\n\nI'll help you turn project notes into a polished case study for PX.com. How would you like to start?" };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [mode, setMode] = useState(null); // null = picking, "guided" | "paste" | "example"
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

  // ── Thinking message cycling ──
  const [thinkingMsg, setThinkingMsg] = useState("");
  useEffect(() => {
    if (!loading) { setThinkingMsg(""); return; }
    // Pick a random starting message
    setThinkingMsg(THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]);
    const interval = setInterval(() => {
      setThinkingMsg((prev) => {
        let next;
        do { next = THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]; } while (next === prev);
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const isDemo = false; // Always live — connected via backend to Foundry agent

  const callAPI = async (allMessages) => {
    const apiMessages = allMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    // Prepend guidelines as context if enabled
    if (guidelinesEnabled && guidelines.trim()) {
      apiMessages.unshift({
        role: "user",
        content: `[REVIEW GUIDELINES — Use these criteria when evaluating case studies]\n\n${guidelines.trim()}`,
      }, {
        role: "assistant",
        content: "Understood. I'll use these guidelines as my evaluation criteria when reviewing case study content.",
      });
    }

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
  const [copied, setCopied] = useState(false);

  // ── Guidelines ──
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [guidelines, setGuidelines] = useState(() => {
    return localStorage.getItem("px-cs-guidelines") ?? DEFAULT_GUIDELINES;
  });
  const [guidelinesEnabled, setGuidelinesEnabled] = useState(() => {
    return localStorage.getItem("px-cs-guidelines-enabled") !== "false";
  });

  const saveGuidelines = (text) => {
    setGuidelines(text);
    localStorage.setItem("px-cs-guidelines", text);
  };
  const toggleGuidelines = (on) => {
    setGuidelinesEnabled(on);
    localStorage.setItem("px-cs-guidelines-enabled", String(on));
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setResult(null);
    setError("");
    setInput("");
    setMode(null);
  };

  const selectMode = (chosen) => {
    setMode(chosen);
    if (chosen === "guided") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: "Walk me through it section by section." },
        { role: "assistant", content: "Let's build your case study step by step.\n\n### Objective\n\nWhat's the core project objective? Frame it around the brand, the problem statement, and the target outcome or benefit.\n\nAim for **30-40 words** — concise but clear enough that someone outside PX understands the ambition.\n\nFor example: *\"Redesign the Elevit brand identity across all global markets to reposition as a category leader supporting consumers from pre-conception through the first 2,000 days.\"*" },
      ]);
    } else if (chosen === "paste") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: "I'll paste what I have." },
        { role: "assistant", content: "Go ahead — paste your project notes, emails, bullet points, or draft copy below.\n\nI'll review it against the PX.com case study structure:\n- **Objective** (30-40 words)\n- **Key Services** (from the master list of 15)\n- **Core Team** (full names)\n- **Outcomes** (4-6 bullets, 8-15 words each)\n- **Launch** (date + markets)\n- **Image Text** (hero + supporting visuals)\n\nI'll tell you what's strong, what needs work, and what's missing." },
      ]);
    } else if (chosen === "example") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: SAMPLE_INPUT },
      ]);
      // Send the sample to the API
      const newMessages = [...messages, { role: "user", content: SAMPLE_INPUT }];
      setError(""); setLoading(true);
      callAPI(newMessages)
        .then((raw) => setMessages((prev) => [...prev, { role: "assistant", content: raw }]))
        .catch((e) => setMessages((prev) => [...prev, { role: "assistant", content: `Something went wrong: ${e.message}` }]))
        .finally(() => setLoading(false));
    }
  };

  const copyForSharePoint = async () => {
    setExporting(true);
    try {
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

      // Build tab-separated values matching PX template structure
      // Excel/SharePoint understands TSV when pasting
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

      const tsv = rows.map((r) => r.join("\t")).join("\n");
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      // Also open SharePoint in a new tab
      window.open("https://bayergroup.sharepoint.com/sites/PackagingDesign299/_layouts/15/Doc.aspx?sourcedoc=%7B14D6CD0D-24B1-422F-A03F-32645C67C964%7D&file=px_com%20master%20template.xlsx&action=default&mobileredirect=true&DefaultItemOpen=1", "_blank");
    } catch (e) {
      setError(`Copy failed: ${e.message}`);
    }
    setExporting(false);
  };

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
          {messages.length > 1 && (
            <button className="new-chat-btn" onClick={handleNewChat} title="New conversation">
              <NewChatIcon /> New
            </button>
          )}
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Light mode" : "Dark mode"}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* ── Guidelines Modal ── */}
      {showGuidelines && (
        <div className="guidelines-overlay" onClick={() => setShowGuidelines(false)}>
          <div className="guidelines-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guidelines-modal-header">
              <h2 className="guidelines-modal-title">Review Guidelines</h2>
              <p className="guidelines-modal-desc">
                Define what makes a great case study. The AI will use these criteria when reviewing drafts.
              </p>
            </div>
            <div className="guidelines-toggle-row">
              <label className="guidelines-toggle-label">
                <input
                  type="checkbox"
                  checked={guidelinesEnabled}
                  onChange={(e) => toggleGuidelines(e.target.checked)}
                />
                <span className="guidelines-toggle-switch" />
                <span>{guidelinesEnabled ? "Guidelines active" : "Guidelines off"}</span>
              </label>
              <button
                className="guidelines-reset-btn"
                onClick={() => saveGuidelines(DEFAULT_GUIDELINES)}
                title="Reset to default"
              >
                Reset to default
              </button>
            </div>
            <textarea
              className="guidelines-textarea"
              value={guidelines}
              onChange={(e) => saveGuidelines(e.target.value)}
              placeholder="Describe your criteria for evaluating case studies..."
              rows={16}
            />
            <div className="guidelines-modal-footer">
              <button className="guidelines-done-btn" onClick={() => setShowGuidelines(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        {error && <div className="error-banner">{error}</div>}

        {/* ── Chat Dialog ── */}
        <div className="chat-conversation">
          <div className="chat-dialog-header">
            <div className="chat-dialog-avatar">
              <CaseStudyIcon size={16} />
            </div>
            <div className="chat-dialog-title">PX Case Study Sharpener</div>
            {guidelinesEnabled && (
              <div className="chat-guidelines-badge" onClick={() => setShowGuidelines(true)} title="Edit guidelines">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Guidelines ON
              </div>
            )}
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-assistant"} chat-msg-enter`}>
                {msg.role === "assistant" && (
                  <div className="chat-avatar">
                    <CaseStudyIcon size={14} />
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
              <div className="chat-msg chat-msg-assistant chat-msg-enter">
                <div className="chat-avatar">
                  <CaseStudyIcon size={14} />
                </div>
                <div className="chat-bubble chat-bubble-assistant thinking-bubble">
                  <div className="thinking-status">
                    <div className="thinking-spinner" />
                    <span className="thinking-text" key={thinkingMsg}>{thinkingMsg}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Copy for SharePoint button — shows after first assistant response */}
            {messages.length > 2 && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="export-btn export-btn-sp"
                  onClick={copyForSharePoint}
                  disabled={exporting}
                  title="Copy formatted data for pasting into SharePoint Excel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copied ? "Copied!" : "Copy for SharePoint"}
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Mode Selection or Chat Input ── */}
          {!mode ? (
            <div className="mode-picker">
              <button className="mode-option" onClick={() => selectMode("guided")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Walk me through it
              </button>
              <button className="mode-option" onClick={() => selectMode("paste")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Paste what I have
              </button>
              <button className="mode-option" onClick={() => selectMode("example")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Try the example
              </button>
            </div>
          ) : (
            <div className="chat-input-bar">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                className="chat-input"
                rows={2}
                disabled={loading}
              />
              <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || loading} title="Send">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
