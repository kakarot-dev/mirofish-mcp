import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.dot} />
        DeepMiro
      </Link>
      <ul className={styles.links}>
        <li className={styles.hideMobile}>
          <a href="/#how-it-works">How it works</a>
        </li>
        <li className={styles.hideMobile}>
          <a href="/#pricing">Pricing</a>
        </li>
        <li>
          <a href="https://github.com/kakarot-dev/deepmiro" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="/#pricing" className={styles.cta}>
            Get started
          </a>
        </li>
      </ul>
    </nav>
  );
}
