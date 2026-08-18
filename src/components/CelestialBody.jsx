import './CelestialBody.css';

// Reusable animated planet/star visual driven entirely by the body's theme data.
// variant: 'roadmap' (large, in-section) | 'hero' (very large) | 'detail' (compact header)
export default function CelestialBody({ body, size = 320, variant = 'roadmap' }) {
  const { theme } = body;
  const isSaturn = Boolean(theme.ring);
  const isStar = body.id === 'sun';

  return (
    <div
      className={`celestial-body celestial-body--${variant} ${isSaturn ? 'celestial-body--ringed' : ''}`}
      style={{ '--body-size': `${size}px`, '--body-glow': theme.glow, '--body-accent': theme.accent }}
    >
      <div className="celestial-body__aura" />

      {isSaturn && <div className="celestial-body__ring ring-back" style={{ '--ring-color': theme.ring }} />}

      <div className="celestial-body__sphere" style={{ background: theme.surface }}>
        {/* gas giant bands */}
        {theme.bands && (
          <div className="celestial-body__bands">
            {theme.bands.map((color, i) => (
              <span key={i} style={{ '--band-color': color, '--band-delay': `${i * -6}s` }} />
            ))}
          </div>
        )}
        {/* subtle moving cloud sheen for non-banded worlds */}
        {!theme.bands && !isStar && <div className="celestial-body__sheen" />}
        {/* sun corona flicker */}
        {isStar && <div className="celestial-body__corona" />}
        <div className="celestial-body__shade" />
      </div>

      {isSaturn && <div className="celestial-body__ring ring-front" style={{ '--ring-color': theme.ring }} />}
    </div>
  );
}
