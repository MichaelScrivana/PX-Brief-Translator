import { useState, useMemo } from "react";
import { TOOLS } from "./tools";
import ToolCard from "./ToolCard";
import { Reveal } from "./useScrollReveal";

export default function ToolsPage() {
  const [activeTag, setActiveTag] = useState("All");

  const allTags = useMemo(() => {
    const tags = new Set();
    TOOLS.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return ["All", ...Array.from(tags)];
  }, []);

  const filtered = activeTag === "All"
    ? TOOLS
    : TOOLS.filter((t) => t.tags.includes(activeTag));

  return (
    <section className="hub-tools-page">
      <div className="hub-tools-page-inner">
        <Reveal>
          <h1 className="hub-page-title">All Tools</h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="hub-page-subtitle">Browse the full PX AI toolkit</p>
        </Reveal>

        <Reveal delay={160}>
          <div className="hub-tag-filters">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`hub-tag-pill ${activeTag === tag ? "hub-tag-pill-active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="hub-grid">
          {filtered.map((tool, i) => (
            <Reveal key={tool.id} delay={i * 120}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="hub-tools-empty">No tools match this filter.</p>
        )}
      </div>
    </section>
  );
}
