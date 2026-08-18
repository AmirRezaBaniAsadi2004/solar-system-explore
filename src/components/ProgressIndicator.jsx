import './ProgressIndicator.css';

// Fixed header showing where the user is on the Sun → Pluto journey:
// progress fill, current body name + distance, and leg counter.
export default function ProgressIndicator({ bodies, activeIndex, progress }) {
  const current = bodies[activeIndex];
  const au = current.distanceAu === 0 ? '0' : String(current.distanceAu);

  return (
    <header className="progress-indicator" role="status" aria-label={`Currently exploring ${current.name}`}>
      <div className="progress-indicator__row">
        <span className="progress-indicator__label progress-indicator__label--start">Sun</span>

        <div className="progress-indicator__mid">
          <span className="progress-indicator__body-name">{current.name}</span>
          <span className="progress-indicator__au">{au} AU</span>
        </div>

        <span className="progress-indicator__leg">
          {String(activeIndex + 1).padStart(2, '0')}/{String(bodies.length).padStart(2, '0')}
        </span>
        <span className="progress-indicator__label progress-indicator__label--end">Pluto</span>
      </div>

      <div className="progress-indicator__track" aria-hidden="true">
        <div
          className="progress-indicator__fill"
          style={{ transform: `scaleX(${progress})`, '--pi-accent': current.theme.accent }}
        />
      </div>
    </header>
  );
}
