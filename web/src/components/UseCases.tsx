import { useReveal } from '../hooks/useReveal';
import styles from './UseCases.module.css';

const cases = [
  {
    title: 'Market trends',
    desc: 'Will this product category grow? How will consumers react to a price change? Model demand before you commit.',
    icon: <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />,
  },
  {
    title: 'PR & comms strategy',
    desc: 'Test how the public might react to an announcement before you make it. Simulate the discourse.',
    icon: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" /></>,
  },
  {
    title: 'Policy impact',
    desc: 'What happens if we change this policy? Simulate how different demographics respond to regulatory changes.',
    icon: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></>,
  },
  {
    title: 'Technology adoption',
    desc: "Will users switch? How fast will adoption happen? Predict the curve before building the roadmap.",
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  },
  {
    title: 'Competitive analysis',
    desc: "How will the market react to a competitor's move? Simulate the ripple effects across your industry.",
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>,
  },
  {
    title: 'Scenario planning',
    desc: 'What if X happens? Run any hypothetical through the swarm and get a structured prediction with reasoning.',
    icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  },
];

export function UseCases() {
  const ref = useReveal();

  return (
    <section id="use-cases" className={styles.section} ref={ref}>
      <div className="section-container">
        <div className="reveal">
          <div className="section-label">Use cases</div>
          <h2 className="section-title">Ask the questions that matter.</h2>
          <p className="section-desc">
            If it involves human behavior, market dynamics, or public opinion —
            the swarm can model it.
          </p>
        </div>

        <div className={`${styles.grid} reveal-stagger`}>
          {cases.map((c, i) => (
            <div
              key={c.title}
              className={`${styles.card} reveal`}
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className={styles.icon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {c.icon}
                </svg>
              </div>
              <div>
                <div className={styles.title}>{c.title}</div>
                <div className={styles.desc}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
