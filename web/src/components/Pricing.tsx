import { useReveal } from '../hooks/useReveal';
import styles from './Pricing.module.css';

const tiers = [
  {
    name: 'Free',
    tagline: 'Try it out',
    price: 0,
    features: [
      '3 predictions per month',
      'All prediction modes',
      'Full reports',
      '1 concurrent simulation',
      'Community support',
    ],
    cta: 'Get started free',
    featured: false,
  },
  {
    name: 'Pro',
    tagline: 'For regular use',
    price: 15,
    features: [
      '30 predictions per month',
      'All prediction modes',
      'Full reports',
      '3 concurrent simulations',
      'Email support',
    ],
    cta: 'Start with Pro',
    featured: true,
  },
  {
    name: 'Business',
    tagline: 'For teams & power users',
    price: 40,
    features: [
      '100 predictions per month',
      'All prediction modes',
      'Full reports',
      '3 concurrent + priority queue',
      'Priority support',
    ],
    cta: 'Go Business',
    featured: false,
  },
];

export function Pricing() {
  const ref = useReveal();

  return (
    <section id="pricing" className={styles.section} ref={ref}>
      <div className="section-container">
        <div className="reveal">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Start free. Scale when ready.</h2>
          <p className="section-desc">
            Same prediction quality on every tier. No throttling, no feature
            gates. Just more capacity.
          </p>
        </div>

        <div className={`${styles.grid} reveal-stagger`}>
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`${styles.card} ${tier.featured ? styles.featured : ''} reveal`}
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className={styles.tierName}>{tier.name}</div>
              <div className={styles.tagline}>{tier.tagline}</div>
              <div className={styles.amount}>
                <span className={styles.currency}>$</span>
                {tier.price}
                <span className={styles.period}>/mo</span>
              </div>
              <ul className={styles.features}>
                {tier.features.map((f) => (
                  <li key={f}>
                    <span className={styles.check}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`${styles.btn} ${tier.featured ? styles.btnFill : styles.btnOutline}`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
