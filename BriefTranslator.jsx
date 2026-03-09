import { useState, useRef } from "react";

const SUB_HOMES = [
  { id: "research", label: "Product Research", icon: "🔬", color: "#2563eb" },
  { id: "brand", label: "Brand Design", icon: "🎨", color: "#7c3aed" },
  { id: "product", label: "Product Design", icon: "📐", color: "#059669" },
  { id: "innovation", label: "Packaging Innovation", icon: "💡", color: "#d97706" },
  { id: "engineering", label: "Packaging Engineering", icon: "⚙️", color: "#dc2626" },
  { id: "graphics", label: "Graphics Management", icon: "🖼️", color: "#0891b2" },
];

const SYSTEM_PROMPTS = {
  research: `You are a Product Research specialist at a CPG company's Product Experience (PX) organization. Given a product brief, translate it into a Research working brief that covers:

1. **Consumer Insight Requirements** — What HUT (Home Use Test) and CLT (Central Location Test) studies are needed? What existing research can be leveraged?
2. **Claims Development Priorities** — What benefit claims need substantiation? What evidence gaps exist?
3. **Competitive Landscape Analysis** — What consumer perception benchmarks should be established against competitors?
4. **Sensory & Experience Profiling** — What sensory attributes need to be defined and tested?
5. **Open Questions** — What critical information is missing from the brief that Research needs before starting?

Write in a structured, professional format. Be specific about methodologies. Flag gaps clearly.`,

  brand: `You are a Brand Design specialist at a CPG company's Product Experience (PX) organization. Given a product brief, translate it into a Brand Design working brief that covers:

1. **Brand Identity Application** — How does the existing brand identity system apply to this project? What elements are fixed vs. flexible?
2. **Visual Strategy Direction** — What visual territories should be explored? What mood, tone, and aesthetic references align with the brief?
3. **Science Storytelling** — What is the mode-of-action or key benefit narrative that needs visual translation for consumers?
4. **Design Governance Check** — What existing brand guidelines constrain or guide this work? What approvals are needed?
5. **Open Questions** — What critical information is missing from the brief that Brand Design needs before starting?

Write in a structured, professional format. Reference specific design principles. Flag gaps clearly.`,

  product: `You are a Product Design (Industrial/Structural) specialist at a CPG company's Product Experience (PX) organization. Given a product brief, translate it into a Product Design working brief that covers:

1. **Form Factor & Ergonomics** — What physical form requirements emerge from the brief? What ergonomic considerations apply to the target consumer?
2. **CMF Strategy (Color, Material, Finish)** — What material palette and finish options align with the brand and sustainability targets?
3. **Inclusive & Sustainable Design** — What accessibility requirements (grip strength, visual contrast, dexterity) and GAIA sustainability targets apply?
4. **Design for Realisation** — What manufacturing constraints, tooling considerations, and feasibility factors need early screening?
5. **Open Questions** — What critical information is missing from the brief that Product Design needs before starting?

Write in a structured, professional format. Be specific about physical parameters. Flag gaps clearly.`,

  innovation: `You are a Packaging Innovation specialist at a CPG company's Product Experience (PX) organization. Given a product brief, translate it into an Innovation working brief that covers:

1. **Technology Scouting Needs** — What novel materials, structures, or technologies should be investigated for this project?
2. **Cost & Feasibility Framing** — What are the preliminary cost targets and what cost modeling needs to happen early?
3. **IP Landscape Considerations** — What patent searches or freedom-to-operate assessments are needed?
4. **Sustainability & GAIA Alignment** — How does this project map to corporate sustainability targets? What material or process innovations could improve the score?
5. **Open Questions** — What critical information is missing from the brief that Packaging Innovation needs before starting?

Write in a structured, professional format. Reference specific innovation frameworks. Flag gaps clearly.`,

  engineering: `You are a Packaging Engineering specialist at a CPG company's Product Experience (PX) organization. Given a product brief, translate it into an Engineering working brief that covers:

1. **Specification Requirements** — What packaging specifications need to be created or modified? What templates apply?
2. **Quality & Compliance Checks** — What regulatory, quality, and compliance requirements apply to this packaging?
3. **Manufacturing Line Assessment** — What production site capabilities need to be verified? What line trials are needed?
4. **Business Continuity & Risk** — What supply chain risks, material availability concerns, or site transfer implications exist?
5. **Open Questions** — What critical information is missing from the brief that Packaging Engineering needs before starting?

Write in a structured, professional format. Be specific about specifications and standards. Flag gaps clearly.`,

  graphics: `You are a Graphics Management specialist at a CPG company's Product Experience (PX) organization. Given a product brief, translate it into a Graphics Management working brief that covers:

1. **Artwork Lifecycle Planning** — What artwork deliverables are needed? What's the review chain (Legal → Medical → Regulatory)?
2. **Colour Management Requirements** — What Pantone/CMYK standards apply? What colour consistency controls are needed across the supplier network?
3. **Regulatory Content Requirements** — What mandatory text, warnings, ingredient lists, and compliance elements must appear on-pack?
4. **Print & Production Feasibility** — What print processes and substrate considerations affect the artwork execution?
5. **Open Questions** — What critical information is missing from the brief that Graphics Management needs before starting?

Write in a structured, professional format. Reference specific artwork and prepress standards. Flag gaps clearly.`,
};

