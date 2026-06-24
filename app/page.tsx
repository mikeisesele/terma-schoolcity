import { SNNav, SHead } from '@/components/ui';
import { Directory } from '@/components/Directory';
import { Strip, KidTrackMarketing } from '@/components/Sections';
import { SCHOOLS, topRated, withScholarships, hiring, specialNeedsSchools, naira } from '@/lib/data';
import { SN } from '@/lib/tokens';

export const revalidate = 60; // ISR — directory refreshes ~every 60s

export default function Home() {
  return (
    <>
      <SNNav />
      <section style={{ textAlign: 'center', padding: '64px 24px 24px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: SN.accentLight, color: SN.accent, padding: '6px 14px', borderRadius: SN.pill, fontSize: 12.5, fontWeight: 800, marginBottom: 20 }}>
          ✓ Verified Nigerian private schools
        </div>
        <h1 className="sn-head" style={{ fontSize: 52, fontWeight: 600, letterSpacing: -1, lineHeight: 1.05, margin: 0, color: SN.ink }}>
          Find the perfect school for your child
        </h1>
        <p style={{ fontSize: 17, color: SN.ink2, fontWeight: 500, lineHeight: 1.6, marginTop: 16 }}>
          Browse, compare and enquire with schools running on KidTrack — fees, facilities, reviews and more, all in one place.
        </p>
        <a href="/find" style={{ display: 'inline-block', marginTop: 22, background: SN.accent, color: '#fff', borderRadius: SN.pill, padding: '13px 28px', fontWeight: 800, fontSize: 15 }}>Find a school →</a>
      </section>

      <Strip eyebrow="Top rated" title="Highly rated schools" schools={topRated()} seeMore="/find?sort=rating" />
      <Strip eyebrow="Affordable" title="Schools offering scholarships" schools={withScholarships()} seeMore="/find?scholarships=1" badgeText={(s) => s.scholarships[0]?.title ?? ''} />
      <Strip eyebrow="Careers" title="Hiring now" schools={hiring()} seeMore="/vacancies" badgeText={(s) => `${s.vacancies.length} open role${s.vacancies.length === 1 ? '' : 's'}`} />
      <Strip eyebrow="Inclusive" title="Special-needs friendly" schools={specialNeedsSchools()} seeMore="/find?special=1" />

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 24px 0' }}>
        <SHead eyebrow="All schools" title="Explore all schools" sub={`${SCHOOLS.length} verified · from ${naira(Math.min(...SCHOOLS.map((s) => s.feeFromKobo)))}/term`} />
        <Directory schools={SCHOOLS} />
      </main>

      <KidTrackMarketing />
      <AskYourSchool />
    </>
  );
}

// Growth loop (ENH-2): persistent bottom bar.
function AskYourSchool() {
  return (
    <div style={{ background: SN.footerBg, color: '#fff', padding: '40px 24px', textAlign: 'center' }}>
      <div className="sn-head" style={{ fontSize: 28, fontWeight: 600 }}>Is your school on KidTrack?</div>
      <p style={{ color: 'rgba(253,250,245,.6)', fontWeight: 500, marginTop: 8 }}>Ask them to join — we’ll reach out on your behalf.</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
        <input placeholder="Your school’s name" style={{ border: 'none', borderRadius: SN.pill, padding: '12px 20px', fontFamily: SN.font, fontSize: 14, fontWeight: 600, minWidth: 260, outline: 'none' }} />
        <button style={{ background: SN.gold, color: SN.footerBg, border: 'none', borderRadius: SN.pill, padding: '12px 22px', fontWeight: 800, fontSize: 14, fontFamily: SN.font, cursor: 'pointer' }}>Ask them to join</button>
      </div>
    </div>
  );
}
