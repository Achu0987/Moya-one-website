import { COMPARE_ROWS } from '@/lib/content';

export default function CompareTable() {
  return (
    <>
      <div className="compare-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col" className="moya">Moya One</th>
              <th scope="col">20 L bottles</th>
              <th scope="col">RO filter at home</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r) => (
              <tr key={r.label}>
                <td className="row-label">{r.label}</td>
                <td className="moya" data-label="Moya One">{r.moya}</td>
                <td data-label="20 L bottles">{r.bottle}</td>
                <td data-label="RO filter">{r.ro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--muted)' }}>
        * Zero-wastage and RO rejection figures <span className="flag">To confirm</span> before publishing.
      </p>
    </>
  );
}
