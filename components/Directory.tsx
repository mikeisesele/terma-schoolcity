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
          <button style={{ background: SN.gold, color: SN.footerBg, border: 'none', borderRadius: SN.pill, padding: '8px 16px', fontWeight: 800, fontSize: 13.5, cursor: 'pointer', fontFamily: SN.font }}>Compare</button>
          <button onClick={() => setCompare(new Set())} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>
      )}
    </>
  );
}
