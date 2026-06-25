'use client';
import Link from 'next/link';
import { SN } from '@/lib/tokens';
import type { School } from '@/lib/data';

export function HighlyRatedStrip({ schools }: { schools: School[] }) {
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${SN.line}`, padding: '16px 40px 20px' }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: SN.ink3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>Highly rated schools</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {schools.map((s) => (
          <HRCard key={s.id} school={s} />
        ))}
      </div>
    </div>
  );
}

function HRCard({ school: s }: { school: School }) {
  return (
    <Link
      href={`/schools/${s.id}`}
      style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${SN.line}`, background: '#fff', cursor: 'pointer', transition: 'all .2s', display: 'block', textDecoration: 'none' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 20px ${s.color}30`;
        (e.currentTarget as HTMLAnchorElement).style.borderColor = s.color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = SN.line;
      }}
    >
      <div style={{ height: 52, background: `linear-gradient(135deg,${s.color} 0%,${s.color}bb 100%)`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{s.name[0]}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>{s.city}</div>
        </div>
        {s.verified && (
          <span style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,.25)', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>✓</span>
        )}
      </div>
      <div style={{ padding: '10px 14px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ color: '#F59E0B', fontSize: 13 }}>{'★'.repeat(Math.floor(s.rating))}{'☆'.repeat(5 - Math.floor(s.rating))}</span>
          <span style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 600 }}>{s.reviews} reviews</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11.5, color: '#374151', fontWeight: 600 }}>{s.levels}</div>
          <div style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 500 }}>{s.students}</div>
        </div>
      </div>
    </Link>
  );
}
