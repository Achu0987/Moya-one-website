'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import useInView, { useSeen } from '../three/useInView';
import { STEPS } from '@/lib/content';

const TowerScene = dynamic(() => import('../three/TowerScene'), {
  ssr: false,
  loading: () => <div className="canvas-fallback">Loading 3D…</div>,
});

// Scroll-driven story: the section is tall, the 3D scene is sticky, and the
// scroll position inside the section drives the animation (0 → 1).
export default function HowItWorks() {
  const section = useRef(null);
  const progressRef = useRef(0);
  const bar = useRef(null);
  const [step, setStep] = useState(0);
  const inView = useInView(section, '400px');
  const seen = useSeen(inView);

  useEffect(() => {
    const onScroll = () => {
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      progressRef.current = p;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jumpTo = (i) => {
    const el = section.current;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * ((i + 0.55) / STEPS.length), behavior: 'smooth' });
  };

  return (
    <section ref={section} className="story" id="how" aria-label="How Moya One works">
      <div className="story-sticky">
        {seen && <TowerScene progressRef={progressRef} active={inView} />}
        <div className="container story-ui">
          <div className="story-panel">
            <span className="eyebrow">How it works</span>
            <h2 className="h-lg" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>
              From the basement to your kitchen tap.
            </h2>
            <p className="lead" style={{ fontSize: 17 }}>
              Scroll to watch the system come together, one step at a time.
            </p>
            <div className="story-progress">
              <i ref={bar} style={{ transform: 'scaleX(0)' }} />
            </div>
            <div className="story-steps">
              {STEPS.map((s, i) => (
                <button
                  key={s.n}
                  className={`story-step ${i === step ? 'active' : ''}`}
                  onClick={() => jumpTo(i)}
                  style={{ textAlign: 'left', font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                >
                  <span className="n">STEP {s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
