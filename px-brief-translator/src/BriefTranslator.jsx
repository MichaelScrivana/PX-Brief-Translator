import { useState, useEffect, useRef } from "react";
import { SUB_HOMES } from "./subHomes";
import { SYSTEM_PROMPTS } from "./systemPrompts";
import { SAMPLE_BRIEF } from "./sampleBrief";
import DropZone from "./DropZone";
import ChatAgent from "./ChatAgent";
import PXAgent from "./PXAgent";
import "./styles.css";
import "./pxagent.css";

const AI_HUB_URL = "https://salmon-island-0f8fa491e.4.azurestaticapps.net";

const NAV_LINKS = [
  { name: "Persona Generator", url: "https://calm-mushroom-0cfaf7f0f.1.azurestaticapps.net" },
];

// ── Animated tagline phrases ──
const TAGLINES = [
  "Remarkable. Responsible.",
  "Design with Purpose.",
  "Innovation at Scale.",
  "Science Meets Experience.",
  "From Brief to Brilliant.",
  "Consumer First. Always.",
];

function AnimatedTagline() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState("in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFade("out");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TAGLINES.length);
        setFade("in");
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tagline-container">
      <span className={`tagline tagline-${fade}`}>{TAGLINES[index]}</span>
    </div>
  );
}

// ── SVG Icons ──
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

