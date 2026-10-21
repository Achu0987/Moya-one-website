'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import useInView from '../three/useInView';

const HeroScene = dynamic(() => import('../three/HeroScene'), {
  ssr: false,
  loading: () => <div className="canvas-fallback" />,
});

// Scroll position (0..1) where each caption starts. Matches the 3D timeline.
const STOPS = [0, 0.16, 0.42, 0.68];
const DOTS = ['Start', 'Today', 'The change', 'With Moya One'];

export default function Hero() {
  const section = useRef(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const inView = useInView(section, '0px');

  useEffect(() => {
    const onScroll = () => {
      const el = section.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
      progressRef.current = p;
      let s = 0;
      STOPS.forEach((v, i) => {
        if (p >= v + (i ? 0.02 : 0)) s = i;
      });
      setStage(s);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const goTo = (i) => {
    const el = section.current;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const at = i === 0 ? 0 : i === 3 ? 0.9 : STOPS[i] + 0.12;
    window.scrollTo({ top: top + total * at, behavior: 'smooth' });
  };

  const cap = (i) => `hero-cap ${stage === i ? 'on' : ''}`;

  return (
    <section ref={section} className="hero-story" aria-label="Introduction">
      <div className="hero-sticky">
        <HeroScene progressRef={progressRef} active={inView} />

        <div className="container hero-caps">
          {/* 0: headline, visible immediately */}
          <div className={cap(0)}>
            <span className="eyebrow">Drinking water for apartment towers</span>
            <h1 className="h-xl hero-title">
              Get rid of the <span className="accent">hassle.</span>
            </h1>
            <p className="hero-sub">Water on tap. Recharge it like your phone.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => goTo(1)}>
                Show me how <Icon name="arrow" size={18} />
              </button>
              <Link href="/builders" className="btn btn-ghost">
                I am a builder
              </Link>
            </div>
          </div>

          {/* 1: the problem */}
          <div className={cap(1)}>
            <span className="hero-tag bad">Today</span>
            <h2 className="h-lg">This is drinking water today.</h2>
            <p className="hero-sub">Heavy 20 litre cans. Order, wait, lift, store. Every single week.</p>
            <div className="hero-stat">
              <b>≈ 1 tonne</b>
              <span>lifted by one home in a year, at one can a week</span>
            </div>
            <span className="flag">Illustrative</span>
          </div>

          {/* 2: the change */}
          <div className={cap(2)}>
            <span className="hero-tag">The change</span>
            <h2 className="h-lg">
              Moya One turns all of it into <span className="accent">one pipe.</span>
            </h2>
            <p className="hero-sub">A dedicated drinking-water line, built into your tower, reaching every flat.</p>
          </div>

          {/* 3: the result */}
          <div className={cap(3)}>
            <span className="hero-tag good">With Moya One</span>
            <h2 className="h-lg">
              Water on tap. <span className="accent">No bottles.</span>
            </h2>
            <p className="hero-sub">A tap in your kitchen. A plan in your phone. Nothing to carry, nothing to service.</p>
            <div className="hero-actions">
              <Link href="#how" className="btn btn-primary">
                See how it is built <Icon name="arrow" size={18} />
              </Link>
              <Link href="#recharge" className="btn btn-ghost">
                Try the recharge
              </Link>
            </div>
          </div>
        </div>

        <nav className="hero-dots" aria-label="Story steps">
          {DOTS.map((d, i) => (
            <button key={d} className={stage === i ? 'on' : ''} onClick={() => goTo(i)}>
              <span>{d}</span>
              <i />
            </button>
          ))}
        </nav>

        <div className={`scroll-hint hero-scroll ${stage === 3 ? 'hide' : ''}`}>
          <span /> Scroll to see the change
        </div>
      </div>
    </section>
  );
}
