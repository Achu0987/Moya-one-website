import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import OldVsNew from '@/components/sections/OldVsNew';
import HowItWorks from '@/components/sections/HowItWorks';
import Recharge from '@/components/sections/Recharge';
import Quality from '@/components/sections/Quality';
import CompareTable from '@/components/sections/CompareTable';
import BuildersTeaser from '@/components/sections/BuildersTeaser';
import CtaBand from '@/components/sections/CtaBand';
import Icon from '@/components/Icon';

// Consumers first; builders after (per the client brief).
export default function Home() {
  return (
    <>
      <Hero />
      <OldVsNew />
      <HowItWorks />
      <Recharge />
      <Quality />
      <section className="section" id="compare">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Compare</span>
            <h2 className="h-lg">Moya One vs bottles vs RO filters.</h2>
            <p className="lead">A simple side-by-side, so you can decide for yourself.</p>
          </div>
          <div className="reveal">
            <CompareTable />
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }} className="reveal">
            <Link href="/compare" className="btn btn-ghost">
              Full comparison <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>
      <BuildersTeaser />
      <div style={{ background: '#e6f1f8', paddingTop: 1 }}>
        <CtaBand />
      </div>
    </>
  );
}
