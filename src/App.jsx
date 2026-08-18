import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { celestialBodies } from './data/celestialBodies';
import useLenis from './hooks/useLenis';
import useBodyProgress from './hooks/useBodyProgress';
import StarField from './components/StarField';
import RoadmapSection from './components/RoadmapSection';
import ProgressIndicator from './components/ProgressIndicator';
import NavDots from './components/NavDots';
import DetailView from './components/DetailView';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [openIndex, setOpenIndex] = useState(null);
  const lenisRef = useLenis();
  const heroRef = useRef(null);
  const endRef = useRef(null);

  const sectionIds = useMemo(() => celestialBodies.map((b) => b.id), []);
  const { activeIndex, progress } = useBodyProgress(sectionIds);

  // hero entrance + end-card reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.app-hero > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.25 }
      );
      gsap.fromTo(
        '.app-end > *',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.app-end', start: 'top 70%' },
        }
      );
    }, document.body);
    return () => ctx.revert();
  }, []);

  // late layout shifts (fonts) shouldn't misalign ScrollTriggers
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(t);
  }, []);

  // lock page scroll while the detail overlay is open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (openIndex !== null) lenis.stop();
    else lenis.start();
  }, [openIndex, lenisRef]);

  const jumpToBody = (index) => {
    const el = document.getElementById(celestialBodies[index].id);
    if (!el || !lenisRef.current) return;
    // land with the section vertically centered
    const offset = (el.offsetHeight - window.innerHeight) / 2;
    lenisRef.current.scrollTo(el, { offset, duration: 1.6 });
  };

  const returnToSun = () => {
    lenisRef.current?.scrollTo(0, { duration: 2 });
  };

  const openBody = (id) => {
    const i = celestialBodies.findIndex((b) => b.id === id);
    if (i !== -1) setOpenIndex(i);
  };

  const body = openIndex !== null ? celestialBodies[openIndex] : null;

  return (
    <>
      <StarField />

      <ProgressIndicator bodies={celestialBodies} activeIndex={activeIndex} progress={progress} />
      <NavDots bodies={celestialBodies} activeIndex={activeIndex} onJump={jumpToBody} />

      <main className="app-main">
        <section className="app-hero" ref={heroRef}>
          <p className="app-hero__kicker">An interactive journey</p>
          <h1 className="app-hero__title">
            Solar System
            <span>Roadmap</span>
          </h1>
          <p className="app-hero__sub">
            From the fire of the Sun to the frozen heart of Pluto —
            ten worlds, 5.9 billion kilometers, one scroll.
          </p>
          <button className="app-hero__cta" onClick={() => jumpToBody(0)}>
            Begin at the Sun
          </button>
          <div className="app-hero__hint" aria-hidden="true">
            <span />scroll to travel
          </div>
        </section>

        {celestialBodies.map((b, i) => (
          <RoadmapSection
            key={b.id}
            body={b}
            index={i}
            total={celestialBodies.length}
            onMore={openBody}
          />
        ))}

        <section className="app-end" ref={endRef}>
          <p className="app-end__kicker">5.9 billion km · 39.5 AU</p>
          <h2 className="app-end__title">You've reached the edge of the roadmap</h2>
          <p className="app-end__sub">
            Beyond Pluto, the Kuiper Belt and the Oort Cloud stretch toward the stars.
            The journey back is faster — gravity is on your side.
          </p>
          <button className="app-end__cta" onClick={returnToSun}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
            Return to the Sun
          </button>
        </section>
      </main>

      {body && (
        <DetailView
          body={body}
          index={openIndex}
          total={celestialBodies.length}
          prevName={openIndex > 0 ? celestialBodies[openIndex - 1].name : null}
          nextName={openIndex < celestialBodies.length - 1 ? celestialBodies[openIndex + 1].name : null}
          onPrev={() => setOpenIndex((i) => Math.max(0, i - 1))}
          onNext={() => setOpenIndex((i) => Math.min(celestialBodies.length - 1, i + 1))}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
