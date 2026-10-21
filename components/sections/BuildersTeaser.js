'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRef } from 'react';
import useInView, { useSeen } from '../three/useInView';
import Icon from '../Icon';
import { BUILDER_BENEFITS, DEPLOYMENT } from '@/lib/content';

const CityScene = dynamic(() => import('../three/CityScene'), {
  ssr: false,
  loading: () => <div className="canvas-fallback">Loading 3D…</div>,
});

export default function BuildersTeaser({ full = false }) {
  const stage = useRef(null);
  const inView = useInView(stage, '400px');
  const seen = useSeen(inView);

  return (
    <section className={`section builders`} id="builders">
      <div className="container">
        <div className="b2b">
          <div>
            <div className="section-head reveal">
              <span className="eyebrow">For builders &amp; developers</span>
              <h2 className="h-lg">Make your tower the one buyers remember.</h2>
              <p className="lead">
                Moya One is planned into your project at construction stage. Every flat gets drinking water on tap, and
                your project gets a feature buyers can see and feel.
              </p>
            </div>
            <div className="grid-2">
              {BUILDER_BENEFITS.map((b, i) => (
                <div key={b.title} className={`card benefit reveal d${(i % 3) + 1}`}>
                  <span className="num">0{i + 1}</span>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              ))}
            </div>
            {!full && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }} className="reveal">
                <Link href="/builders" className="btn btn-primary">
                  Builder overview <Icon name="arrow" size={18} />
                </Link>
                <Link href="/builders#enquire" className="btn btn-ghost">
                  Enquire for a project
                </Link>
              </div>
            )}
          </div>
          <div>
            <div ref={stage} className="city-stage reveal">
              {seen && <CityScene active={inView} />}
              <span className="city-hint">Drag to look around</span>
            </div>
            <div className="card deploy reveal d1">
              <div>
                <b>{DEPLOYMENT.city}</b>
                <br />
                <span>
                  {DEPLOYMENT.homes} · {DEPLOYMENT.status}
                </span>
              </div>
              <span className="flag">{DEPLOYMENT.flag}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
