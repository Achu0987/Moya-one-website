import Link from 'next/link';
import Logo from './Logo';
import { BRAND, CONTACT, MODEL_CREDITS } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <Logo />
            <p style={{ color: 'var(--muted)', maxWidth: 320 }}>
              Drinking water on tap for apartment towers. Recharge it like your phone.
            </p>
            <span>
              <span className="flag">{BRAND.nameStatus}</span>
            </span>
          </div>
          <div>
            <h4>For homes</h4>
            <ul>
              <li><Link href="/#how">How it works</Link></li>
              <li><Link href="/#recharge">Recharge</Link></li>
              <li><Link href="/#quality">Water quality</Link></li>
              <li><Link href="/compare">Compare options</Link></li>
            </ul>
          </div>
          <div>
            <h4>For builders</h4>
            <ul>
              <li><Link href="/builders">Why Moya One</Link></li>
              <li><Link href="/builders#install">Installation</Link></li>
              <li><Link href="/builders#enquire">Enquire</Link></li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li>{CONTACT.email}</li>
              <li>{CONTACT.phone}</li>
              <li><span className="flag">Placeholder contact</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-note">
          <p>
            Phase 1 concept site. All numbers, readings and plans are sample or illustrative until confirmed.
            No prices are shown. App screens are a concept only.
          </p>
          <p>
            3D models from Poly Pizza:{' '}
            {MODEL_CREDITS.map((m, i) => (
              <span key={m.url}>
                <a href={m.url} target="_blank" rel="noreferrer">{m.name}</a> by {m.author} ({m.license})
                {i < MODEL_CREDITS.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
          <p>© 2026 {BRAND.name}</p>
        </div>
      </div>
    </footer>
  );
}
