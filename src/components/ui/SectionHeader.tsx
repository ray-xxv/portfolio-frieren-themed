import { Accent } from '../../lib/accent';
import styles from './SectionHeader.module.css';

interface Props {
  index: string;
  file: string;
  title: string[];
  id?: string;
  tone?: 'day' | 'night';
  aside?: string;
}

/** Section heading styled as a code comment over a serif display title. */
export function SectionHeader({ index, file, title, id, tone = 'day', aside }: Props) {
  return (
    <header className={`${styles.head} ${tone === 'night' ? styles.night : ''}`}>
      <p className={`mono ${styles.comment}`} data-reveal>
        <span aria-hidden="true">// </span>
        {index} — <span className={styles.file}>{file}</span>
        {aside && <span className={styles.aside}>{aside}</span>}
      </p>
      <h2 id={id} className={`display ${styles.title}`} data-split>
        {title.map((line, i) => (
          <span key={i} className={styles.line}>
            <Accent text={line} />
          </span>
        ))}
      </h2>
    </header>
  );
}
