import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TOOLS } from "./tools";

const AI_HUB_URL = "https://salmon-island-0f8fa491e.4.azurestaticapps.net";

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

export default function Header({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (e, hash) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: hash } });
    } else {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const liveCount = TOOLS.filter((t) => t.status === "live").length;

  const navLinks = [
    { label: "About", type: "anchor", hash: "about" },
    { label: "Tools", type: "route", to: "/tools" },
    { label: "AI Education", type: "route", to: "/education" },
    { label: "Contact", type: "anchor", hash: "contact" },
  ];

  return (
    <>
      <header className="hub-header">
        <div className="hub-header-left">
          <Link to="/" className="hub-home-link" title="PX AI Hub Home">
            <img src="/img/PX-logo-blk@3x.png" alt="PX" className="hub-logo" />
          </Link>
          <Link to="/" className="hub-header-title-link">
            <span className="hub-header-title">AI Hub</span>
          </Link>

          <nav className="hub-nav-desktop">
            {navLinks.map((link) =>
              link.type === "anchor" ? (
                <a
                  key={link.label}
                  href={`/#${link.hash}`}
                  className="hub-nav-link"
                  onClick={(e) => handleAnchorClick(e, link.hash)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`hub-nav-link ${location.pathname === link.to ? "hub-nav-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="hub-header-right">
          <span className="hub-header-badge">{liveCount} tools live</span>
          <button
            className="hub-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="hub-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Menu"
          >
            {menuOpen ? <CloseMenuIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="hub-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="hub-menu" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) =>
              link.type === "anchor" ? (
                <a
                  key={link.label}
                  href={`/#${link.hash}`}
                  className="hub-menu-item"
                  onClick={(e) => handleAnchorClick(e, link.hash)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="hub-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </>
  );
}
