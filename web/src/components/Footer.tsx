import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>DeepMiro</div>
          <div className={styles.tagline}>
            Swarm intelligence predictions for Claude. Built by Joel Libni.
          </div>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Product</h4>
            <ul>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/#demo">Demo</a></li>
              <li><a href="https://github.com/kakarot-dev/deepmiro" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/acceptable-use">Acceptable Use</Link></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:kakarot.joel@gmail.com">kakarot.joel@gmail.com</a></li>
              <li><a href="https://github.com/kakarot-dev/deepmiro/issues" target="_blank" rel="noopener noreferrer">Report an issue</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>&copy; 2026 Joel Libni. All rights reserved.</span>
        <span>
          Powered by{' '}
          <a href="https://github.com/666ghj/MiroFish" target="_blank" rel="noopener noreferrer">
            MiroFish
          </a>
        </span>
      </div>
    </footer>
  );
}