const SAMPLE_BRIEF = `PROJECT BRIEF: Nature Made Vitamin D3 — Premium Line Relaunch

Objective: Relaunch the Nature Made Vitamin D3 product line with premium positioning targeting health-conscious consumers aged 28-45 who are proactive about preventive wellness.

Background: The current Vitamin D3 line has strong brand recognition but is perceived as "basic" compared to emerging premium competitors. Market research indicates a willingness to pay 30-40% premium for enhanced formulation, sustainable packaging, and modern design.

Target Consumer: Health-conscious professionals, 28-45, urban/suburban. They research supplements before buying, read labels carefully, and increasingly rely on AI assistants and comparison tools for purchase decisions. They value transparency, sustainability certifications, and clinical evidence.

Key Requirements:
- New 2,000 IU and 5,000 IU softgel formulations with enhanced bioavailability
- Sustainable packaging aligned with corporate GAIA targets (30% PCR minimum)
- Premium shelf presence that differentiates from mass-market competitors
- Digital-first product information architecture (QR-linked, agent-readable)
- Launch in Q3 2026 across US retail and DTC channels

Budget: Mid-range for premium supplement category. Tooling investment approved for new bottle forms.

Competitive Context: Key competitors include Ritual, Care/of, and Thorne — all with strong DTC presence, modern branding, and transparent supply chain narratives.

Success Metrics: 15% revenue uplift vs. current line within 12 months. Top-3 ranking in AI-assisted supplement recommendation queries. NPS improvement of +10 points.`;

const API_URL = "https://api.anthropic.com/v1/messages";

