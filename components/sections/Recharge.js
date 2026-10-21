'use client';

import { useEffect, useRef, useState } from 'react';
import { PLAN_RANGE } from '@/lib/content';

// SAMPLE: usage figures in the phone are illustrative only.
const USED = 312;

export default function Recharge() {
  const [litres, setLitres] = useState(PLAN_RANGE.initial);
  const [balance, setBalance] = useState(PLAN_RANGE.initial - USED);
  const [plan, setPlan] = useState(PLAN_RANGE.initial);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const fill = ((litres - PLAN_RANGE.min) / (PLAN_RANGE.max - PLAN_RANGE.min)) * 100;
  const perDay = Math.round(litres / 30);
  const bottles = Math.round(litres / 20);
  const people = Math.max(1, Math.round(perDay / 4));
  const level = Math.max(0.06, Math.min(1, balance / plan));

  const recharge = () => {
    setBusy(true);
    timers.current.push(
      setTimeout(() => {
        setPlan(litres);
        setBalance(litres);
        setToast(true);
        setBusy(false);
      }, 700),
      setTimeout(() => setToast(false), 3200)
    );
  };

  return (
    <section className="section" id="recharge">
      <div className="container">
        <div className="recharge">
          <div>
            <div className="section-head reveal">
              <span className="eyebrow">Recharge like your phone</span>
              <h2 className="h-lg">Pick a monthly plan. Top up in one tap.</h2>
              <p className="lead">
                Choose how many litres your home needs each month. Recharge from the Moya One app, the same way you
                recharge a mobile.
              </p>
            </div>

            <div className="card plan-card reveal d1">
              <div className="plan-top">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>Monthly plan</div>
                  <div className="plan-litres">
                    {litres.toLocaleString('en-IN')}
                    <small>litres / month</small>
                  </div>
                </div>
                <span className="flag">Illustrative plans · no prices yet</span>
              </div>

              <input
                className="range"
                type="range"
                min={PLAN_RANGE.min}
                max={PLAN_RANGE.max}
                step={PLAN_RANGE.step}
                value={litres}
                onChange={(e) => setLitres(Number(e.target.value))}
                style={{ '--fill': `${fill}%` }}
                aria-label="Monthly litres"
              />
              <div className="range-scale">
                <span>{PLAN_RANGE.min} L</span>
                <span>{PLAN_RANGE.max} L</span>
              </div>

              <div className="plan-facts">
                <div className="fact">
                  <b>≈ {perDay} L</b>
                  <span>a day</span>
                </div>
                <div className="fact">
                  <b>{bottles}</b>
                  <span>fewer 20 L cans to lift</span>
                </div>
                <div className="fact">
                  <b>{people === 1 ? '1 person' : `${people} people`}</b>
                  <span>drinking &amp; cooking</span>
                </div>
              </div>

              <button className="btn btn-primary" onClick={recharge} disabled={busy}>
                {busy ? 'Recharging…' : `Recharge ${litres.toLocaleString('en-IN')} L`}
              </button>
            </div>
          </div>

          <div className="reveal d2">
            <div className="phone" aria-label="Moya One app concept">
              <div className="phone-screen">
                <div className="phone-notch" />
                <div className={`toast ${toast ? 'show' : ''}`}>✓ Recharged. {plan.toLocaleString('en-IN')} L added for this month.</div>
                <div className="app-row">
                  <span className="app-hello">Flat 1204</span>
                  <span className="status-pill">Connected</span>
                </div>
                <div className="tank">
                  <div className="tank-water" style={{ height: `${level * 82}%` }} />
                  <div className="tank-text">
                    <span>Balance this month</span>
                    <b>{balance.toLocaleString('en-IN')} L</b>
                    <span>of {plan.toLocaleString('en-IN')} L plan</span>
                  </div>
                </div>
                <div className="app-mini">
                  <div>
                    <b>{balance === plan ? 0 : USED} L</b>
                    <span>used this month</span>
                  </div>
                  <div>
                    <b style={{ color: 'var(--good)' }}>Good</b>
                    <span>water quality</span>
                  </div>
                  <div>
                    <b>Plans</b>
                    <span>change any time</span>
                  </div>
                  <div>
                    <b>Help</b>
                    <span>talk to support</span>
                  </div>
                </div>
                <button className="app-btn" onClick={recharge} disabled={busy}>
                  {busy ? 'Recharging…' : 'Recharge'}
                </button>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13.5, color: 'var(--muted)' }}>
              App concept · <span className="flag">Sample data</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
