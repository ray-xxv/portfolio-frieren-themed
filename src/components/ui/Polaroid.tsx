import type { Project } from '../../data/content';
import { ProjectCover } from './ProjectCover';
import styles from './Polaroid.module.css';

interface Props {
  project: Project;
  index: number;
}

const tilts = [-3, 2.5, -1.5, 3, -2.5, 1.5];

/** A project as a taped polaroid with its field notes underneath. */
export function Polaroid({ project, index }: Props) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <article className={`project-card ${styles.card}`} style={{ ['--tilt' as string]: `${tilts[index % tilts.length]}deg` }} aria-labelledby={`project-${index}`}>
      <span className={styles.index} aria-hidden="true">
        {n}
      </span>
      <div className={styles.photoFrame}>
        <span className={styles.tape} aria-hidden="true" />
        <div className={styles.photo}>
          {project.image ? <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" /> : <ProjectCover index={index} title={project.title} />}
        </div>
        <p className={`hand ${styles.caption}`}>{project.caption}</p>
      </div>
      <div className={styles.body}>
        <p className={`mono ${styles.meta}`}>
          {project.year} · {project.stack.length} spells used
        </p>
        <h3 id={`project-${index}`} className={styles.title}>
          {project.title}
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.stack} aria-label="Tech stack">
          {project.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <div className={styles.links}>
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="mono">
              source <span aria-hidden="true">↗</span>
              <span className="sr-only"> for {project.title} (opens in new tab)</span>
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="mono">
              live <span aria-hidden="true">↗</span>
              <span className="sr-only"> demo of {project.title} (opens in new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