export default function BriefTranslator() {
  const [brief, setBrief] = useState("");
  const [activeTab, setActiveTab] = useState("research");
  const [outputs, setOutputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── API Configuration ──
  const [showConfig, setShowConfig] = useState(false);
  const [provider, setProvider] = useState("bayer");

  const [bayerToken, setBayerToken] = useState("");
  const [bayerModel, setBayerModel] = useState("gpt-4o");

  // ── Multiple MGA Assistants ──
  const [bayerAssistants, setBayerAssistants] = useState([]);
  const [showBrowser, setShowBrowser] = useState(false);
  const [browseResults, setBrowseResults] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState("");
  const [browseFilter, setBrowseFilter] = useState("my_assistants");
  const [browseKeyword, setBrowseKeyword] = useState("");

  const [azureEndpoint, setAzureEndpoint] = useState("");
  const [azureDeployment, setAzureDeployment] = useState("");
  const [azureApiVersion, setAzureApiVersion] = useState("2024-08-01-preview");

  const [apiKey, setApiKey] = useState("");
  const [configSaved, setConfigSaved] = useState(false);

  // Apply dark mode class to root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const loadSample = () => setBrief(SAMPLE_BRIEF);

  // ── Fetch MGA assistants ──
  const fetchAssistants = async (category, keyword) => {
    if (!bayerToken.trim()) { setBrowseError("Enter your API token first."); return; }
    setBrowseLoading(true);
    setBrowseError("");
    try {
      let url = `https://chat.int.bayer.com/api/v2/assistants?category=${category}&limit=30`;
      if (keyword && keyword.length >= 3) url += `&keyword=${encodeURIComponent(keyword)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${bayerToken}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      // The API returns { category: [...assistants] } — flatten all values
      const all = Object.values(data).flat().filter(Boolean);
      setBrowseResults(all);
      if (all.length === 0) setBrowseError("No assistants found.");
    } catch (err) {
      setBrowseError(err.message);
      setBrowseResults([]);
    }
    setBrowseLoading(false);
  };

  const isAssistantSelected = (id) => bayerAssistants.some((a) => a.id === id);

  const toggleAssistant = (assistant) => {
    if (isAssistantSelected(assistant.id)) {
      setBayerAssistants(bayerAssistants.filter((a) => a.id !== assistant.id));
    } else {
      setBayerAssistants([...bayerAssistants, { name: assistant.name, id: assistant.id }]);
    }
  };

  // ── API calls (unchanged logic) ──
  const translateBayer = async (subHomeId, briefText) => {
    const response = await fetch("https://chat.int.bayer.com/api/v2/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${bayerToken}` },
      body: JSON.stringify({
        model: bayerModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[subHomeId] },
          { role: "user", content: `Translate into a ${SUB_HOMES.find((s) => s.id === subHomeId).label} working brief:\n\n${briefText}` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.detail || e.error?.message || `API error ${response.status}`); }
    return (await response.json()).choices[0].message.content;
  };

  const translateAzure = async (subHomeId, briefText) => {
    const url = `${azureEndpoint.replace(/\/$/, "")}/openai/deployments/${azureDeployment}/chat/completions?api-version=${azureApiVersion}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[subHomeId] },
          { role: "user", content: `Translate into a ${SUB_HOMES.find((s) => s.id === subHomeId).label} working brief:\n\n${briefText}` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${response.status}`); }
    return (await response.json()).choices[0].message.content;
  };

  const translateAnthropic = async (subHomeId, briefText) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPTS[subHomeId],
        messages: [{ role: "user", content: `Translate into a ${SUB_HOMES.find((s) => s.id === subHomeId).label} working brief:\n\n${briefText}` }],
      }),
    });
    if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${response.status}`); }
    return (await response.json()).content[0].text;
  };

  const translateSingle = async (subHomeId, briefText) => {
    if (provider === "bayer") return translateBayer(subHomeId, briefText);
    if (provider === "azure") return translateAzure(subHomeId, briefText);
    return translateAnthropic(subHomeId, briefText);
  };

  const isConfigValid = () => {
    if (provider === "bayer") return bayerToken.trim() && bayerModel.trim();
    if (provider === "azure") return apiKey.trim() && azureEndpoint.trim() && azureDeployment.trim();
    return apiKey.trim();
  };

  const translateAll = async () => {
    if (!brief.trim()) return setError("Paste or load a project brief first.");
    if (!isConfigValid()) { setShowConfig(true); return setError("Please configure your API connection first."); }
    setError(""); setLoading(true); setOutputs({}); setProgress({ done: 0, total: SUB_HOMES.length });
    for (let i = 0; i < SUB_HOMES.length; i++) {
      const sh = SUB_HOMES[i];
      try {
        const result = await translateSingle(sh.id, brief);
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

  const providerLabel = provider === "bayer" ? "myGenAssist" : provider === "azure" ? "Azure OpenAI" : "Claude";
  const completionPct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <a href={AI_HUB_URL} className="header-home-link" title="PX AI Hub Home">
            <img
              src="/img/PX-logo-blk@3x.png"
              alt="PX"
              className="logo-circle"
            />
          </a>
          <span className="header-title">AI Hub</span>
        </div>

        <div className="header-right">
          {loading && (
            <div className="progress-bar-container">
              <span className="progress-label">{progress.done}/{progress.total}</span>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          )}

          <span className="header-badge">Brief Translator</span>

          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Light mode" : "Dark mode"}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          <button className="header-menu-btn" onClick={() => setMenuOpen(!menuOpen)} title="Menu">
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Dropdown Menu ── */}
      {menuOpen && (
        <div className="header-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="header-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="header-menu-item"
              onClick={() => { setShowConfig(!showConfig); setMenuOpen(false); }}
              style={{ width: "100%", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
            >
              {configSaved ? `\u2713 ${providerLabel}` : "API Setup"}
            </button>
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="header-menu-item"
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

      <main className="main">
        {/* ── Config Panel ── */}
        {showConfig && (
          <div className="config-panel">
            <div className="config-header">
              <h3 className="config-title">API Configuration</h3>
              <button className="config-close" onClick={() => setShowConfig(false)}>&times;</button>
            </div>
            <div className="config-row">
              <label className="config-label">Provider</label>
              <div className="toggle-group">
                <button className={`toggle-btn ${provider === "bayer" ? "toggle-active" : ""}`} onClick={() => setProvider("bayer")}>Bayer</button>
                <button className={`toggle-btn ${provider === "azure" ? "toggle-active" : ""}`} onClick={() => setProvider("azure")}>Azure</button>
                <button className={`toggle-btn ${provider === "anthropic" ? "toggle-active" : ""}`} onClick={() => setProvider("anthropic")}>Anthropic</button>
              </div>
            </div>
            {provider === "bayer" && (<>
              <div className="config-row"><label className="config-label">API Token</label><input type="password" value={bayerToken} onChange={(e) => setBayerToken(e.target.value)} placeholder="Paste your myGenAssist token..." className="config-input" /><span className="config-hint"><strong>chat.int.bayer.com</strong> &rarr; Profile &rarr; API Tokens</span></div>
              <div className="config-row"><label className="config-label">Model</label><input type="text" value={bayerModel} onChange={(e) => setBayerModel(e.target.value)} placeholder="e.g. gpt-4o" className="config-input" /></div>

              {/* ── Chat Assistants ── */}
              <div className="config-row">
                <label className="config-label">Chat Assistants</label>
                <span className="config-hint" style={{ marginBottom: 8 }}>
                  Browse your MGA assistants to add them to the chat panel. The base MGA Chat is always available.
                </span>

                {/* Selected assistants */}
                {bayerAssistants.length > 0 && (
                  <div className="selected-assistants">
                    {bayerAssistants.map((a) => (
                      <div key={a.id} className="selected-assistant-chip">
                        <span className="selected-assistant-name">{a.name}</span>
                        <button className="chip-remove" onClick={() => setBayerAssistants(bayerAssistants.filter((x) => x.id !== a.id))} title="Remove">&times;</button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="btn btn-ghost btn-browse-assistants"
                  onClick={() => { setShowBrowser(!showBrowser); if (!showBrowser && browseResults.length === 0) fetchAssistants(browseFilter, browseKeyword); }}
                >{showBrowser ? "Close Browser" : "Browse MGA Assistants"}</button>

                {/* ── Assistant Browser ── */}
                {showBrowser && (
                  <div className="assistant-browser">
                    <div className="browse-controls">
                      <div className="browse-filters">
                        {[
                          { key: "my_assistants", label: "My Assistants" },
                          { key: "favorites", label: "Favorites" },
                          { key: "shared", label: "Shared" },
                          { key: "popular", label: "Popular" },
                        ].map((f) => (
                          <button
                            key={f.key}
                            className={`browse-filter-btn ${browseFilter === f.key ? "browse-filter-active" : ""}`}
                            onClick={() => { setBrowseFilter(f.key); fetchAssistants(f.key, browseKeyword); }}
                          >{f.label}</button>
                        ))}
                      </div>
                      <div className="browse-search-row">
                        <input
                          type="text"
                          value={browseKeyword}
                          onChange={(e) => setBrowseKeyword(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") fetchAssistants(browseFilter, browseKeyword); }}
                          placeholder="Search by name or keyword..."
                          className="config-input browse-search-input"
                        />
                        <button className="btn btn-ghost btn-search" onClick={() => fetchAssistants(browseFilter, browseKeyword)}>Search</button>
                      </div>
                    </div>

                    {browseLoading && <div className="browse-status"><div className="spinner" /> Loading...</div>}
                    {browseError && <div className="browse-status browse-error">{browseError}</div>}

                    {!browseLoading && browseResults.length > 0 && (
                      <div className="browse-results">
                        {browseResults.map((a) => {
                          const selected = isAssistantSelected(a.id);
                          return (
                            <button
                              key={a.id}
                              className={`browse-card ${selected ? "browse-card-selected" : ""}`}
                              onClick={() => toggleAssistant(a)}
                            >
                              <div className="browse-card-header">
                                {a.logo_url ? (
                                  <img src={a.logo_url} alt="" className="browse-card-logo" />
                                ) : (
                                  <div className="browse-card-logo-fallback">{a.name?.charAt(0) || "A"}</div>
                                )}
                                <div className="browse-card-info">
                                  <div className="browse-card-name">{a.name}</div>
                                  <div className="browse-card-meta">
                                    {a.model?.name && <span>{a.model.name}</span>}
                                    {a.owners?.[0]?.full_name && <span> &bull; {a.owners[0].full_name}</span>}
                                  </div>
                                </div>
                                <div className={`browse-card-check ${selected ? "browse-card-check-on" : ""}`}>
                                  {selected ? "\u2713" : "+"}
                                </div>
                              </div>
                              {a.description && (
                                <div className="browse-card-desc">{a.description.slice(0, 120)}{a.description.length > 120 ? "..." : ""}</div>
                              )}
                              {a.tags?.length > 0 && (
                                <div className="browse-card-tags">
                                  {a.tags.slice(0, 3).map((t, i) => (
                                    <span key={i} className="browse-tag">{t.description}</span>
                                  ))}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>)}
            {provider === "azure" && (<>
              <div className="config-row"><label className="config-label">Endpoint</label><input type="text" value={azureEndpoint} onChange={(e) => setAzureEndpoint(e.target.value)} placeholder="https://your-resource.openai.azure.com" className="config-input" /></div>
              <div className="config-row"><label className="config-label">Deployment</label><input type="text" value={azureDeployment} onChange={(e) => setAzureDeployment(e.target.value)} placeholder="e.g. gpt-4o" className="config-input" /></div>
              <div className="config-row"><label className="config-label">API Version</label><input type="text" value={azureApiVersion} onChange={(e) => setAzureApiVersion(e.target.value)} className="config-input" /></div>
              <div className="config-row"><label className="config-label">API Key</label><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste Azure key..." className="config-input" /></div>
            </>)}
            {provider === "anthropic" && (
              <div className="config-row"><label className="config-label">API Key</label><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-..." className="config-input" /><span className="config-hint">console.anthropic.com</span></div>
            )}
            <button className="btn btn-primary config-save" onClick={() => { if (isConfigValid()) { setConfigSaved(true); setShowConfig(false); setError(""); } else { setError("Please fill in all required fields."); } }}>Save Configuration</button>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {/* ── Hero: logo + animated tagline ── */}
        <div className="hero">
          <img
            src={darkMode ? "/img/WeArePX1-wht@3x.png" : "/img/WeArePX1@3x.png"}
            alt="We Are PX"
            className="hero-logo"
          />
          <AnimatedTagline />
        </div>

        {/* ── Brief input ── */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Project Brief</h2>
            <div className="card-actions">
              <button className="btn btn-ghost" onClick={loadSample}>Load Sample</button>
              <button className="btn btn-primary" onClick={translateAll} disabled={loading}>
                {loading ? `Translating... (${progress.done}/${progress.total})` : "Translate \u2192"}
              </button>
            </div>
          </div>
          <DropZone onTextExtracted={(text) => setBrief(text)}>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Paste your project brief here, drag a file, or load the sample..." className="brief-input" />
          </DropZone>

          {/* ── Brief-specific Chat Agent ── */}
          <ChatAgent
            brief={brief}
            outputs={outputs}
            subHomes={SUB_HOMES}
            provider={provider}
            darkMode={darkMode}
            apiConfig={{
              bayerToken,
              bayerModel,
              bayerAssistants: bayerAssistants.filter((a) => a.id.trim()),
              azureEndpoint,
              azureDeployment,
              azureApiVersion,
              apiKey,
            }}
          />
        </section>

        {/* ── Sub-home folder tabs (3×2 grid) ── */}
        {(Object.keys(outputs).length > 0 || loading) && (
          <>
            <div className="subhome-grid">
              {SUB_HOMES.map((sh) => {
                const isActive = activeTab === sh.id;
                const hasOutput = outputs[sh.id];
                const isError = hasOutput && hasOutput.startsWith("Error:");
                return (
                  <button
                    key={sh.id}
                    className={`folder-tab ${isActive ? "folder-tab-active" : ""}`}
                    onClick={() => setActiveTab(sh.id)}
                  >
                    <div className="folder-tab-top">
                      <span className="folder-tab-icon">{sh.icon}</span>
                      {hasOutput && !isError && <span className="dot dot-green" />}
                      {isError && <span className="dot dot-red" />}
                      {!hasOutput && loading && <span className="dot dot-yellow pulse" />}
                    </div>
                    <span className="folder-tab-label">{sh.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Output card ── */}
            <section className="card output-card">
              <div className="tab-content">
                {outputs[activeTab] ? (
                  <div className="output-body">
                    <div className="output-header">
                      <span className="output-icon">{SUB_HOMES.find((s) => s.id === activeTab)?.icon}</span>
                      <div>
                        <div className="output-title">{SUB_HOMES.find((s) => s.id === activeTab)?.label} Working Brief</div>
                        <div className="output-subtitle">Agent-generated via {providerLabel}</div>
                      </div>
                    </div>
                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(outputs[activeTab]) }} />
                  </div>
                ) : loading ? (
                  <div className="loading-state">
                    <div className="spinner" />
                    <span>Translating for {SUB_HOMES.find((s) => s.id === activeTab)?.label}...</span>
                  </div>
                ) : (
                  <div className="empty-state">Select a sub-home above to view its brief</div>
                )}
              </div>
            </section>
          </>
        )}

        <footer className="footer">PX Brief Translator &bull; Powered by {providerLabel}</footer>
      </main>

      <PXAgent />
    </div>
  );
}

function markdownToHtml(text) {
  return text.split("\n").map((line) => {
    if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
    if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
    if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
    if (line.startsWith("- ") || line.startsWith("* ")) return `<div class="bullet"><span class="bullet-dot">\u2022</span><span>${inlineBold(line.slice(2))}</span></div>`;
    const m = line.match(/^(\d+)\.\s(.*)/);
    if (m) return `<div class="bullet"><span class="bullet-dot">${m[1]}.</span><span>${inlineBold(m[2])}</span></div>`;
    if (line.trim() === "") return `<div class="spacer"></div>`;
    return `<p>${inlineBold(line)}</p>`;
  }).join("");
}

function inlineBold(t) {
  return t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
