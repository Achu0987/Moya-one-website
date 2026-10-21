import CompareTable from '@/components/sections/CompareTable';
import CtaBand from '@/components/sections/CtaBand';
import Icon from '@/components/Icon';

export const metadata = {
  title: 'Compare | Moya One vs 20 L bottles vs RO filters',
  description: 'How Moya One compares with 20 litre bottle delivery and home RO filters.',
};

const OPTIONS = [
  {
    icon: 'bottle',
    name: '20 L bottle delivery',
    pain: 'You order, wait, lift and store heavy cans. When they run out late at night, you wait.',
    moya: 'With Moya One there is nothing to order or carry. Water is already at your kitchen tap.',
  },
  {
    icon: 'filter',
    name: 'RO filter at home',
    pain: 'Cartridges to change, service visits to book, and a unit on your wall. RO can reject a lot of water while purifying.',
    moya: 'With Moya One there is no unit to service in your flat, and the system is designed to avoid that wastage.',
    flag: 'Wastage claim to confirm',
  },
];

export default function ComparePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container section-head center" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Compare</span>
          <h1 className="h-xl">Still carrying bottles?</h1>
          <p className="lead">See how Moya One compares with the two ways most homes get drinking water today.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="grid-2" style={{ marginBottom: 48 }}>
            {OPTIONS.map((o, i) => (
              <div key={o.name} className={`card pain reveal d${i + 1}`}>
                <span className="icon-bubble">
                  <Icon name={o.icon} size={26} />
                </span>
                <h3>Moya One vs {o.name}</h3>
                <p>{o.pain}</p>
                <p style={{ color: 'var(--brand-deep)', fontWeight: 600 }}>{o.moya}</p>
                {o.flag && (
                  <span>
                    <span className="flag">{o.flag}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="reveal">
            <CompareTable />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
