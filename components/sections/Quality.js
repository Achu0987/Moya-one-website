'use client';

import { useEffect, useState } from 'react';
import { QUALITY } from '@/lib/content';

const FLATS = ['Flat 1204', 'Flat 0802', 'Flat 0310'];

// Each flat gets slightly different sample readings, to show they are per flat.
const offsets = { 'Flat 1204': 0, 'Flat 0802': 0.04, 'Flat 0310': -0.03 };

function Gauge({ q, value }) {
  const pct = (value - q.min) / (q.max - q.min);
  const r = 64;
  const c = Math.PI * r; // half circle
  const inRange = value >= q.good[0] && value <= q.good[1];
  return (
    <div className="card gauge">
      <svg viewBox="0 0 160 92" aria-hidden="true">
        <defs>
          <linearGradient id={`g-${q.key}`} x1="0" x2="1">
            <stop offset="0" stopColor="#0a7fd1" />
            <stop offset="1" stopColor="#16b8c4" />
          </linearGradient>
        </defs>
        <path d="M16 84 A64 64 0 0 1 144 84" fill="none" stroke="#e3edf3" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M16 84 A64 64 0 0 1 144 84"
          fill="none"
          stroke={`url(#g-${q.key})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, Math.max(0, pct)))}
          style={{ transition: 'stroke-dashoffset 0.9s ease' }}
        />
      </svg>
      <div className="val">{value.toFixed(q.decimals || 0)}</div>
      <div className="unit">{q.unit || ' '}</div>
      <h3>{q.label}</h3>
      <p>{q.hint}</p>
      {inRange && <span className="ok-chip">Within range</span>}
    </div>
  );
}

export default function Quality() {
  const [flat, setFlat] = useState(FLATS[0]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section" id="quality" style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Know your water</span>
          <h2 className="h-lg">See the readings for your own flat.</h2>
          <p className="lead">
            Not a building average. The Moya1 unit measures the water delivered to your home, and you can check it in
            the app at any time.
          </p>
        </div>

        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="flat-picker" role="tablist" aria-label="Choose a flat">
            {FLATS.map((f) => (
              <button key={f} role="tab" aria-selected={flat === f} className={flat === f ? 'on' : ''} onClick={() => setFlat(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-4 reveal d1">
          {QUALITY.map((q, i) => {
            const wobble = Math.sin(tick * 1.3 + i * 2) * 0.012 + offsets[flat];
            const value = q.value * (1 + wobble);
            return <Gauge key={q.key} q={q} value={value} />;
          })}
        </div>

        <div className="quality-foot">
          <span>
            <span className="status-pill" style={{ marginRight: 8 }}>Live</span> Updated every few seconds in this demo
          </span>
          <span>
            <span className="flag">Sample data</span> <span className="flag">Parameter list to confirm</span>
          </span>
        </div>
      </div>
    </section>
  );
}
