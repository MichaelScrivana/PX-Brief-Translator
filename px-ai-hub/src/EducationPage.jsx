import { Reveal } from "./useScrollReveal";

const BookIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function EducationPage() {
  return (
    <section className="hub-education-page">
      <div className="hub-education-inner">
        <Reveal>
          <div className="hub-education-icon">
            <BookIcon />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="hub-page-title">AI Education</h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="hub-page-subtitle">
            Guides, tutorials, and resources for using AI in Product Experience workflows.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="hub-coming-soon-badge">Coming Soon</div>
        </Reveal>
        <Reveal delay={400}>
          <p className="hub-education-desc">
            We're building a library of practical AI education resources — from prompt engineering to agent design patterns. Check back soon.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