export default function BriefTranslator() {
  const [brief, setBrief] = useState("");
  const [activeTab, setActiveTab] = useState("research");
  const [outputs, setOutputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const loadSample = () => setBrief(SAMPLE_BRIEF);

  const translateSingle = async (subHomeId, briefText, key) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPTS[subHomeId],
        messages: [
          {
            role: "user",
            content: `Here is the project brief to translate into a ${SUB_HOMES.find((s) => s.id === subHomeId).label} working brief:\n\n${briefText}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error ${res.status}`);
    }
    const data = await res.json();
    return data.content[0].text;
  };

  const translateAll = async () => {
    if (!brief.trim()) return setError("Paste or load a project brief first.");
    if (!apiKey.trim()) return setShowKeyInput(true);
    setError("");
    setLoading(true);
    setOutputs({});
    setProgress({ done: 0, total: SUB_HOMES.length });

    for (let i = 0; i < SUB_HOMES.length; i++) {
      const sh = SUB_HOMES[i];
      try {
        const result = await translateSingle(sh.id, brief, apiKey);
        setOutputs((prev) => ({ ...prev, [sh.id]: result }));
        setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        if (i === 0) setActiveTab(sh.id);
      } catch (e) {
        setOutputs((prev) => ({ ...prev, [sh.id]: `Error: ${e.message}` }));
        setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      }
    }
    setLoading(false);
  };

  const completionPct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f8f9fb", minHeight: "100vh", color: "#1a1a2e" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "3px solid #e94560" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="42" height="42" viewBox="0 0 42 42" style={{ borderRadius: 6 }}>
              <rect width="42" height="42" fill="#000" />
              <text x="21" y="28" textAnchor="middle" fill="#fff" fontFamily="'Inter', Arial, Helvetica, sans-serif" fontSize="22" fontWeight="900" letterSpacing="-0.5">PX</text>
            </svg>
          <div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Brief Translator</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 500 }}>Product Experience • Agent Workflow Demo</div>
          </div>
        </div>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{progress.done}/{progress.total} sub-homes</div>
            <div style={{ width: 120, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${completionPct}%`, height: "100%", background: "#e94560", borderRadius: 3, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* API Key Section */}
        {showKeyInput && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>Anthropic API Key:</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, outline: "none" }}
            />
            <button onClick={() => { if (apiKey.trim()) { setShowKeyInput(false); translateAll(); } }} style={{ padding: "8px 20px", borderRadius: 8, background: "#1a1a2e", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Connect & Run
            </button>
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>{error}</div>
        )}

        {/* Input Section */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Project Brief</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={loadSample} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8f9fb", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#64748b", transition: "all 0.15s" }}>
                Load Sample Brief
              </button>
              <button
                onClick={translateAll}
                disabled={loading}
                style={{
                  padding: "7px 18px", borderRadius: 8, border: "none",
                  background: loading ? "#94a3b8" : "linear-gradient(135deg, #e94560, #c62a47)",
                  color: "#fff", fontSize: 12, fontWeight: 700, cursor: loading ? "default" : "pointer",
                  boxShadow: loading ? "none" : "0 2px 8px rgba(233,69,96,0.3)", transition: "all 0.15s"
                }}
              >
                {loading ? `Translating... (${progress.done}/${progress.total})` : "Translate to All Sub-Homes →"}
              </button>
            </div>
          </div>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Paste your project brief here, or click 'Load Sample Brief' to try the demo..."
            style={{
              width: "100%", minHeight: 180, padding: 16, borderRadius: 10,
              border: "1px solid #e2e8f0", fontSize: 13.5, lineHeight: 1.7,
              resize: "vertical", outline: "none", fontFamily: "inherit",
              background: "#fafbfc", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Output Section */}
        {(Object.keys(outputs).length > 0 || loading) && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
              {SUB_HOMES.map((sh) => {
                const isActive = activeTab === sh.id;
                const hasOutput = outputs[sh.id];
                const isError = hasOutput && hasOutput.startsWith("Error:");
                return (
                  <button
                    key={sh.id}
                    onClick={() => setActiveTab(sh.id)}
                    style={{
                      flex: "1 0 auto", padding: "14px 16px", border: "none",
                      background: isActive ? "#fff" : "#f8f9fb",
                      borderBottom: isActive ? `3px solid ${sh.color}` : "3px solid transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, fontSize: 12.5, fontWeight: isActive ? 700 : 500,
                      color: isActive ? sh.color : "#64748b", transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                  >
                    <span>{sh.icon}</span>
                    <span>{sh.label}</span>
                    {hasOutput && !isError && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", marginLeft: 4 }} />}
                    {isError && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", marginLeft: 4 }} />}
                    {!hasOutput && loading && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", marginLeft: 4, animation: "pulse 1.5s infinite" }} />}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div style={{ padding: 28, minHeight: 300 }}>
              {outputs[activeTab] ? (
                <div style={{ fontSize: 13.5, lineHeight: 1.8, color: "#334155", whiteSpace: "pre-wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 22 }}>{SUB_HOMES.find((s) => s.id === activeTab)?.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>
                        {SUB_HOMES.find((s) => s.id === activeTab)?.label} Working Brief
                      </div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
                        Auto-translated from project brief • Agent-generated
                      </div>
                    </div>
                  </div>
                  {formatMarkdown(outputs[activeTab])}
                </div>
              ) : loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 12 }}>
                  <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#e94560", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <div style={{ color: "#94a3b8", fontSize: 13 }}>Translating brief for {SUB_HOMES.find((s) => s.id === activeTab)?.label}...</div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#94a3b8", fontSize: 13 }}>
                  Paste a brief and click "Translate" to see results
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{ textAlign: "center", marginTop: 32, color: "#94a3b8", fontSize: 11.5 }}>
          PX Brief Translator • Powered by Claude • Product Experience AI Workshop Demo
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        textarea:focus { border-color: #e94560 !important; box-shadow: 0 0 0 3px rgba(233,69,96,0.08); }
        button:hover { opacity: 0.92; }
      `}</style>
    </div>
  );
}

function formatMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", margin: "24px 0 10px" }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "20px 0 8px" }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} style={{ fontSize: 13.5, fontWeight: 700, color: "#475569", margin: "16px 0 6px" }}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0", paddingLeft: 8 }}>
          <span style={{ color: "#e94560", fontWeight: 700 }}>•</span>
          <span>{formatInline(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1];
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, margin: "4px 0", paddingLeft: 8 }}>
          <span style={{ color: "#e94560", fontWeight: 700, minWidth: 18 }}>{num}.</span>
          <span>{formatInline(line.replace(/^\d+\.\s/, ""))}</span>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
    } else {
      elements.push(
        <p key={i} style={{ margin: "4px 0" }}>{formatInline(line)}</p>
      );
    }
    i++;
  }

  return elements;
}

function formatInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: "#1a1a2e" }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}