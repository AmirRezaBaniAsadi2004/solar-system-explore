import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CelestialBody from './CelestialBody';
import './DetailView.css';

// Full-screen immersive overlay for a single celestial body.
// Opened from an InfoCard's "More..." button; owns its own scrolling layer.
export default function DetailView({ body, index, total, prevName, nextName, onPrev, onNext, onClose }) {
  const overlayRef = useRef(null);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);

  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  // entrance animation (also re-runs when switching to a neighboring body)
  useEffect(() => {
    const overlay = overlayRef.current;
    scrollRef.current.scrollTop = 0;

    const tl = gsap.timeline();
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    tl.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
      0.08
    );
    return () => {
      tl.kill();
    };
  }, [body.id]);

  // animate out, then let App unmount us
  const close = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      else if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const { theme } = body;

  return (
    <div className="detail-view" ref={overlayRef} role="dialog" aria-modal="true" aria-label={`${body.name} details`}>
      <div className="detail-view__scroll" ref={scrollRef} data-lenis-prevent>
        <button className="detail-view__close" onClick={close} aria-label="Back to roadmap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to roadmap
        </button>

        <div className="detail-view__content" ref={contentRef} style={{ '--dv-accent': theme.accent }}>
          {/* hero */}
          <header className="detail-view__hero">
            <div className="detail-view__hero-visual">
              <CelestialBody body={body} size={240} variant="detail" />
            </div>
            <div className="detail-view__hero-text">
              <span className="detail-view__leg">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {body.distanceAu === 0 ? '0' : body.distanceAu} AU from the Sun
              </span>
              <h2 className="detail-view__name">{body.name}</h2>
              <p className="detail-view__type">{body.type}</p>
              <p className="detail-view__tagline">{body.tagline}</p>
            </div>
          </header>

          {/* quick stats */}
          <section className="detail-view__stats">
            <div>
              <dt>Distance from Sun</dt>
              <dd>{body.distanceFromSun}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{body.size}</dd>
            </div>
            <div>
              <dt>Rotation</dt>
              <dd>{body.rotation}</dd>
            </div>
            <div>
              <dt>Orbital period</dt>
              <dd>{body.orbitalPeriod}</dd>
            </div>
            <div>
              <dt>Temperature</dt>
              <dd>{body.temperature}</dd>
            </div>
          </section>

          {/* prose sections */}
          <section className="detail-view__prose">
            <h3>Overview</h3>
            <p>{body.overview}</p>
            <h3>Physical characteristics</h3>
            <p>{body.physical}</p>
            <h3>Atmosphere</h3>
            <p>{body.atmosphere}</p>
          </section>

          {/* facts */}
          <section className="detail-view__facts">
            <h3>Did you know?</h3>
            <ul>
              {body.facts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </section>

          {/* missions */}
          <section className="detail-view__missions">
            <h3>Exploration missions</h3>
            <ol>
              {body.missions.map((m) => (
                <li key={m.name}>
                  <span className="detail-view__mission-name">{m.name}</span>
                  <span className="detail-view__mission-detail">{m.detail}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* moons */}
          {body.moons.length > 0 && (
            <section className="detail-view__moons">
              <h3>
                Moons <em>({body.moons.length === 1 ? '1 major moon' : `${body.moons.length} highlights`})</em>
              </h3>
              <div className="detail-view__moons-grid">
                {body.moons.map((moon) => (
                  <article key={moon.name} className="detail-view__moon-card">
                    <span className="detail-view__moon-orbit" aria-hidden="true" />
                    <h4>{moon.name}</h4>
                    <p>{moon.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* footer navigation */}
          <footer className="detail-view__footer">
            <button className="detail-view__nav-btn" onClick={onPrev} disabled={!hasPrev}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              {hasPrev ? `Previous · ${prevName}` : 'Start of roadmap'}
            </button>
            <span className="detail-view__footer-hint">← → to navigate · Esc to exit</span>
            <button className="detail-view__nav-btn detail-view__nav-btn--next" onClick={onNext} disabled={!hasNext}>
              {hasNext ? `Next · ${nextName}` : 'End of roadmap'}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
