'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SN } from '@/lib/tokens';
import { naira, type School } from '@/lib/data';
import { Stars, VerifiedBadge } from './ui';

const TYPES = ['All', 'All-through', 'Secondary', 'Primary'];

export function Directory({ schools }: { schools: School[] }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [compare, setCompare] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const rows = useMemo(() => schools.filter((s) =>
    (type === 'All' || s.type === type) &&
    (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.location.toLowerCase().includes(q.toLowerCase()))), [schools, q, type]);

  return (
    <>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or location…"
          style={{ flex: 1, minWidth: 240, border: `1.5px solid ${SN.line}`, borderRadius: SN.pill, padding: '12px 20px', fontFamily: SN.font, fontSize: 14.5, fontWeight: 500, outline: 'none', background: '#fff', color: SN.ink }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} style={{
              border: 'none', cursor: 'pointer', fontFamily: SN.font, fontWeight: 700, fontSize: 13.5, padding: '10px 16px', borderRadius: SN.pill,
              background: type === t ? SN.accent : SN.accentLight, color: type === t ? '#fff' : SN.ink2,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ columnCount: 3, columnGap: 20 }}>
        {rows.map((s) => (
          <div key={s.id} style={{ breakInside: 'avoid', marginBottom: 20, background: SN.cardBg, borderRadius: SN.cardR, border: `1px solid ${SN.line}`, boxShadow: SN.shadow, overflow: 'hidden' }}>
            <div style={{ height: 150, background: `linear-gradient(135deg, hsl(${s.hue} 38% 52%), hsl(${s.hue + 20} 42% 38%))`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, left: 12 }}>{s.badge && <VerifiedBadge level={s.badge} />}</div>
              <button onClick={() => setSaved((x) => { const n = new Set(x); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}
                style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.92)', fontSize: 16, color: saved.has(s.id) ? '#D64545' : SN.ink3 }}>
                {saved.has(s.id) ? '♥' : '♡'}
              </button>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16.5, color: SN.ink, lineHeight: 1.25 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: SN.ink3, fontWeight: 600, marginTop: 3 }}>{s.location} · {s.type}</div>
              <div style={{ margin: '12px 0' }}><Stars rating={s.rating} reviews={s.reviews} /></div>
              <div style={{ fontSize: 13.5, color: SN.ink2, fontWeight: 600 }}>From <b style={{ color: SN.ink }}>{naira(s.feeFromKobo)}</b>/term</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <Link href={`/schools/${s.id}`} style={{ flex: 1, textAlign: 'center', background: SN.accent, color: '#fff', padding: '10px', borderRadius: SN.pill, fontSize: 13.5, fontWeight: 700 }}>View school</Link>
                <button onClick={() => setCompare((x) => { const n = new Set(x); n.has(s.id) ? n.delete(s.id) : (n.size < 3 && n.add(s.id)); return n; })}
                  style={{ border: `1.5px solid ${compare.has(s.id) ? SN.accent : SN.line}`, background: compare.has(s.id) ? SN.accentLight : '#fff', color: SN.ink2, borderRadius: SN.pill, padding: '10px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: SN.font }}>+ Compare</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {compare.size > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: SN.footerBg, color: '#fff', borderRadius: SN.pill, padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: SN.shadowHover, zIndex: 40 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{compare.size} school{compare.size === 1 ? '' : 's'} to compare</span>
          <button onClick={() => setShowCompare(true)} disabled={compare.size < 2} style={{ background: SN.gold, color: SN.footerBg, border: 'none', borderRadius: SN.pill, padding: '8px 16px', fontWeight: 800, fontSize: 13.5, cursor: compare.size < 2 ? 'not-allowed' : 'pointer', opacity: compare.size < 2 ? 0.6 : 1, fontFamily: SN.font }}>Compare</button>
          <button onClick={() => setCompare(new Set())} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>
      )}

      {showCompare && <CompareModal schools={schools.filter((s) => compare.has(s.id))} onClose={() => setShowCompare(false)} />}
    </>
  );
}

// Side-by-side comparison of 2–3 selected schools.
function CompareModal({ schools, onClose }: { schools: School[]; onClose: () => void }) {
  const rows: [string, (s: School) => React.ReactNode][] = [
    ['Location', (s) => s.location],
    ['Type', (s) => s.type],
    ['Gender', (s) => s.gender],
    ['Boarding', (s) => s.boarding],
    ['Fees from', (s) => <b style={{ color: SN.ink }}>{naira(s.feeFromKobo)}/term</b>],
    ['Rating', (s) => <Stars rating={s.rating} reviews={s.reviews} />],
    ['Established', (s) => String(s.established)],
    ['Facilities', (s) => `${s.facilities.length} listed`],
    ['Scholarships', (s) => (s.scholarships.length ? `${s.scholarships.length} available` : '—')],
    ['Hiring', (s) => (s.vacancies.length ? `${s.vacancies.length} open` : '—')],
    ['Special-needs', (s) => (s.specialNeeds ? 'Yes' : '—')],
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,30,25,.5)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 18, maxWidth: 760, width: '100%', maxHeight: '88vh', overflow: 'auto', boxShadow: SN.shadowHover, fontFamily: SN.font }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${SN.line}`, position: 'sticky', top: 0, background: '#fff' }}>
          <span className="sn-head" style={{ fontSize: 24, fontWeight: 600, color: SN.ink }}>Compare schools</span>
          <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', fontSize: 24, color: SN.ink3, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr>
              <th style={{ ...cmpCell, textAlign: 'left', width: 130, color: SN.ink3, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.4 }}>&nbsp;</th>
              {schools.map((s) => (
                <th key={s.id} style={{ ...cmpCell, textAlign: 'left', verticalAlign: 'top' }}>
                  <Link href={`/schools/${s.id}`} style={{ fontWeight: 800, fontSize: 15, color: SN.ink, lineHeight: 1.25 }}>{s.name}</Link>
                  {s.badge && <div style={{ marginTop: 6 }}><VerifiedBadge level={s.badge} /></div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, render]) => (
              <tr key={label}>
                <td style={{ ...cmpCell, color: SN.ink3, fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</td>
                {schools.map((s) => <td key={s.id} style={{ ...cmpCell, color: SN.ink2, fontWeight: 600 }}>{render(s)}</td>)}
              </tr>
            ))}
            <tr>
              <td style={cmpCell} />
              {schools.map((s) => (
                <td key={s.id} style={cmpCell}><Link href={`/schools/${s.id}`} style={{ display: 'inline-block', background: SN.accent, color: '#fff', borderRadius: SN.pill, padding: '8px 16px', fontSize: 13, fontWeight: 700 }}>View school →</Link></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cmpCell: React.CSSProperties = { padding: '12px 16px', borderBottom: `1px solid ${SN.line}`, textAlign: 'left' };
