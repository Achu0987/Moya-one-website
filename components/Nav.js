'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import Icon from './Icon';
import { NAV } from '@/lib/content';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/#get-moya" className="btn btn-primary btn-sm nav-cta">
          Get Moya One
        </Link>
        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </div>
      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        {NAV.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/#get-moya" className="btn btn-primary" onClick={() => setOpen(false)}>
          Get Moya One
        </Link>
      </div>
    </header>
  );
}
