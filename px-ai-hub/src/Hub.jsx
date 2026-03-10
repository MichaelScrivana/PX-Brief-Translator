import { useState, useEffect } from "react";
import "./styles.css";

// ── Tool cards data ──
// Add new tools here as they're built
const TOOLS = [
  {
    id: "brief-translator",
    name: "Brief Translator",
    description:
      "Takes a single project brief and generates six tailored working briefs for each PX sub-home — Product Research, Brand Design, Product Design, Packaging Innovation, Packaging Engineering, and Graphics Management.",
    icon: "doc",
    gradient: ["#0071e3", "#00c7ff"],
    tags: ["Briefs", "Sub-Homes", "Workflow"],
    url: "https://proud-moss-0a781bf03.azurestaticapps.net",
    status: "live",
  },
  {
    id: "persona-generator",
    name: "Persona Generator",
    description:
      "Synthesizes rich consumer personas with health contexts, decision styles, AI agent behaviors, and deep-dive journey maps. Test concepts through each persona's eyes using AI.",
    icon: "user",
    gradient: ["#a855f7", "#ec4899"],
    tags: ["Personas", "Consumer", "Concept Testing"],
    url: "https://px-persona-generator.azurestaticapps.net",
    status: "live",
  },
  // ── Add more tools here ──
  // {
  //   id: "next-tool",
  //   name: "Your Next Tool",
  //   description: "Description of what this tool does.",
  //   icon: "sparkle",
  //   gradient: ["#f59e0b", "#ef4444"],
  //   tags: ["Tag1", "Tag2"],
  //   url: "https://your-tool.azurestaticapps.net",
  //   status: "coming-soon",
  // },
];

// ── Animated taglines ──
const TAGLINES = [
  "AI-powered tools for Product Experience.",
  "From Brief to Brilliant.",
  "Remarkable. Responsible.",
  "Design with Purpose.",
  "Innovation at Scale.",
  "Consumer First. Always.",
];

// ── Icon components ──
const DocIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ICONS = { doc: DocIcon, user: UserIcon, sparkle: SparkleIcon };

export default function Hub() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineFade, setTaglineFade] = useState("in");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineFade("out");
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setTaglineFade("in");
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hub">
      {/* ── Header ── */}
      <header className="hub-header">
        <div className="hub-header-left">
          <img src="/img/PX-logo-blk@3x.png" alt="PX" className="hub-logo" />
          <span className="hub-header-title">AI Hub</span>
        </div>
        <div className="hub-header-right">
          <span className="hub-header-badge">{TOOLS.filter(t => t.status === "live").length} tools live</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hub-hero">
        <img
          src="/img/WeArePX1-wht@3x.png"
          alt="We Are PX"
          className="hub-hero-logo"
        />
        <div className="hub-tagline-container">
          <span className={`hub-tagline hub-tagline-${taglineFade}`}>
            {TAGLINES[taglineIndex]}
          </span>
        </div>
        <p className="hub-hero-sub">
          Explore the PX AI toolkit — agent workflows, synthetic research, and intelligent design tools built for Product Experience.
        </p>
      </section>

      {/* ── Tool Grid ── */}
      <section className="hub-grid-section">
        <div className="hub-grid">
          {TOOLS.map((tool) => {
            const IconComponent = ICONS[tool.icon] || SparkleIcon;
            const isComingSoon = tool.status === "coming-soon";
            return (
              <a
                key={tool.id}
                href={isComingSoon ? undefined : tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`hub-card ${isComingSoon ? "hub-card-soon" : ""}`}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient accent bar */}
                <div
                  className="hub-card-accent"
                  style={{
                    background: `linear-gradient(135deg, ${tool.gradient[0]}, ${tool.gradient[1]})`,
                    opacity: hoveredCard === tool.id ? 1 : 0.7,
                  }}
                />

                <div className="hub-card-body">
                  {/* Icon */}
                  <div
                    className="hub-card-icon"
                    style={{
                      background: `linear-gradient(135deg, ${tool.gradient[0]}22, ${tool.gradient[1]}22)`,
                      color: tool.gradient[0],
                    }}
                  >
                    <IconComponent />
                  </div>

                  {/* Content */}
                  <div className="hub-card-content">
                    <div className="hub-card-name-row">
                      <h3 className="hub-card-name">{tool.name}</h3>
                      {isComingSoon && <span className="hub-card-badge-soon">Coming Soon</span>}
                      {!isComingSoon && (
                        <span className="hub-card-arrow"><ArrowIcon /></span>
                      )}
                    </div>
                    <p className="hub-card-desc">{tool.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="hub-card-tags">
                    {tool.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="hub-card-tag"
                        style={{
                          background: `${tool.gradient[0]}15`,
                          color: tool.gradient[0],
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hub-footer">
        <span>PX AI Hub</span>
        <span className="hub-footer-dot">&bull;</span>
        <span>Product Experience</span>
        <span className="hub-footer-dot">&bull;</span>
        <span>Bayer Consumer Health</span>
      </footer>
    </div>
  );
}
