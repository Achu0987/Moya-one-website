import BuildersTeaser from '@/components/sections/BuildersTeaser';
import EnquiryForm from '@/components/sections/EnquiryForm';
import { BRAND } from '@/lib/content';

export const metadata = {
  title: 'For builders | Moya One',
  description: 'Add drinking water on tap to every flat in your project. Installed at construction stage.',
};

const INSTALL = [
  { t: 'Plan together', d: 'We look at your project drawings and plan the system with your team.' },
  { t: 'Central plant & control room', d: 'A control room is set up in the basement or cellar to run and monitor the system.' },
  { t: 'Pipeline to every flat', d: 'A dedicated drinking-water line runs up the tower and into each kitchen.' },
  { t: `${BRAND.unit} unit per flat`, d: 'Each flat gets a Moya1 unit and an extra kitchen tap. Residents subscribe and recharge.' },
];

const FAQ = [
  {
    q: 'Can it be added to a finished building?',
    a: 'Moya One is designed to be installed while the tower is under construction, so it can be planned without any retrofit work.',
  },
  {
    q: 'Who looks after the system?',
    a: 'The system is monitored from the control room. Residents have no filters or servicing to handle.',
  },
  {
    q: 'How do residents pay?',
    a: 'Each household takes a monthly subscription and recharges from the Moya One app.',
  },
  {
    q: 'Are there minimum occupancy or guarantee terms?',
    a: 'Plan structure and terms are being finalised. Our team will share details for your project.',
    flag: 'Terms to confirm',
  },
];

export default function BuildersPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container section-head center" style={{ marginBottom: 0 }}>
          <span className="eyebrow">For builders &amp; developers</span>
          <h1 className="h-xl">A tower with water on tap.</h1>
          <p className="lead">
            Give every flat in your project drinking water from the kitchen tap. No bottles and no filters for buyers,
            and no retrofit for you.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <a href="#enquire" className="btn btn-primary">
              Enquire for a project
            </a>
            <a href="#install" className="btn btn-ghost">
              How installation works
            </a>
          </div>
        </div>
      </section>

      <BuildersTeaser full />

      <section className="section" id="install">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Installation overview</span>
            <h2 className="h-lg">Four parts, planned at construction stage.</h2>
            <p className="lead">A simple overview. Our team takes you through the details for your project.</p>
          </div>
          <div className="timeline">
            {INSTALL.map((s, i) => (
              <div key={s.t} className={`card tl reveal d${(i % 3) + 1}`}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="section-head center reveal">
            <span className="eyebrow">Questions</span>
            <h2 className="h-lg">What builders ask us.</h2>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q} className="card reveal">
                <summary>{f.q}</summary>
                <p>
                  {f.a} {f.flag && <span className="flag">{f.flag}</span>}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="enquire">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="section-head center reveal">
            <span className="eyebrow">Enquire</span>
            <h2 className="h-lg">Tell us about your project.</h2>
            <p className="lead">Share a few details and our team will contact you.</p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
