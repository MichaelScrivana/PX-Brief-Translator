import { Reveal } from "./useScrollReveal";

const LEVELS = [
  {
    level: 1,
    title: "Basics",
    subtitle: "AI Foundation, AI Tools, Responsible AI and Ethics",
    color: "#0071e3",
    resources: [
      { name: "GenAI Learning Path", url: "https://go.bayer.com/learnGenAI" },
      { name: "AI Glossary", url: "https://bayergroup.sharepoint.com/:b:/r/sites/021223/IT%20Academy/91_AI_Glossary/AI-Glossary.pdf?csf=1&web=1&e=lZefnG" },
      { name: "MS Copilot 365 Training", url: "https://bayergroup.sharepoint.com/sites/037236/SitePages/Trainings.aspx" },
      { name: "myGenAssist Video Path", url: "https://go.bayer.com/learnmygenassist?intranet=1" },
      { name: "Responsible Use of AI", url: "https://performancemanager5.successfactors.eu/sf/learning?destUrl=https%3a%2f%2fbayer%2eplateau%2ecom%2flearning%2fuser%2fdeeplink%5fredirect%2ejsp%3flinkId%3dITEM%5fDETAILS%26componentID%3dBAY%5f742052%26componentTypeID%3dWBT%26revisionDate%3d1740460989000%26fromSF%3dY&company=C0003153479P", tag: "Mandatory" },
    ],
  },
  {
    level: 2,
    title: "Productivity",
    subtitle: "Proficiency & Prompting, Human-AI Partnership",
    color: "#0071e3",
    resources: [
      { name: "MyGenAssist for Everyone: 8 Week Learning Journey", url: "https://eu.degreed.com/pathway/e9kjo0dm8o/pathway?orgsso=bayer" },
      { name: "Promptathon: Hackathon Guide", url: "https://bayergroup.sharepoint.com/sites/ChatGPT-4-Bayer/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FChatGPT%2D4%2DBayer%2FShared%20Documents%2F%F0%9F%94%9D%20Events%2FGenAI%20Promptathon%20Guide%2Epdf&parent=%2Fsites%2FChatGPT%2D4%2DBayer%2FShared%20Documents%2F%F0%9F%94%9D%20Events" },
      { name: "Gen AI & Agentic Community Calls", url: "https://bayergroup.sharepoint.com/sites/GenerativeAI1/_layouts/15/Events.aspx?ListGuid=7e8d3ab8-7348-4f66-b69c-7a5156426080&StartDate=2026-01-19&AudienceTarget=false" },
      { name: "myGenAssist Assistants Tutorial", url: "https://go.bayer.com/learnAssistants" },
      { name: "Advanced AI Learning Journey", url: "#", tag: "Q1 2026" },
    ],
  },
  {
    level: 3,
    title: "Domain Specific Solutions & Automation",
    subtitle: "AI Workflows, Vibe Coding, Prompt Chaining, No-code / Low-code",
    color: "#00a0dc",
    resources: [
      { name: "Vibe Coding Hackathons & Masterclasses", url: "https://teams.microsoft.com/l/channel/19%3Aac71bb6b98054890b984336938a7bce4%40thread.tacv2/%F0%9F%94%A5%20Vibe%20Coding?groupId=733d0295-1f3c-4c2a-8a6d-385c1e602981&tenantId=fcb2b37b-5da0-466b-9b83-0014b67a7c78", tag: "Teams" },
    ],
  },
  {
    level: 4,
    title: "Agentic",
    subtitle: "Build & Design Business Solutions",
    color: "#10b981",
    resources: [
      { name: "Agentic AI Overview Learning Path", url: "https://go.bayer.com/learnAgentic" },
      { name: "Building AI Agents Learning Path", url: "https://eu.degreed.com/plan/953865?orgsso=bayer" },
      { name: "Datacamp: AI Development", url: "https://www.datacamp.com/business/partners/bayer-datacamp-partnership-overview" },
    ],
  },
];

