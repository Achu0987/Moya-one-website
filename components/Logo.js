import Link from 'next/link';
import { BRAND } from '@/lib/content';

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${BRAND.name} home`}>
      <span className="logo-mark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M12 2.5s7 7.4 7 12.3a7 7 0 0 1-14 0C5 9.9 12 2.5 12 2.5z" />
        </svg>
      </span>
      {BRAND.name}
    </Link>
  );
}
