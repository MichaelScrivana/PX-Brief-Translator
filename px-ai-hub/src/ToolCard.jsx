import { useState, useEffect } from "react";
import { ICONS, SparkleIcon, ArrowIcon } from "./tools";

let teamsInitialized = false;
let isInTeams = false;

// Try to initialize Teams SDK once
if (!teamsInitialized && window.microsoftTeams) {
  try {
    window.microsoftTeams.app.initialize().then(() => {
      isInTeams = true;
      teamsInitialized = true;
    }).catch(() => {
      teamsInitialized = true;
    });
  } catch {
    teamsInitialized = true;
  }
}

export default function ToolCard({ tool }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = ICONS[tool.icon] || SparkleIcon;
  const isComingSoon = tool.status === "coming-soon";

  const handleClick = (e) => {
    if (isComingSoon || !tool.url) return;
    e.preventDefault();
    // Navigate within the iframe instead of opening a new tab
    window.location.href = tool.url;
  };

  return (
    <a
      href={isComingSoon ? undefined : tool.url}
      onClick={handleClick}
      rel="noopener noreferrer"
      className={`hub-card ${isComingSoon ? "hub-card-soon" : ""}`}
      style={{
        "--accent-from": tool.gradient[0],
        "--accent-to": tool.gradient[1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hub-card-accent-wrap">
        <div
          className={`hub-card-accent ${hovered ? "hub-card-accent-active" : ""}`}
        />
      </div>

      <div className="hub-card-body">
        <div
          className="hub-card-icon"
          style={{
            background: `linear-gradient(135deg, ${tool.gradient[0]}22, ${tool.gradient[1]}22)`,
            color: tool.gradient[0],
          }}
        >
          <IconComponent />
        </div>

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
}
