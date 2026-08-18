import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CelestialBody from './CelestialBody';
import InfoCard from './InfoCard';
import './RoadmapSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function RoadmapSection({ body, index, total, onMore }) {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const size = body.id === 'sun' ? 400 : 300;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // planet approaches (scale + drift) as the section scrolls through
      gsap.fromTo(
        visualRef.current,
        { scale: 0.72, y: 70, filter: 'brightness(0.5)' },
        {
          scale: 1, y: 0, filter: 'brightness(1)', ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'center 45%',
            scrub: 1.1,
          },
        }
      );

      // slow parallax exit — planet lingers as you scroll past
      gsap.to(visualRef.current, {
        y: -90, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center 45%',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      // info card entrance
      gsap.fromTo(
        sectionRef.current.querySelector('.info-card'),
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 62%' },
        }
      );

      // AU counter line
      gsap.fromTo(
        sectionRef.current.querySelector('.roadmap-section__distance'),
        { opacity: 0, x: index % 2 ? 40 : -40 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <section
      ref={sectionRef}
      id={body.id}
      className={`roadmap-section ${index % 2 ? 'roadmap-section--right' : 'roadmap-section--left'}`}
    >
      <div className="roadmap-section__distance">
        <span className="roadmap-section__au">{body.distanceAu === 0 ? '0' : body.distanceAu} AU</span>
        <span className="roadmap-section__km">
          {body.distanceAu === 0 ? 'The starting point of the journey' : `${body.distanceFromSun} from the Sun`}
        </span>
      </div>

      <div className="roadmap-section__grid">
        <div className="roadmap-section__visual" ref={visualRef}>
          <CelestialBody body={body} size={size} variant="roadmap" />
        </div>
        <div className="roadmap-section__card">
          <InfoCard body={body} index={index} total={total} onMore={onMore} />
        </div>
      </div>
    </section>
  );
}
