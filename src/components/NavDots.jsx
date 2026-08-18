import './NavDots.css';

// Right-edge vertical waystation dots: one per celestial body.
// Clicking a dot smooth-scrolls (via Lenis) to that roadmap section.
export default function NavDots({ bodies, activeIndex, onJump }) {
  return (
    <nav className="nav-dots" aria-label="Solar system roadmap navigation">
      {bodies.map((body, i) => (
        <button
          key={body.id}
          className={`nav-dots__dot ${i === activeIndex ? 'nav-dots__dot--active' : ''}`}
          style={{ '--dot-accent': body.theme.accent }}
          onClick={() => onJump(i)}
          aria-label={`Jump to ${body.name}`}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          <span className="nav-dots__tooltip">{body.name}</span>
        </button>
      ))}
    </nav>
  );
}
