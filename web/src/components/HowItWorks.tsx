import { useReveal } from '../hooks/useReveal';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    title: 'Connect',
    desc: 'Add DeepMiro to Claude Code or Claude Desktop. One line in your MCP config. Done.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="10" width="36" height="28" rx="4" />
        <path d="M16 22l4 4-4 4" />
        <path d="M24 30h8" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Ask',
    desc: 'Ask any question. "Will remote work increase by 2027?" — Claude handles the rest.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" />
        <path d="M18 18c0 0 2-4 6-4s6 4 6 4" />
        <circle cx="24" cy="32" r="1.5" fill="var(--cyan)" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Predict',
    desc: 'Get a full prediction report — agent consensus, confidence levels, reasoning chains — right in your chat.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 36V20l12-8 12 8v16" />
        <path d="M8 40h32" />
        <path d="M20 36v-8h8v8" />
        <circle cx="36" cy="14" r="6" fill="var(--bg)" stroke="var(--green)" strokeWidth="2" />
        <path d="M33 14l2 2 4-4" stroke="var(--green)" strokeWidth="2" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const ref = useReveal();

  return (
    <section id="how-it-works" className={styles.section} ref={ref}>
      <div className="section-container">
        <div className="reveal">
          <div className="section-label">How it works</div>
          <h2 className="section-title">
            Three steps. No Docker.
            <br />
            No config files. No terminal.
          </h2>
          <p className="section-desc">
            MiroFish simulates thousands of AI agents debating your question. We
            handle all of that. You just ask.
          </p>
        </div>

        <div className={`${styles.grid} reveal-stagger`}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`${styles.card} reveal`}
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className={styles.number}>{step.number}</div>
              <div className={styles.icon}>{step.icon}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
