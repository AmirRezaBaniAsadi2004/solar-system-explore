import { useEffect, useRef } from 'react';
import './StarField.css';

// Canvas star background: 3 depth layers, slow parallax via translateY on scroll.
export default function StarField() {
  const canvasRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, raf;
    let scrollY = window.scrollY;
    let currentY = scrollY;

    const LAYERS = [
      { count: 90, size: [0.4, 1.1], speed: 0.06, alpha: [0.3, 0.6] },
      { count: 60, size: [0.8, 1.6], speed: 0.14, alpha: [0.4, 0.8] },
      { count: 30, size: [1.2, 2.2], speed: 0.25, alpha: [0.6, 1] },
    ];

    const rand = (a, b) => a + Math.random() * (b - a);

    const buildLayers = () => {
      layersRef.current = LAYERS.map((cfg) => ({
        cfg,
        stars: Array.from({ length: cfg.count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: rand(...cfg.size),
          a: rand(...cfg.alpha),
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: rand(0.008, 0.03),
          warm: Math.random() < 0.12, // a few warm-tinted stars
        })),
      }));
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      buildLayers();
    };

    const draw = () => {
      currentY += (scrollY - currentY) * 0.08;
      ctx.clearRect(0, 0, width, height);

      for (const layer of layersRef.current) {
        const shift = (currentY * layer.cfg.speed) % height;
        for (const star of layer.stars) {
          star.twinkle += star.twinkleSpeed;
          const y = (((star.y - shift) % height) + height) % height;
          const alpha = star.a * (0.65 + 0.35 * Math.sin(star.twinkle));
          ctx.beginPath();
          ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = star.warm
            ? `rgba(255, 214, 150, ${alpha})`
            : `rgba(220, 235, 255, ${alpha})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onScroll = () => { scrollY = window.scrollY; };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="starfield-nebula nebula-a" />
      <div className="starfield-nebula nebula-b" />
    </div>
  );
}
