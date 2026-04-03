import { useReveal } from '../hooks/useReveal';
import styles from './Demo.module.css';

export function Demo() {
  const ref = useReveal();

  return (
    <section id="demo" className={styles.section} ref={ref}>
      <div className="section-container">
        <div className="reveal">
          <div className="section-label">See it in action</div>
          <h2 className="section-title">This is the entire experience.</h2>
          <p className="section-desc">
            No dashboards. No web apps. No learning curve. Just a conversation
            with Claude.
          </p>
        </div>

        <div className={`${styles.wrapper} reveal`}>
          <div className={styles.terminal}>
            <div className={styles.header}>
              <div className={styles.dotRed} />
              <div className={styles.dotYellow} />
              <div className={styles.dotGreen} />
              <span className={styles.headerTitle}>Claude Code</span>
            </div>
            <div className={styles.body}>
              <Line>
                <span className={styles.prompt}>you </span>
                <span className={styles.command}>
                  Will Apple's Vision Pro succeed as a mass-market product by
                  2028?
                </span>
              </Line>
              <Line />
              <Line>
                <span className={styles.prompt}>claude </span>
                <span className={styles.output}>
                  I'll run a swarm prediction on this. Creating a simulation
                  with 40 agents
                </span>
              </Line>
              <Line>
                <span className={styles.output}>
                  across tech industry, consumer behavior, and market analysis
                  domains...
                </span>
              </Line>
              <Line />
              <Line>
                <span className={styles.dim}>
                  {'  '}Generating agent personas{'    '}
                </span>
                <span className={styles.success}>done</span>
              </Line>
              <Line>
                <span className={styles.dim}>
                  {'  '}Building knowledge graph{'      '}
                </span>
                <span className={styles.success}>done</span>
              </Line>
              <Line>
                <span className={styles.dim}>
                  {'  '}Running 72h simulation{'        '}
                </span>
                <span className={styles.progress}>
                  ████████████████
                </span>
                <span className={styles.success}> done</span>
              </Line>
              <Line>
                <span className={styles.dim}>
                  {'  '}Generating prediction report{'  '}
                </span>
                <span className={styles.success}>done</span>
              </Line>
              <Line />
              <Line>
                <span className={styles.output}>
                  ## Prediction Report: Apple Vision Pro Mass-Market Viability
                </span>
              </Line>
              <Line />
              <Line>
                <span className={styles.output}>
                  <strong>Consensus:</strong> Unlikely (72% of agents)
                </span>
              </Line>
              <Line>
                <span className={styles.output}>
                  <strong>Confidence:</strong> High (agent agreement: 0.81)
                </span>
              </Line>
              <Line />
              <Line>
                <span className={styles.output}>
                  The swarm predicts Vision Pro will remain a niche professional
                  tool
                </span>
              </Line>
              <Line>
                <span className={styles.output}>
                  through 2028. Key factors: price elasticity threshold not met
                  below
                </span>
              </Line>
              <Line>
                <span className={styles.output}>
                  $1,500, limited killer app ecosystem, and social adoption
                  barriers...
                </span>
              </Line>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ children }: { children?: React.ReactNode }) {
  return <span className={styles.line}>{children ?? '\u00A0'}</span>;
}
