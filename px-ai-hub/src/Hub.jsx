import { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";
import PXAgent from "./PXAgent";
import "./pxagent.css";

// ── Neural Network Hero Component ──
function NeuralHero({ tagline, taglineFade }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);
  const logoRef = useRef(null);
  const logoBoundsRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const NODE_COUNT_DESKTOP = 80;
  const NODE_COUNT_MOBILE = 35;
  const CONNECTION_DIST = 160;
  const MOUSE_RADIUS = 200;
  const LOGO_ATTRACT_RADIUS = 250;

  const initNodes = useCallback((width, height) => {
    const count = width < 700 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    const nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        baseRadius: Math.random() * 2 + 1,
        hue: Math.random() > 0.7 ? 190 : 210, // mix of blue and cyan
        pulse: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;

    const resize = () => {
      const container = canvas.parentElement;
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Update logo bounds
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        logoBoundsRef.current = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          w: rect.width,
          h: rect.height,
        };
      }

      if (nodesRef.current.length === 0) {
        initNodes(width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.parentElement.addEventListener("mousemove", handleMouseMove);
    canvas.parentElement.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const logo = logoBoundsRef.current;

      // Update logo bounds each frame
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        const containerRect = canvas.parentElement.getBoundingClientRect();
        logoBoundsRef.current = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          w: rect.width,
          h: rect.height,
        };
      }

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulse += 0.02;
        n.radius = n.baseRadius + Math.sin(n.pulse) * 0.5;

        // Gentle drift
        n.x += n.vx;
        n.y += n.vy;

        // Subtle attraction toward logo center
        const dxLogo = logo.x - n.x;
        const dyLogo = logo.y - n.y;
        const distLogo = Math.sqrt(dxLogo * dxLogo + dyLogo * dyLogo);
        if (distLogo < LOGO_ATTRACT_RADIUS && distLogo > 60) {
          const force = 0.02 * (1 - distLogo / LOGO_ATTRACT_RADIUS);
          n.vx += (dxLogo / distLogo) * force;
          n.vy += (dyLogo / distLogo) * force;
        }

        // Repel from logo center (keep nodes out of logo area)
        if (distLogo < 70) {
          const repel = 0.15 * (1 - distLogo / 70);
          n.vx -= (dxLogo / distLogo) * repel;
          n.vy -= (dyLogo / distLogo) * repel;
        }

        // Mouse interaction — gentle push
        const dxMouse = n.x - mouse.x;
        const dyMouse = n.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < MOUSE_RADIUS) {
          const force = 0.8 * (1 - distMouse / MOUSE_RADIUS);
          n.vx += (dxMouse / distMouse) * force;
          n.vy += (dyMouse / distMouse) * force;
        }

        // Speed dampening
        n.vx *= 0.98;
        n.vy *= 0.98;

        // Boundary wrapping
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 113, 227, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw connections to logo area
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = logo.x - n.x;
        const dy = logo.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LOGO_ATTRACT_RADIUS && dist > 60) {
          const alpha = (1 - dist / LOGO_ATTRACT_RADIUS) * 0.15;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(logo.x + (Math.random() - 0.5) * 40, logo.y + (Math.random() - 0.5) * 20);
          ctx.strokeStyle = `rgba(0, 199, 255, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const distToLogo = Math.sqrt(
          (logo.x - n.x) ** 2 + (logo.y - n.y) ** 2
        );
        const nearLogo = distToLogo < LOGO_ATTRACT_RADIUS;
        const glow = nearLogo ? 8 : 4;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        if (nearLogo) {
          ctx.fillStyle = `hsla(${n.hue}, 100%, 70%, 0.9)`;
          ctx.shadowColor = `hsla(${n.hue}, 100%, 60%, 0.6)`;
        } else {
          ctx.fillStyle = `hsla(${n.hue}, 80%, 60%, 0.6)`;
          ctx.shadowColor = `hsla(${n.hue}, 80%, 50%, 0.3)`;
        }
        ctx.shadowBlur = glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.parentElement.removeEventListener("mousemove", handleMouseMove);
      canvas.parentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initNodes]);

  return (
    <section className="hub-hero">
      <canvas ref={canvasRef} className="hub-hero-canvas" />
      <div className="hub-hero-content">
        <img
          ref={logoRef}
          src="/img/WeArePX1-wht@3x.png"
          alt="We Are PX"
          className="hub-hero-logo"
        />
        <div className="hub-hero-glow" />
        <div className="hub-tagline-container">
          <span className={`hub-tagline hub-tagline-${taglineFade}`}>
            {tagline}
          </span>
        </div>
        <TypingText text="Explore the PX AI toolkit — agent workflows, synthetic research, and intelligent design tools built for Product Experience." />
      </div>
    </section>
  );
}

// ── Typing Effect Component ──
function TypingText({ text }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="hub-hero-sub">
      {displayed}
      {!done && <span className="hub-typing-cursor">|</span>}
    </p>
  );
}

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
    url: "https://proud-moss-0a781bf03.1.azurestaticapps.net",
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
    url: "https://calm-mushroom-0cfaf7f0f.1.azurestaticapps.net",
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

// ── Hamburger Icon ──
const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseMenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const AI_HUB_URL = "https://salmon-island-0f8fa491e.4.azurestaticapps.net";

const NAV_LINKS = [
  { name: "Brief Translator", url: "https://proud-moss-0a781bf03.1.azurestaticapps.net" },
  { name: "Persona Generator", url: "https://calm-mushroom-0cfaf7f0f.1.azurestaticapps.net" },
];

export default function Hub() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineFade, setTaglineFade] = useState("in");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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
    <div className={`hub ${darkMode ? "dark" : "light"}`}>
      {/* ── Header ── */}
      <header className="hub-header">
        <div className="hub-header-left">
          <a href={AI_HUB_URL} className="hub-home-link" title="PX AI Hub Home">
            <img src="/img/PX-logo-blk@3x.png" alt="PX" className="hub-logo" />
          </a>
          <span className="hub-header-title">AI Hub</span>
        </div>
        <div className="hub-header-right">
          <span className="hub-header-badge">{TOOLS.filter(t => t.status === "live").length} tools live</span>
          <button className="hub-theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Light mode" : "Dark mode"}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="hub-menu-btn" onClick={() => setMenuOpen(!menuOpen)} title="Menu">
            {menuOpen ? <CloseMenuIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      {/* ── Dropdown Menu ── */}
      {menuOpen && (
        <div className="hub-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="hub-menu" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hub-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* ── Hero ── */}
      <NeuralHero tagline={TAGLINES[taglineIndex]} taglineFade={taglineFade} />

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
                {/* Glowing accent line */}
                <div className="hub-card-accent-wrap">
                  <div
                    className={`hub-card-accent ${hoveredCard === tool.id ? "hub-card-accent-active" : ""}`}
                    style={{
                      "--accent-from": tool.gradient[0],
                      "--accent-to": tool.gradient[1],
                    }}
                  />
                </div>

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

      <PXAgent />
    </div>
  );
}