const PX_LEVELS = [
  {
    level: 1,
    title: "Getting Started with PX AI Tools",
    subtitle: "Introduction to the PX AI Hub, tool walkthroughs, and first-time setup",
    color: "#86868b",
    resources: [
      { name: "PX AI Hub Overview & Tour", url: "#" },
      { name: "Setting Up Your API Keys", url: "#" },
      { name: "Your First Brief Translation", url: "#" },
    ],
  },
  {
    level: 2,
    title: "Design Workflows with AI",
    subtitle: "Integrating AI into your daily PX design and research processes",
    color: "#a855f7",
    resources: [
      { name: "AI-Assisted Persona Research", url: "#" },
      { name: "Concept Testing with Synthetic Personas", url: "#" },
      { name: "Brief Writing Best Practices for AI", url: "#" },
      { name: "Design Compliance Review Workflows", url: "#" },
    ],
  },
  {
    level: 3,
    title: "Advanced PX Techniques",
    subtitle: "Custom prompting strategies, assistant configuration, and multi-tool workflows",
    color: "#0071e3",
    resources: [
      { name: "Building Custom MGA Assistants for PX", url: "#" },
      { name: "Advanced Prompting for Design Briefs", url: "#" },
      { name: "Multi-Tool Workflows: Brief to Persona Pipeline", url: "#" },
    ],
  },
];

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function EducationPage() {
  return (
    <section className="hub-education-page">
      <div className="hub-education-inner">
        <Reveal>
          <h1 className="hub-page-title">AI Education</h1>
        </Reveal>
        <Reveal delay={100}>
          <p className="hub-page-subtitle">
            Bayer AI learning resources organized by skill level — from foundations to building agentic solutions.
          </p>
        </Reveal>

        <div className="edu-levels">
          {LEVELS.map((level, i) => (
            <Reveal key={level.level} delay={200 + i * 100}>
              <div className="edu-level-card">
                <div className="edu-level-card-accent" style={{ background: `linear-gradient(90deg, transparent, ${level.color}, transparent)` }} />
                <div className="edu-level-card-body">
                  <div className="edu-level-header">
                    <span className="edu-level-badge" style={{ background: level.color }}>
                      Level {level.level}
                    </span>
                    <div>
                      <h2 className="edu-level-title">{level.title}</h2>
                      <p className="edu-level-subtitle">{level.subtitle}</p>
                    </div>
                  </div>
                  <div className="edu-resources">
                    {level.resources.map((r, j) => (
                      <a
                        key={j}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="edu-resource-link"
                      >
                        <span className="edu-resource-name">
                          {r.name}
                          {r.tag && <span className="edu-resource-tag">{r.tag}</span>}
                        </span>
                        <LinkIcon />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── PX Learning Journey ── */}
        <Reveal delay={200}>
          <div className="edu-section-divider" />
        </Reveal>
        <Reveal delay={250}>
          <div className="edu-section-header">
            <h2 className="hub-page-title" style={{ fontSize: 28 }}>Product Experience Learning Journey</h2>
            <span className="edu-coming-soon-badge">Coming Soon</span>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <p className="hub-page-subtitle">
            PX-specific guides and tutorials for using AI tools in design, research, and packaging workflows.
          </p>
        </Reveal>

        <div className="edu-levels edu-levels-coming-soon">
          {PX_LEVELS.map((level, i) => (
            <Reveal key={level.level} delay={350 + i * 100}>
              <div className="edu-level-card edu-level-card-soon">
                <div className="edu-level-card-accent" style={{ background: `linear-gradient(90deg, transparent, ${level.color}, transparent)` }} />
                <div className="edu-level-card-body">
                  <div className="edu-level-header">
                    <span className="edu-level-badge" style={{ background: level.color }}>
                      Level {level.level}
                    </span>
                    <div>
                      <h2 className="edu-level-title">{level.title}</h2>
                      <p className="edu-level-subtitle">{level.subtitle}</p>
                    </div>
                  </div>
                  <div className="edu-resources">
                    {level.resources.map((r, j) => (
                      <span key={j} className="edu-resource-link edu-resource-disabled">
                        <span className="edu-resource-name">{r.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
