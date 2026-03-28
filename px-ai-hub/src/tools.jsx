// ── Tool cards data ──
// Add new tools here as they're built

export const TOOLS = [
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
  {
    id: "design-reviewer",
    name: "One A Day Design Reviewer",
    description:
      "An AI design review agent that checks designs for compliance before submission to the design manager. Submit your work for instant feedback.",
    icon: "check",
    gradient: ["#10b981", "#06b6d4"],
    tags: ["Design Review", "Compliance", "QA"],
    url: "https://zealous-ocean-0b50b761e.6.azurestaticapps.net/",
    status: "live",
  },
  {
    id: "case-study-sharpener",
    name: "Case Study Sharpener",
    description:
      "A conversational AI tool that helps project owners refine rough summaries into polished, structured case studies ready for PX.com. Powered by PX-Agent with full PX knowledge.",
    icon: "doc",
    gradient: ["#f59e0b", "#ef4444"],
    tags: ["Case Studies", "PX.com", "AI Agent"],
    url: "https://px-case-study-sharpener.azurewebsites.net",
    status: "live",
  },
  // ── Add more tools here ──
];

// ── Animated taglines ──
export const TAGLINES = [
  "AI-powered tools for Product Experience.",
  "From Brief to Brilliant.",
  "Remarkable. Responsible.",
  "Design with Purpose.",
  "Innovation at Scale.",
  "Consumer First. Always.",
];

// ── Icon components ──
export const DocIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
  </svg>
);

export const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const ICONS = { doc: DocIcon, user: UserIcon, sparkle: SparkleIcon, check: CheckIcon };
