import './InfoCard.css';

export default function InfoCard({ body, index, total, onMore }) {
  return (
    <article className="info-card reveal">
      <header className="info-card__header">
        <span className="info-card__index">
          {String(index + 1).padStart(2, '0')} <em>/ {String(total).padStart(2, '0')}</em>
        </span>
        <h2 className="info-card__name">{body.name}</h2>
        <p className="info-card__tagline">{body.tagline}</p>
      </header>

      <p className="info-card__overview">{body.overview}</p>

      <dl className="info-card__stats">
        <div>
          <dt>Type</dt>
          <dd>{body.type}</dd>
        </div>
        <div>
          <dt>Distance from Sun</dt>
          <dd>{body.distanceFromSun}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>{body.size}</dd>
        </div>
      </dl>

      <ul className="info-card__facts">
        {body.facts.slice(0, 2).map((fact, i) => (
          <li key={i}>{fact}</li>
        ))}
      </ul>

      <button className="info-card__more" onClick={() => onMore(body.id)}>
        More<span className="info-card__more-dots">...</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </article>
  );
}
