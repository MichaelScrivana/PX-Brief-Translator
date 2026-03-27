import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { TOOLS, TAGLINES } from "./tools";
import ToolCard from "./ToolCard";
import { Reveal } from "./useScrollReveal";

// ── Neural Network Hero Component ──
function NeuralHero({ tagline, taglineFade, darkMode }) {
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
    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < count; i++) {
      // Spawn nodes along edges — left 25% or right 25% of the canvas
      let x, y;
      if (Math.random() < 0.5) {
        // Left side
        x = Math.random() * width * 0.3;
      } else {
        // Right side
        x = width - Math.random() * width * 0.3;
      }
      y = Math.random() * height;
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 4 + 0.5,
        baseRadius: Math.random() * 4 + 0.5,
        hue: Math.random() > 0.7 ? 190 : 210,
        pulse: Math.random() * Math.PI * 2,
        homeX: x,
        homeY: y,
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

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulse += 0.015;
        n.radius = n.baseRadius + Math.sin(n.pulse) * 0.3;
        n.x += n.vx;
        n.y += n.vy;

        // Gentle drift back toward home position (edges)
        const dxHome = n.homeX - n.x;
        const dyHome = n.homeY - n.y;
        n.vx += dxHome * 0.0003;
        n.vy += dyHome * 0.0003;

        // Repel from center zone to keep vignette shape
        const cx = width / 2;
        const cy = height / 2;
        const dxCenter = n.x - cx;
        const dyCenter = n.y - cy;
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const edgeZone = width * 0.25;
        if (distCenter < edgeZone) {
          const repel = 0.01 * (1 - distCenter / edgeZone);
          n.vx += (dxCenter / distCenter) * repel;
          n.vy += (dyCenter / distCenter) * repel;
        }

        // Mouse interaction
        const dxMouse = n.x - mouse.x;
        const dyMouse = n.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < MOUSE_RADIUS) {
          const force = 0.15 * (1 - distMouse / MOUSE_RADIUS);
          n.vx += (dxMouse / distMouse) * force;
          n.vy += (dyMouse / distMouse) * force;
        }

        n.vx *= 0.92;
        n.vy *= 0.92;

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
            const alpha = (1 - dist / CONNECTION_DIST) * 0.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 113, 227, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 70%, 60%, 0.4)`;
        ctx.shadowColor = `hsla(${n.hue}, 70%, 50%, 0.2)`;
        ctx.shadowBlur = 3;
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
          src={darkMode ? "/img/WeArePX1-wht@3x.png" : "/img/WeArePX1@3x.png"}
          alt="We Are PX"
          className="hub-hero-logo"
        />
        <div className="hub-hero-glow" />
        <div className="hub-tagline-container">
          <span className={`hub-tagline hub-tagline-${taglineFade}`}>
            {tagline}
          </span>
        </div>
        <FadeUpText text="Explore the PX AI toolkit — agent workflows, synthetic research, and intelligent design tools built for Product Experience." />
      </div>
    </section>
  );
}

// ── Fade-up subtitle ──
function FadeUpText({ text }) {
  return (
    <p className="hub-hero-sub hub-fade-up">
      {text}
    </p>
  );
}

// ── Feature highlight icons ──
const AgentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
  </svg>
);

const ResearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const DesignIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const FEATURES = [
  {
    icon: AgentIcon,
    title: "Agent Workflows",
    description: "AI-powered workflows that translate briefs, generate personas, and automate repetitive design tasks.",
    gradient: ["#0071e3", "#00c7ff"],
  },
  {
    icon: ResearchIcon,
    title: "Synthetic Research",
    description: "Generate rich consumer personas and test concepts through AI-synthesized perspectives.",
    gradient: ["#a855f7", "#ec4899"],
  },
  {
    icon: DesignIcon,
    title: "Design Intelligence",
    description: "Tools that understand design context — from packaging constraints to brand guidelines.",
    gradient: ["#f59e0b", "#ef4444"],
  },
];

export default function HomePage({ darkMode }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineFade, setTaglineFade] = useState("in");
  const location = useLocation();

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

  // Handle scroll-to from navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);

  const previewTools = TOOLS.slice(0, 4);

  return (
    <>
      <NeuralHero tagline={TAGLINES[taglineIndex]} taglineFade={taglineFade} darkMode={darkMode} />

      {/* ── Tools Preview ── */}
      <section className="hub-grid-section">
        <Reveal>
          <div className="hub-section-header">
            <h2 className="hub-section-title">Tools</h2>
            <Link to="/tools" className="hub-browse-link">
              Browse all tools
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </Reveal>
        <div className="hub-grid">
          {previewTools.map((tool, i) => (
            <Reveal key={tool.id} delay={i * 120}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="hub-about" id="about">
        <div className="hub-about-inner">
          <Reveal>
            <h2 className="hub-section-title">About PX AI</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="hub-about-text">
              The PX AI Hub is Product Experience's toolkit for integrating artificial intelligence into everyday design and research workflows. Our mission is to make AI accessible, practical, and responsible — empowering teams to move faster without compromising quality.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <a
              href="https://px.int.bayer.com/"
              rel="noopener noreferrer"
              className="hub-about-link"
            >
              More about the Product Experience Team ↗
            </a>
          </Reveal>

          <div className="hub-features">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 120}>
                  <div className="hub-feature-card">
                    <div
                      className="hub-feature-icon"
                      style={{
                        background: `linear-gradient(135deg, ${f.gradient[0]}22, ${f.gradient[1]}22)`,
                        color: f.gradient[0],
                      }}
                    >
                      <Icon />
                    </div>
                    <h3 className="hub-feature-title">{f.title}</h3>
                    <p className="hub-feature-desc">{f.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="hub-contact" id="contact">
        <div className="hub-contact-inner">
          <Reveal>
            <h2 className="hub-section-title">Get in Touch</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="hub-contact-text">
              Have a question, idea, or want to collaborate on a new AI tool? Reach out to the PX AI team.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <a
              href="mailto:michael.scrivana@bayer.com"
              className="hub-contact-btn"
            >
              Contact Us
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
