import { Manrope } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';

const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata = {
  title: 'Moya One | Get rid of the hassle',
  description:
    'Drinking water on tap in your apartment. No bottles, no filters, no maintenance. Recharge it like your phone.',
};

export const viewport = {
  themeColor: '#f4f9fc',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
