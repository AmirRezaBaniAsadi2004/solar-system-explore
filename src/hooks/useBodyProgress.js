import { useEffect, useState } from 'react';

// Tracks where the user is on the journey: which roadmap section is currently
// in view (by section id) and the overall scroll progress as a 0–1 ratio.
export default function useBodyProgress(sectionIds) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      raf = 0;
      const mid = window.scrollY + window.innerHeight * 0.5;

      let idx = 0;
      sectionIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) idx = i;
      });
      setActiveIndex((prev) => (prev === idx ? prev : idx));

      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((prev) => {
        const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        return Math.abs(prev - next) < 0.0015 ? prev : next;
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds]);

  return { activeIndex, progress };
}
