'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import useInView, { useSeen } from '../three/useInView';
import Icon from '../Icon';
import { PAINS } from '@/lib/content';

const BeforeAfterScene = dynamic(() => import('../three/BeforeAfterScene'), {
  ssr: false,
  loading: () => <div className="canvas-fallback">Loading 3D…</div>,
});

const BEFORE = [
  { t: 'Heavy cans', d: 'Every 20 L can weighs about 20 kg. Someone has to lift it.' },
  { t: 'Order and wait', d: 'Run out at night and you wait for the next delivery.' },
  { t: 'Space and clutter', d: 'A dispenser plus spare cans in your kitchen or balcony.' },
];

const AFTER = [
  { t: 'Water from your own tap', d: 'An extra kitchen tap gives drinking water whenever you need it.' },
  { t: 'Nothing to maintain', d: 'No filters, no cartridges, no service visits for you.' },
  { t: 'You can see the quality', d: 'Your Moya1 unit measures the water reaching your flat.' },
];

export default function OldVsNew() {
  const [mode, setMode] = useState('after');
  const stage = useRef(null);
  const inView = useInView(stage, '400px');
  const seen = useSeen(inView);
  const list = mode === 'before' ? BEFORE : AFTER;

  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Why Moya One</span>
          <h2 className="h-lg">Drinking water, without the daily chores.</h2>
          <p className="lead">
            Most homes still depend on 20 litre bottles or a filter on the wall. Moya One brings safe drinking water
            straight to a tap in your kitchen.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: 'clamp(48px, 7vw, 88px)' }}>
          {PAINS.map((p, i) => (
            <div key={p.title} className={`card pain reveal d${i + 1}`}>
              <span className="icon-bubble">
                <Icon name={p.icon} size={26} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              {p.flag && (
                <span>
                  <span className="flag">{p.flag}</span>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="ba">
          <div ref={stage} className="ba-stage reveal">
            <div className="ba-toggle" role="tablist" aria-label="Compare before and after">
              <button role="tab" aria-selected={mode === 'before'} className={mode === 'before' ? 'on' : ''} onClick={() => setMode('before')}>
                Today
              </button>
              <button
                role="tab"
                aria-selected={mode === 'after'}
                className={mode === 'after' ? 'on moya' : ''}
                onClick={() => setMode('after')}
              >
                With Moya One
              </button>
            </div>
            {seen && <BeforeAfterScene mode={mode} active={inView} />}
            <span className="city-hint">Drag to turn</span>
          </div>
          <div className="reveal d1">
            <span className="eyebrow">{mode === 'before' ? 'Today' : 'With Moya One'}</span>
            <h3 className="h-md" style={{ marginTop: 12, fontSize: 'clamp(26px, 3vw, 36px)' }}>
              {mode === 'before' ? 'Bottles, waiting and lifting.' : 'Open the tap. That is it.'}
            </h3>
            <div className="ba-list">
              {list.map((it) => (
                <div key={it.t} className={`ba-item ${mode === 'before' ? 'bad' : 'good'}`}>
                  <span className="mark">{mode === 'before' ? '✕' : '✓'}</span>
                  <div>
                    <strong>{it.t}</strong>
                    <span>{it.d}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 22 }}
              onClick={() => setMode(mode === 'before' ? 'after' : 'before')}
            >
              {mode === 'before' ? 'Now see it with Moya One' : 'See how it is today'} <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
