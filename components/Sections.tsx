import Link from 'next/link';
import { SN } from '@/lib/tokens';
import { naira, type School } from '@/lib/data';
import { Stars, VerifiedBadge } from './ui';

// Horizontal strip of compact school cards (highly-rated, scholarships, hiring, special-needs).
export function Strip({ eyebrow, title, schools, seeMore, badgeText }: { eyebrow?: string; title: string; schools: School[]; seeMore?: string; badgeText?: (s: School) => string }) {
  if (schools.length === 0) return null;
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: '36px 24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          {eyebrow && <div style={{ fontSize: 12, fontWeight: 800, color: SN.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{eyebrow}</div>}
          <h2 className="sn-head" style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.4, margin: 0, color: SN.ink }}>{title}</h2>
        </div>
        {seeMore && <Link href={seeMore} style={{ fontSize: 13.5, fontWeight: 700, color: SN.accent }}>See more →</Link>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {schools.slice(0, 4).map((s) => (
          <Link key={s.id} href={`/schools/${s.id}`} style={{ background: SN.cardBg, borderRadius: SN.cardR, border: `1px solid ${SN.line}`, boxShadow: SN.shadow, overflow: 'hidden', display: 'block' }}>
            <div style={{ height: 96, background: `linear-gradient(135deg, hsl(${s.hue} 38% 52%), hsl(${s.hue + 20} 42% 38%))`, position: 'relative' }}>
              {s.badge && <div style={{ position: 'absolute', top: 10, left: 10 }}><VerifiedBadge level={s.badge} /></div>}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: SN.ink, lineHeight: 1.25 }}>{s.name}</div>
              <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600, marginTop: 2 }}>{s.location}</div>
              <div style={{ marginTop: 8 }}>{badgeText ? <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.accent }}>{badgeText(s)}</span> : <Stars rating={s.rating} reviews={s.reviews} />}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const TILES = [
  ['🚌', 'Real-time bus tracking'], ['🛡️', 'Safety alerts & pickup codes'], ['📘', 'Results & report cards'],
  ['💳', 'Pay fees easily'], ['📅', 'Attendance & calendar'],
];
export function KidTrackMarketing() {
  return (
    <section style={{ background: SN.accentLight, marginTop: 56 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: SN.accent, textTransform: 'uppercase', letterSpacing: 0.8 }}>Powered by KidTrack</div>
        <h2 className="sn-head" style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 0', color: SN.ink }}>Schools on KidTrack give parents more</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, margin: '32px 0 24px' }}>
          {TILES.map(([icon, label]) => (
            <div key={label} style={{ background: '#fff', borderRadius: 16, padding: 18, border: `1px solid ${SN.line}` }}>
              <div style={{ fontSize: 26 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: SN.ink, marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
        <a href="#ask-your-school" style={{ display: 'inline-block', background: SN.accent, color: '#fff', borderRadius: SN.pill, padding: '12px 26px', fontWeight: 800, fontSize: 14, fontFamily: SN.font, cursor: 'pointer' }}>Tell your school about KidTrack</a>
      </div>
    </section>
  );
}

export function Reviews({ school }: { school: School }) {
  const list = school.reviews_list ?? [];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span className="sn-head" style={{ fontSize: 30, fontWeight: 600, color: SN.ink }}>{school.rating.toFixed(1)}</span>
        <div><Stars rating={school.rating} /><div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600 }}>{school.reviews} reviews</div></div>
      </div>
      {list.length === 0
        ? <div style={{ color: SN.ink3, fontWeight: 600 }}>No written reviews yet.</div>
        : list.map((r, i) => (
          <div key={i} style={{ padding: '14px 0', borderTop: i ? `1px solid ${SN.line}` : 'none' }}>
            <Stars rating={r.stars} />
            <div style={{ fontSize: 14.5, color: SN.ink, fontWeight: 500, margin: '8px 0 4px', lineHeight: 1.55 }}>{r.text}</div>
            <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600 }}>{r.anon ? 'Anonymous parent' : r.by}</div>
          </div>
        ))}
      <div style={{ marginTop: 14, fontSize: 12.5, color: SN.ink3, fontWeight: 500 }}>Reviews come from verified parents in the KidTrack app and are moderated. They can’t be written here.</div>
    </div>
  );
}
