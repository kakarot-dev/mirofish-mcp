import { HeroParticles } from './HeroParticles';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <HeroParticles />
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Now available for Claude Code &amp; Claude Desktop
        </div>

        <h1 className={styles.h1}>
          Predict anything.
          <br />
          <span className={styles.highlight}>Install nothing.</span>
        </h1>

        <p className={styles.sub}>
          Swarm intelligence predictions delivered straight to Claude Code and
          Claude Desktop. No setup. No infrastructure. Just ask.
        </p>

        <div className={styles.actions}>
          <a href="#pricing" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Start predicting
          </a>
          <a href="#demo" className="btn btn-ghost">
            See it in action
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>33k+</div>
            <div className={styles.statLabel}>MiroFish GitHub stars</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNumber}>&lt; 30s</div>
            <div className={styles.statLabel}>Setup time</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNumber}>3</div>
            <div className={styles.statLabel}>Free predictions / mo</div>
          </div>
        </div>
      </div>
    </section>
  );
}
