import { useState, useEffect, useRef, useCallback } from "react";
import { PERSONAS, LOOP_MESSAGES } from "./personas";
import "./styles.css";
import PXAgent from "./PXAgent";
import "./pxagent.css";

// ══════════════════════════════════════════════
// PersonaGenerator V4
// White loop monitor + dark persona cards
// Georgia serif header, animated fading status lines
// Deep dive with journey timeline + Test a Concept
// ══════════════════════════════════════════════

const AI_HUB_URL = "https://salmon-island-0f8fa491e.4.azurestaticapps.net";

const NAV_LINKS = [
  { name: "Brief Translator", url: "https://proud-moss-0a781bf03.1.azurestaticapps.net" },
];

export default function PersonaGenerator() {
  // ── State ──
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [visiblePersonas, setVisiblePersonas] = useState([]);
  const [currentMsg, setCurrentMsg] = useState(null);
  const [prevMsg, setPrevMsg] = useState(null);
  const [completedDots, setCompletedDots] = useState(0);
  const [activeDot, setActiveDot] = useState(-1);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deepDivePersona, setDeepDivePersona] = useState(null);

  // ── API Config ──
  const [showConfig, setShowConfig] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [provider, setProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [bayerToken, setBayerToken] = useState("");
  const [bayerModel, setBayerModel] = useState("gpt-4o");
  const [azureEndpoint, setAzureEndpoint] = useState("");
  const [azureDeployment, setAzureDeployment] = useState("");
  const [azureApiVersion, setAzureApiVersion] = useState("2024-08-01-preview");
  const [configSaved, setConfigSaved] = useState(false);

  // ── Concept Test ──
  const [conceptInput, setConceptInput] = useState("");
  const [conceptLoading, setConceptLoading] = useState(false);
  const [conceptResult, setConceptResult] = useState(null);

  const timerRef = useRef(null);
  const msgIndexRef = useRef(0);

  // ── Loop simulation ──
  const startLoop = useCallback(() => {
    setRunning(true);
    setComplete(false);
    setVisiblePersonas([]);
    setCurrentMsg(null);
    setPrevMsg(null);
    setCompletedDots(0);
    setActiveDot(0);
    setExpandedCard(null);
    setDeepDivePersona(null);
    setConceptResult(null);
    msgIndexRef.current = 0;

    const tick = () => {
      const idx = msgIndexRef.current;
      if (idx >= LOOP_MESSAGES.length) {
        setRunning(false);
        setComplete(true);
        setActiveDot(-1);
        return;
      }

      const msg = LOOP_MESSAGES[idx];

      // Animate: exit previous, enter current
      setPrevMsg((prev) => prev ? { ...prev, state: "exiting" } : null);
      setTimeout(() => {
        setCurrentMsg({ ...msg, state: "entering" });
        setPrevMsg(null);
      }, 300);

      // If this message verifies a persona, add it and update dots
      if (msg.type === "verify" && msg.personaIndex !== undefined) {
        setTimeout(() => {
          setVisiblePersonas((prev) => {
            if (prev.includes(msg.personaIndex)) return prev;
            return [...prev, msg.personaIndex];
          });
          setCompletedDots(msg.personaIndex + 1);
          setActiveDot(msg.personaIndex + 1 < PERSONAS.length ? msg.personaIndex + 1 : -1);
        }, 600);
      }

      msgIndexRef.current = idx + 1;
      timerRef.current = setTimeout(tick, 1800);
    };

    tick();
  }, []);

  const resetLoop = () => {
    clearTimeout(timerRef.current);
    setRunning(false);
    setComplete(false);
    setVisiblePersonas([]);
    setCurrentMsg(null);
    setPrevMsg(null);
    setCompletedDots(0);
    setActiveDot(-1);
    setExpandedCard(null);
    setDeepDivePersona(null);
    setConceptResult(null);
    msgIndexRef.current = 0;
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // ── Card interactions ──
  const toggleCard = (idx) => {
    setExpandedCard(expandedCard === idx ? null : idx);
  };

  const openDeepDive = (persona) => {
    setDeepDivePersona(persona);
    setConceptInput("");
    setConceptResult(null);
  };

  // ── Test a Concept API call ──
  const testConcept = async () => {
    if (!conceptInput.trim() || !deepDivePersona) return;
    if (!configSaved) {
      setShowConfig(true);
      return;
    }

    setConceptLoading(true);
    setConceptResult(null);

    const persona = deepDivePersona;
    const systemPrompt = `You are simulating the consumer persona "${persona.name}" — a ${persona.age}-year-old ${persona.occupation} from ${persona.location}. Their segment is "${persona.segment}".

Their decision style: ${persona.health.decisionStyle}
Their purchase triggers: ${persona.health.purchaseTriggers.join(", ")}
Their dealbreakers: ${persona.health.dealbreakers.join(", ")}
Their AI agent behavior: ${persona.agentBehavior.delegationModel}
Their hidden need: ${persona.deepDive.hiddenNeed}

Evaluate the following product concept/claim/message through this persona's eyes. Respond in EXACTLY this JSON format (no markdown, no code fences):
{
  "gutReaction": "A 2-3 sentence first-person reaction in this persona's voice",
  "relevance": <number 1-10>,
  "credibility": <number 1-10>,
  "conversionLikelihood": <number 1-10>,
  "objection": "The specific objection this persona would raise",
  "improvement": "A specific suggestion to make this concept more effective for this persona"
}`;

    try {
      let result;
      if (provider === "anthropic") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 800,
            system: systemPrompt,
            messages: [{ role: "user", content: conceptInput }],
          }),
        });
        if (!response.ok) throw new Error(`API error ${response.status}`);
        const data = await response.json();
        result = JSON.parse(data.content[0].text);
      } else if (provider === "azure") {
        const url = `${azureEndpoint.replace(/\/$/, "")}/openai/deployments/${azureDeployment}/chat/completions?api-version=${azureApiVersion}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": apiKey },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: conceptInput },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });
        if (!response.ok) throw new Error(`API error ${response.status}`);
        const data = await response.json();
        result = JSON.parse(data.choices[0].message.content);
      } else if (provider === "bayer") {
        const response = await fetch("https://chat.int.bayer.com/api/v2/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${bayerToken}` },
          body: JSON.stringify({
            model: bayerModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: conceptInput },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });
        if (!response.ok) throw new Error(`API error ${response.status}`);
        const data = await response.json();
        result = JSON.parse(data.choices[0].message.content);
      }

      setConceptResult(result);
    } catch (err) {
      setConceptResult({
        gutReaction: `Error: ${err.message}. Please check your API configuration.`,
        relevance: 0,
        credibility: 0,
        conversionLikelihood: 0,
        objection: "Unable to evaluate — API error.",
        improvement: "Check API key and try again.",
      });
    }
    setConceptLoading(false);
  };

  const isConfigValid = () => {
    if (provider === "bayer") return bayerToken.trim() && bayerModel.trim();
    if (provider === "azure") return apiKey.trim() && azureEndpoint.trim() && azureDeployment.trim();
    return apiKey.trim();
  };

  const providerLabel = provider === "bayer" ? "myGenAssist" : provider === "azure" ? "Azure OpenAI" : "Claude";

  // ══════════════════════════════════════════════
  // RENDER: Deep Dive Overlay
  // ══════════════════════════════════════════════
  if (deepDivePersona) {
    const p = deepDivePersona;
    return (
      <div className="deep-dive-overlay">
        <div className="deep-dive-back">
          <button className="deep-dive-back-btn" onClick={() => setDeepDivePersona(null)}>
            &larr; Back to panel
          </button>
        </div>

        <div className="deep-dive-content">
          {/* Avatar */}
          <div
            className="deep-dive-avatar"
            style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
          >
            {p.name.split(" ").map((n) => n[0]).join("")}
          </div>

          <div className="deep-dive-name">{p.name}</div>
          <div className="deep-dive-meta">
            {p.age} &bull; {p.location} &bull; {p.occupation}
          </div>

          {/* Quote */}
          <div className="deep-dive-quote">"{p.deepDive.quote}"</div>

          {/* Day in the Life */}
          <div className="deep-dive-section">
            <div className="deep-dive-section-title">Day in the Life</div>
            <div className="deep-dive-section-text">{p.deepDive.dayInLife}</div>
          </div>

          {/* Hidden Need */}
          <div className="deep-dive-section">
            <div className="deep-dive-section-title">Hidden Need</div>
            <div className="deep-dive-section-text">{p.deepDive.hiddenNeed}</div>
          </div>

          {/* What They'd Tell Their Agent */}
          <div className="deep-dive-section">
            <div className="deep-dive-section-title">What They'd Tell Their Agent</div>
            <div
              className="deep-dive-quote"
              style={{ fontSize: "14px", borderLeftColor: p.gradient[0] }}
            >
              "{p.agentBehavior.agentQuery}"
            </div>
          </div>

          {/* Supplement Journey */}
          <div className="deep-dive-section">
            <div className="deep-dive-section-title">Supplement Journey</div>
            <div className="journey-timeline">
              {p.deepDive.journeyStages.map((stage, i) => (
                <div className="journey-stage" key={i}>
                  <div className="journey-dot-container">
                    <div className="journey-dot" style={{ background: stage.color }} />
                    {i < p.deepDive.journeyStages.length - 1 && <div className="journey-line" />}
                  </div>
                  <div className="journey-info">
                    <div className="journey-stage-name">{stage.stage}</div>
                    <div className="journey-stage-desc">{stage.description}</div>
                    <div className="journey-emotion">{stage.emotion}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PX Implications */}
          <div className="deep-dive-section">
            <div className="deep-dive-section-title">PX Implications</div>
            <div className="px-implications">
              {[
                { key: "research", label: "Research", color: "#2563eb" },
                { key: "design", label: "Design", color: "#7c3aed" },
                { key: "packaging", label: "Packaging", color: "#059669" },
                { key: "agentReadiness", label: "Agent Data", color: "#d97706" },
              ].map((imp) => (
                <div
                  className="px-implication-card"
                  key={imp.key}
                  style={{ borderLeftColor: imp.color }}
                >
                  <div className="px-implication-label" style={{ color: imp.color }}>
                    {imp.label}
                  </div>
                  <div className="px-implication-text">{p.pxImplications[imp.key]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Test a Concept */}
          <div className="concept-test">
            <div className="concept-test-title">Test a Concept</div>
            <textarea
              className="concept-test-input"
              value={conceptInput}
              onChange={(e) => setConceptInput(e.target.value)}
              placeholder={`Type a claim, packaging description, or brand message to test through ${p.name.split(" ")[0]}'s eyes...`}
            />
            <button
              className="concept-test-btn"
              onClick={testConcept}
              disabled={!conceptInput.trim() || conceptLoading}
            >
              {conceptLoading ? "Evaluating..." : `Evaluate as ${p.name.split(" ")[0]}`}
            </button>

            {conceptLoading && (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div className="spinner" />
              </div>
            )}

            {conceptResult && !conceptLoading && (
              <div className="concept-result">
                <div className="concept-result-reaction">"{conceptResult.gutReaction}"</div>

                <div className="concept-scores">
                  {[
                    { label: "Relevance", value: conceptResult.relevance, color: "#0a84ff" },
                    { label: "Credibility", value: conceptResult.credibility, color: "#30d158" },
                    { label: "Conversion", value: conceptResult.conversionLikelihood, color: "#ff9f0a" },
                  ].map((s) => (
                    <div className="concept-score" key={s.label}>
                      <div className="concept-score-value">{s.value}</div>
                      <div className="concept-score-label">{s.label}</div>
                      <div className="concept-score-bar">
                        <div
                          className="concept-score-fill"
                          style={{ width: `${s.value * 10}%`, background: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="concept-objection-label">Objection</div>
                <div className="concept-objection-text">{conceptResult.objection}</div>

                <div className="concept-improvement-label">Suggested Improvement</div>
                <div className="concept-improvement-text">{conceptResult.improvement}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // RENDER: Main View
  // ══════════════════════════════════════════════
  return (
    <div className={`pg-app ${darkMode ? "dark" : "light"}`}>
      {/* ── Header ── */}
      <header className="pg-header">
        <div className="pg-header-left">
          <a href={AI_HUB_URL} className="pg-home-link" title="PX AI Hub Home">
            <img src="/img/PX-logo-blk@3x.png" alt="PX" className="pg-header-logo" />
          </a>
          <span className="pg-header-title">AI Hub</span>
        </div>
        <div className="pg-header-right">
          <span className="pg-header-badge">Persona Generator</span>
          <button className="pg-theme-toggle" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "Light mode" : "Dark mode"}>
            {darkMode ? (
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
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button className="pg-menu-btn" onClick={() => setMenuOpen(!menuOpen)} title="Menu">
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
        <div className="pg-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="pg-menu" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pg-menu-item"
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

      {/* ── Loop Monitor (White) ── */}
      <div className="loop-monitor">
        <button
          className="loop-config-btn"
          onClick={() => setShowConfig(true)}
        >
          {configSaved ? `\u2713 ${providerLabel}` : "API Setup"}
        </button>

        <h1 className="loop-header">Persona Generator</h1>

        {/* Animated status line */}
        <div className="loop-status">
          {prevMsg && (
            <span className={`loop-status-line ${prevMsg.state}`} data-type={prevMsg.type}>
              {prevMsg.text}
            </span>
          )}
          {currentMsg && (
            <span className={`loop-status-line ${currentMsg.state}`} data-type={currentMsg.type}>
              {currentMsg.text}
            </span>
          )}
          {!running && !complete && !currentMsg && (
            <span className="loop-status-line entering" data-type="system" style={{ color: "#aeaeb2" }}>
              Ready to generate synthetic consumer personas
            </span>
          )}
          {complete && !currentMsg?.text?.includes("panel ready") && (
            <span className="loop-status-line entering" data-type="complete">
              9 synthetic personas generated — panel ready for review
            </span>
          )}
        </div>

        {/* Progress dots */}
        <div className="loop-dots">
          {PERSONAS.map((_, i) => (
            <div
              key={i}
              className={`loop-dot ${i < completedDots ? "filled" : ""} ${i === activeDot ? "active" : ""}`}
            />
          ))}
        </div>

        {/* Start / Reset button */}
        {!running && !complete && (
          <button className="loop-btn loop-btn-start" onClick={startLoop}>
            Start
          </button>
        )}
        {(running || complete) && (
          <button className="loop-btn loop-btn-reset" onClick={resetLoop}>
            Reset
          </button>
        )}
      </div>

      {/* ── Persona Cards (Dark) ── */}
      <div className="persona-section">
        <div className="persona-grid">
          {visiblePersonas.map((idx, arrIndex) => {
            const p = PERSONAS[idx];
            const isExpanded = expandedCard === idx;
            return (
              <div
                key={p.id}
                className="persona-card"
                style={{ animationDelay: `${arrIndex * 0.08}s` }}
                onClick={() => toggleCard(idx)}
              >
                <div className="persona-card-header">
                  <div
                    className="persona-avatar"
                    style={{ background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                  >
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="persona-name">{p.name}</div>
                    <div className="persona-meta">{p.age} &bull; {p.location}</div>
                  </div>
                  <div className={`persona-expand-icon ${isExpanded ? "open" : ""}`}>+</div>
                </div>

                <div className="persona-segment">{p.segment}</div>

                {isExpanded && (
                  <div className="persona-expanded">
                    {/* Triggers & Dealbreakers */}
                    <div className="persona-tags">
                      {p.health.purchaseTriggers.slice(0, 3).map((t, i) => (
                        <span key={`t-${i}`} className="persona-tag persona-tag-trigger">{t}</span>
                      ))}
                      {p.health.dealbreakers.slice(0, 2).map((d, i) => (
                        <span key={`d-${i}`} className="persona-tag persona-tag-dealbreaker">{d}</span>
                      ))}
                    </div>

                    <div className="persona-detail-label">Decision Style</div>
                    <div className="persona-detail-text">{p.health.decisionStyle}</div>

                    <div className="persona-detail-label">AI Agent Model</div>
                    <div className="persona-detail-text">{p.agentBehavior.delegationModel}</div>

                    <div className="persona-detail-label">Agent Criteria</div>
                    <div className="persona-detail-text">{p.agentBehavior.evaluationCriteria.join(" • ")}</div>

                    <button
                      className="persona-deep-dive-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeepDive(p);
                      }}
                    >
                      Deep Dive &rarr;
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Config Overlay ── */}
      {showConfig && (
        <div className="config-overlay" onClick={() => setShowConfig(false)}>
          <div className="config-panel" onClick={(e) => e.stopPropagation()}>
            <div className="config-header">
              <h3 className="config-title">API Configuration</h3>
              <button className="config-close" onClick={() => setShowConfig(false)}>&times;</button>
            </div>

            <div className="config-row">
              <label className="config-label">Provider</label>
              <div className="config-toggle-group">
                <button
                  className={`config-toggle-btn ${provider === "bayer" ? "config-toggle-active" : ""}`}
                  onClick={() => setProvider("bayer")}
                >Bayer</button>
                <button
                  className={`config-toggle-btn ${provider === "azure" ? "config-toggle-active" : ""}`}
                  onClick={() => setProvider("azure")}
                >Azure</button>
                <button
                  className={`config-toggle-btn ${provider === "anthropic" ? "config-toggle-active" : ""}`}
                  onClick={() => setProvider("anthropic")}
                >Anthropic</button>
              </div>
            </div>

            {provider === "bayer" && (
              <>
                <div className="config-row">
                  <label className="config-label">API Token</label>
                  <input
                    type="password"
                    value={bayerToken}
                    onChange={(e) => setBayerToken(e.target.value)}
                    placeholder="Paste your myGenAssist token..."
                    className="config-input"
                  />
                  <span className="config-hint"><strong>chat.int.bayer.com</strong> &rarr; Profile &rarr; API Tokens</span>
                </div>
                <div className="config-row">
                  <label className="config-label">Model</label>
                  <input
                    type="text"
                    value={bayerModel}
                    onChange={(e) => setBayerModel(e.target.value)}
                    placeholder="e.g. gpt-4o"
                    className="config-input"
                  />
                </div>
              </>
            )}

            {provider === "azure" && (
              <>
                <div className="config-row">
                  <label className="config-label">Endpoint</label>
                  <input
                    type="text"
                    value={azureEndpoint}
                    onChange={(e) => setAzureEndpoint(e.target.value)}
                    placeholder="https://your-resource.openai.azure.com"
                    className="config-input"
                  />
                </div>
                <div className="config-row">
                  <label className="config-label">Deployment</label>
                  <input
                    type="text"
                    value={azureDeployment}
                    onChange={(e) => setAzureDeployment(e.target.value)}
                    placeholder="e.g. gpt-4o"
                    className="config-input"
                  />
                </div>
                <div className="config-row">
                  <label className="config-label">API Version</label>
                  <input
                    type="text"
                    value={azureApiVersion}
                    onChange={(e) => setAzureApiVersion(e.target.value)}
                    className="config-input"
                  />
                </div>
                <div className="config-row">
                  <label className="config-label">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste Azure key..."
                    className="config-input"
                  />
                </div>
              </>
            )}

            {provider === "anthropic" && (
              <div className="config-row">
                <label className="config-label">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="config-input"
                />
                <span className="config-hint">console.anthropic.com</span>
              </div>
            )}

            <button
              className="config-save"
              onClick={() => {
                if (isConfigValid()) {
                  setConfigSaved(true);
                  setShowConfig(false);
                }
              }}
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      <PXAgent />
    </div>
  );
}
