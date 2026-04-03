import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import styles from './OpenSource.module.css';

export function OpenSource() {
  const ref = useReveal();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText('docker compose up -d');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="open-source" className={styles.section} ref={ref}>
      <div className="section-container">
        <div className={`${styles.card} reveal`}>
          <div className={styles.text}>
            <div className="section-label">Open source</div>
            <h3 className={styles.title}>Prefer to self-host? It's all here.</h3>
            <p className={styles.desc}>
              DeepMiro is open source under AGPL-3.0. Run it on your own
              infrastructure with your own LLM. Full Docker Compose setup
              included.
            </p>
            <button className={styles.code} onClick={handleCopy}>
              <span>docker compose up -d</span>
              <span className={styles.copyIcon}>
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </span>
            </button>
          </div>
          <div className={styles.badge}>
            <div className={styles.agpl}>AGPL<br />3.0</div>
            <div className={styles.stars}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              33,000+ stars
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
