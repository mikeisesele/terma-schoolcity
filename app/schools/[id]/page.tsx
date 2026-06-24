import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SNNav, Stars, VerifiedBadge, SHead } from '@/components/ui';
import { EnquireForm } from '@/components/EnquireForm';
import { SCHOOLS, getSchool, naira } from '@/lib/data';
import { SN } from '@/lib/tokens';

export const revalidate = 60; // SSR + ISR for SEO

export function generateStaticParams() {
  return SCHOOLS.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const s = getSchool(params.id);
  if (!s) return { title: 'School not found' };
  return {
    title: s.name,
    description: `${s.name} — ${s.tagline}. ${s.type} school in ${s.location}. Fees from ${naira(s.feeFromKobo)}/term.`,
    openGraph: { title: s.name, description: s.tagline },
  };
}

const wrap: React.CSSProperties = { maxWidth: 1000, margin: '0 auto', padding: '0 24px' };

export default function SchoolDetail({ params }: { params: { id: string } }) {
  const s = getSchool(params.id);
  if (!s) notFound(); // unknown / unverified → 404, never leak a draft

  return (
    <>
      <SNNav />
      <div style={{ height: 220, background: `linear-gradient(135deg, hsl(${s.hue} 38% 50%), hsl(${s.hue + 20} 42% 36%))` }} />
      <div style={{ ...wrap, marginTop: -64 }}>
        <div style={{ background: '#fff', borderRadius: SN.cardR, border: `1px solid ${SN.line}`, boxShadow: SN.shadow, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              {s.badge && <div style={{ marginBottom: 10 }}><VerifiedBadge level={s.badge} /></div>}
              <h1 className="sn-head" style={{ fontSize: 38, fontWeight: 600, letterSpacing: -0.5, margin: 0, color: SN.ink }}>{s.name}</h1>
              <p style={{ fontSize: 16, color: SN.ink2, fontWeight: 500, marginTop: 6 }}>{s.tagline}</p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                <Stars rating={s.rating} reviews={s.reviews} />
                <span style={{ fontSize: 13.5, color: SN.ink2, fontWeight: 600 }}>{s.location}</span>
                <span style={{ fontSize: 13.5, color: SN.ink2, fontWeight: 600 }}>Est. {s.established}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600 }}>Fees from</div>
              <div className="sn-head" style={{ fontSize: 30, fontWeight: 600, color: SN.ink }}>{naira(s.feeFromKobo)}</div>
              <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600 }}>per term</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${SN.line}`, flexWrap: 'wrap' }}>
            {[['Type', s.type], ['Gender', s.gender], ['Boarding', s.boarding]].map(([l, v]) => (
              <div key={l}><div style={{ fontSize: 12, color: SN.ink3, fontWeight: 700, textTransform: 'uppercase' }}>{l}</div><div style={{ fontSize: 14.5, fontWeight: 700, color: SN.ink }}>{v}</div></div>
            ))}
          </div>
        </div>

        <Section title="Facilities">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {s.facilities.map((f) => <span key={f} style={{ background: SN.accentLight, color: SN.accent, padding: '8px 14px', borderRadius: SN.pill, fontSize: 13.5, fontWeight: 700 }}>{f}</span>)}
          </div>
        </Section>

        {s.vacancies.length > 0 && (
          <Section title="Hiring now">
            {s.vacancies.map((v) => (
              <div key={v.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${SN.line}` }}>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: SN.ink, fontSize: 15 }}>{v.title}</div><div style={{ fontSize: 13, color: SN.ink3, fontWeight: 600 }}>{v.dept}</div></div>
                <button style={{ background: SN.accent, color: '#fff', border: 'none', borderRadius: SN.pill, padding: '9px 18px', fontWeight: 700, fontSize: 13.5, fontFamily: SN.font, cursor: 'pointer' }}>Apply</button>
              </div>
            ))}
          </Section>
        )}

        {s.scholarships.length > 0 && (
          <Section title="Scholarships">
            {s.scholarships.map((sc) => (
              <div key={sc.title} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${SN.line}` }}>
                <span style={{ fontWeight: 700, color: SN.ink }}>{sc.title}</span><span style={{ fontWeight: 700, color: SN.accent }}>{sc.value}</span>
              </div>
            ))}
          </Section>
        )}

        <Section title="Location">
          <iframe
            title="map"
            style={{ width: '100%', height: 260, border: 'none', borderRadius: 14 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=3.30%2C6.40%2C3.50%2C6.55&layer=mapnik`}
          />
        </Section>

        <Section title="Enquire now">
          <EnquireForm school={s.name} />
        </Section>
      </div>
      <div style={{ height: 60 }} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 28 }}>
      <SHead title={title} />
      <div style={{ background: '#fff', borderRadius: SN.cardR, border: `1px solid ${SN.line}`, boxShadow: SN.shadow, padding: 24 }}>{children}</div>
    </section>
  );
}
