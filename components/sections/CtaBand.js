import Link from 'next/link';
import { CONTACT } from '@/lib/content';

export default function CtaBand({ id = 'get-moya' }) {
  return (
    <section className="section" id={id} style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band reveal">
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 14 }}>
            <h2 className="h-lg">Want Moya One in your building?</h2>
            <p className="lead">
              Tell us where you live, or which project you are building. Our team will get in touch.
            </p>
            <p style={{ fontSize: 14, opacity: 0.85 }}>
              {CONTACT.email} · {CONTACT.phone}{' '}
              <span className="flag" style={{ marginLeft: 6 }}>Placeholder contact</span>
            </p>
          </div>
          <div className="cta-actions">
            <Link href="/builders#enquire" className="btn btn-white">
              I am a builder
            </Link>
            <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost">
              I am a resident
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
