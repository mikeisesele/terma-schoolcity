import Link from 'next/link';
import { SNNav } from '@/components/ui';
import { Strip, KidTrackMarketing } from '@/components/Sections';
import { AskYourSchool } from '@/components/AskYourSchool';
import { Directory } from '@/components/Directory';
import { HomeHero, HeroSearch } from '@/components/HomeHero';
import { HighlyRatedStrip } from '@/components/HighlyRated';
import {
  SCHOOLS,
  topRated,
  withScholarships,
  hiring,
  specialNeedsSchools,
  naira,
} from '@/lib/data';
import { SN } from '@/lib/tokens';

export const revalidate = 60;

// Carousel = non-special schools (mirrors prototype: CAROUSEL = SN_SCHOOLS.filter(s => !s.special))
const carousel = SCHOOLS.filter((s) => !s.special);

// Highly rated = non-featured, non-special, sorted by rating (mirrors prototype HIGHLY_RATED)
const FEATURED_IDS = SCHOOLS.slice(0, 4).map((s) => s.id);
const highlyRated = [...SCHOOLS]
  .filter((s) => !FEATURED_IDS.includes(s.id) && !s.special)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4);

const PARENT_FEATURES = [
  { emoji: '🚌', title: 'Real-time bus tracking', text: "See exactly where your child's school bus is and get notified the moment they're picked up or dropped off." },
  { emoji: '🔔', title: 'Safety alerts', text: 'Instant notifications for safety reports, late arrivals, or anything requiring your attention — straight to your phone.' },
  { emoji: '📊', title: 'Results & report cards', text: "View your child's assessment scores, CA results and termly report cards the moment they're published." },
  { emoji: '💳', title: 'Pay fees easily', text: 'Pay school fees securely via card or bank transfer. Get instant receipts and track your balance per term.' },
  { emoji: '📅', title: 'Attendance & calendar', text: "See daily attendance records and the school calendar — never miss a PTA meeting, exam or school event." },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: SN.bg, fontFamily: SN.font }}>

      {/* ── 1. Nav ── */}
      <SNNav />

      {/* ── 2. Hero section ── */}
      <section style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto', padding: '64px 24px 24px' }}>
        {/* Verified badge chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: SN.accent, color: '#fff',
          padding: '6px 14px', borderRadius: SN.pill,
          fontSize: 12.5, fontWeight: 800, marginBottom: 20,
        }}>
          ✓ Verified Nigerian private schools
        </div>

        {/* Main heading */}
        <h1 className="sn-head" style={{
          fontSize: 52, fontWeight: 600, letterSpacing: -1,
          lineHeight: 1.05, margin: 0, color: SN.ink,
        }}>
          Find the perfect school<br />for your child
        </h1>

        {/* Sub text */}
        <p style={{
          fontSize: 17, color: SN.ink2, fontWeight: 500,
          lineHeight: 1.6, marginTop: 16,
        }}>
          Browse, compare and enquire with verified Nigerian private schools —
          fees, facilities, reviews and more, all in one place.
        </p>

        {/* Interactive search — client component */}
        <HeroSearch />
      </section>

      {/* ── 3. Stats bar ── */}
      <div style={{ background: SN.statsBg, padding: '18px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', textAlign: 'center' }}>
          {[
            { val: '247', lbl: 'Schools' },
            { val: '48',  lbl: 'Cities' },
            { val: '12,400', lbl: 'Students enrolled' },
            { val: '4.7',  lbl: 'Avg rating' },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div style={{ fontSize: 28, fontWeight: 900, color: SN.statsVal, fontFamily: SN.head }}>{val}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: SN.statsLbl, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Hero carousel — client component ── */}
      <HomeHero carousel={carousel} />

      {/* ── 4b. Highly rated strip (compact 4-card row, client for hover) ── */}
      <HighlyRatedStrip schools={highlyRated} />

      {/* ── 5. Top rated strip ── */}
      <Strip
        eyebrow="Top rated"
        title="Highly rated schools"
        schools={topRated()}
        seeMore="/find?sort=rating"
      />

      {/* ── 6. Scholarships strip ── */}
      <Strip
        eyebrow="Scholarships"
        title="Schools offering financial support"
        schools={withScholarships()}
        seeMore="/find?scholarships=1"
        badgeText={(s) =>
          s.scholarships.length > 0
            ? `${s.scholarships.length} scholarship${s.scholarships.length === 1 ? '' : 's'}`
            : ''
        }
      />

      {/* ── 7. Hiring strip ── */}
      <Strip
        eyebrow="Careers"
        title="Schools hiring now"
        schools={hiring()}
        seeMore="/vacancies"
        badgeText={(s) =>
          s.vacancies.length > 0
            ? `${s.vacancies.length} open role${s.vacancies.length === 1 ? '' : 's'}`
            : ''
        }
      />

      {/* ── 8. Special needs strip ── */}
      <Strip
        eyebrow="Inclusive"
        title="Special-needs friendly schools"
        schools={specialNeedsSchools()}
        seeMore="/find?special=1"
      />

      {/* ── 9. Full directory ── */}
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: SN.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>All schools</div>
            <h2 className="sn-head" style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5, margin: 0, color: SN.ink }}>
              Explore the full directory
            </h2>
            <p style={{ fontSize: 15, color: SN.ink2, fontWeight: 500, marginTop: 6 }}>
              {SCHOOLS.length} verified schools · from {naira(Math.min(...SCHOOLS.map((s) => s.feeFrom)))}/term
            </p>
          </div>
          <Link href="/find" style={{ fontSize: 13.5, fontWeight: 700, color: SN.accent, textDecoration: 'none' }}>See all →</Link>
        </div>
        <Directory schools={SCHOOLS} />
      </main>

      {/* ── 10. "List your school" CTA banner ── */}
      <section style={{
        background: `linear-gradient(135deg, ${SN.accent} 0%, #0F2518 100%)`,
        margin: '56px 0 0',
        padding: '56px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: SN.statsLbl, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
            For schools
          </div>
          <h2 className="sn-head" style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
            Is your school ready to grow?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,247,240,.7)', fontWeight: 500, lineHeight: 1.7, margin: '0 0 28px' }}>
            List your school on School Net and reach thousands of Nigerian families searching for the right school today.
          </p>
          <Link
            href="/list-your-school"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: SN.accent,
              borderRadius: SN.btnR,
              padding: '13px 32px',
              fontWeight: 800,
              fontSize: 15,
              fontFamily: SN.font,
              textDecoration: 'none',
            }}
          >
            List your school →
          </Link>
        </div>
      </section>

      {/* ── 11. How it works ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: SN.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Simple & free</div>
          <h2 className="sn-head" style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5, margin: 0, color: SN.ink }}>How it works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {[
            { step: '1', title: 'Search', text: 'Enter your city or area and filter by school type, level, or budget to find schools that match your needs.' },
            { step: '2', title: 'Compare', text: 'View verified profiles with fees, facilities, ratings, and reviews. Add schools to compare them side-by-side.' },
            { step: '3', title: 'Enquire', text: 'Send an enquiry directly to any school. The admissions team will respond — all from one place.' },
          ].map(({ step, title, text }) => (
            <div key={step} style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: SN.accentLight, color: SN.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 900, margin: '0 auto 16px',
                fontFamily: SN.head,
              }}>{step}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: SN.ink, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontSize: 15, color: SN.ink2, fontWeight: 500, lineHeight: 1.65, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. KidTrack marketing ── */}
      <KidTrackMarketing />

      {/* ── 12b. For Parents (forest bg, 2-col grid) ── */}
      <section style={{ background: SN.accent, padding: '64px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: `${SN.accentText}80`, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 14 }}>For parents</div>
              <h2 className="sn-head" style={{ fontFamily: SN.head, fontSize: 44, fontWeight: 700, color: SN.accentText, lineHeight: 1.05, fontStyle: 'italic', margin: '0 0 16px' }}>
                Stay connected with your child — every day
              </h2>
              <p style={{ fontSize: 16, color: `${SN.accentText}80`, lineHeight: 1.75, margin: '0 0 28px', fontWeight: 300, maxWidth: 440 }}>
                Once your child is enrolled, ask their school to join KidTrack. You get a dedicated parent app that keeps you informed and in control.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <a
                  href="#ask-your-school"
                  style={{
                    border: 'none', background: `${SN.accentText}18`, color: SN.accentText,
                    borderRadius: SN.btnR, padding: '13px 26px', fontFamily: SN.font,
                    fontSize: 14, fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(8px)',
                    textDecoration: 'none', display: 'inline-block',
                  }}
                >
                  Tell your school about KidTrack →
                </a>
                <Link
                  href="/about"
                  style={{
                    border: `1.5px solid ${SN.accentText}35`, background: 'transparent',
                    color: `${SN.accentText}80`, borderRadius: SN.btnR,
                    padding: '12px 22px', fontFamily: SN.font,
                    fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block',
                  }}
                >
                  Learn more
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {PARENT_FEATURES.map((f) => (
                <div key={f.title} style={{
                  background: `${SN.accentText}10`, borderRadius: 16,
                  padding: '18px 16px', border: `1px solid ${SN.accentText}18`,
                }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{f.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: SN.accentText, marginBottom: 5 }}>{f.title}</div>
                  <div style={{ fontSize: 12.5, color: `${SN.accentText}65`, fontWeight: 400, lineHeight: 1.55 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AskYourSchool nudge ── */}
      <AskYourSchool />

      {/* ── 13. Footer ── */}
      <footer style={{
        background: SN.footerBg, padding: '22px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: SN.font,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: SN.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: SN.accentText, fontSize: 13, fontWeight: 900 }}>S</span>
          </div>
          <span style={{ fontFamily: SN.head, fontSize: 18, color: 'rgba(255,255,255,.3)', fontStyle: 'italic' }}>
            School Net <span style={{ fontStyle: 'italic' }}>by KidTrack</span>
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 20 }}>
          {[
            ['Browse schools', '/find'],
            ['Vacancies', '/vacancies'],
            ['Scholarships', '/find?scholarships=1'],
            ['List your school', '/list-your-school'],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 600, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', fontWeight: 500 }}>
          © 2026 KidTrack Technologies Ltd. All rights reserved
        </div>
      </footer>
    </div>
  );
}
