import Link from 'next/link';
import { SN } from '@/lib/tokens';

export function SNNav() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(253,250,245,.95)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${SN.line}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: SN.accent, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>K</div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.3, color: SN.ink }}>School Net</span>
        </Link>
        <nav style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 26 }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: SN.ink2 }}>Find a school</Link>
          <Link href="/vacancies" style={{ fontSize: 14, fontWeight: 600, color: SN.ink2 }}>Find a vacancy</Link>
          <button style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: SN.accent, border: 'none', padding: '9px 18px', borderRadius: SN.pill, cursor: 'pointer', fontFamily: SN.font }}>Sign in</button>
        </nav>
      </div>
    </header>
  );
}

export function SHead({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && <div style={{ fontSize: 12.5, fontWeight: 800, color: SN.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{eyebrow}</div>}
      <h2 className="sn-head" style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5, margin: 0, color: SN.ink }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: SN.ink2, fontWeight: 500, marginTop: 8 }}>{sub}</p>}
    </div>
  );
}

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ color: SN.gold, fontSize: 14, letterSpacing: 1 }}>
        {'★★★★★'.split('').map((_, i) => <span key={i} style={{ opacity: i < Math.round(rating) ? 1 : 0.25 }}>★</span>)}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: SN.ink }}>{rating.toFixed(1)}</span>
      {reviews != null && <span style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 500 }}>({reviews})</span>}
    </span>
  );
}

const BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  premium: { label: '★ KidTrack Premium', bg: '#FBEFD3', fg: '#9A6B12' },
  featured: { label: 'Featured', bg: SN.accentLight, fg: SN.accent },
  standard: { label: 'Verified', bg: SN.accentLight, fg: SN.accent },
};
export function VerifiedBadge({ level }: { level: string }) {
  const b = BADGE[level] ?? BADGE.standard;
  return <span style={{ fontSize: 11.5, fontWeight: 800, background: b.bg, color: b.fg, padding: '4px 9px', borderRadius: SN.pill }}>{b.label}</span>;
}
