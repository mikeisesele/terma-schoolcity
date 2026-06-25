import Link from 'next/link';
import { SN } from '@/lib/tokens';
import { naira, type School } from '@/lib/data';
import { Stars, VerifiedBadge } from './ui';
import { SNCard } from './ui';

// ── Strip ────────────────────────────────────────────────────────────────────
// Horizontal 4-card strip with eyebrow, title, and optional "See more" link.
export function Strip({
  eyebrow,
  title,
  schools,
  seeMore,
  badgeText,
}: {
  eyebrow?: string;
  title: string;
  schools: School[];
  seeMore?: string;
  badgeText?: (s: School) => string;
}) {
  if (schools.length === 0) return null;
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          {eyebrow && (
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: SN.gold,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 6,
              fontFamily: SN.font,
            }}>
              {eyebrow}
            </div>
          )}
          <h2
            style={{
              fontFamily: SN.head,
              fontSize: 30,
              fontWeight: 600,
              fontStyle: 'italic',
              letterSpacing: -0.3,
              margin: 0,
              color: SN.ink,
              lineHeight: 1.1,
            }}
          >
            {title}
          </h2>
        </div>
        {seeMore && (
          <Link
            href={seeMore}
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: SN.accent,
              textDecoration: 'none',
              fontFamily: SN.font,
            }}
          >
            See more →
          </Link>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {schools.slice(0, 4).map((s) => (
          <Link
            key={s.id}
            href={`/schools/${s.id}`}
            style={{
              background: SN.cardBg,
              borderRadius: SN.cardR,
              border: `1px solid ${SN.line}`,
              boxShadow: SN.shadow,
              overflow: 'hidden',
              display: 'block',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                height: 96,
                background: `linear-gradient(135deg, hsl(${s.hue} 38% 52%), hsl(${s.hue + 20} 42% 38%))`,
                position: 'relative',
              }}
            >
              {s.badge && (
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <VerifiedBadge level={s.badge} />
                </div>
              )}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: SN.ink, lineHeight: 1.25, fontFamily: SN.font }}>
                {s.name}
              </div>
              <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600, marginTop: 2, fontFamily: SN.font }}>
                {s.city}
              </div>
              <div style={{ marginTop: 8 }}>
                {badgeText ? (
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.gold, fontFamily: SN.font }}>
                    {badgeText(s)}
                  </span>
                ) : (
                  <Stars rating={s.rating} reviews={s.reviews} />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── StatsBanner ──────────────────────────────────────────────────────────────
// Forest-bg row: 247 Schools | 48 Cities | 12,400 Students | 4.7★ Avg
const STATS: { value: string; label: string }[] = [
  { value: '247', label: 'Schools' },
  { value: '48', label: 'Cities' },
  { value: '12,400', label: 'Students' },
  { value: '4.7★', label: 'Avg Rating' },
];

export function StatsBanner() {
  return (
    <div style={{ background: SN.statsBg, marginTop: 56 }}>
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '28px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(250,247,240,.15)' : 'none',
              padding: '4px 32px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: SN.statsVal,
                fontFamily: SN.font,
                lineHeight: 1.1,
                letterSpacing: -0.5,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: SN.statsLbl,
                marginTop: 4,
                fontFamily: SN.font,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ListYourSchoolCTA ────────────────────────────────────────────────────────
// Forest gradient banner: heading + sub + "List your school" link
export function ListYourSchoolCTA() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, #1A3D2C 0%, #0A4B48 100%)`,
        marginTop: 56,
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '56px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: SN.gold,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 14,
            fontFamily: SN.font,
          }}
        >
          For school administrators
        </div>
        <h2
          style={{
            fontFamily: SN.head,
            fontSize: 42,
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#FAF7F0',
            margin: '0 0 14px',
            lineHeight: 1.1,
          }}
        >
          List your school on School Net
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(250,247,240,.7)',
            margin: '0 0 32px',
            lineHeight: 1.7,
            maxWidth: 520,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: SN.font,
            fontWeight: 400,
          }}
        >
          Join 247 verified schools and reach thousands of parents searching for the right school. Free to list — upgrade for premium placement.
        </p>
        <Link
          href="/list-your-school"
          style={{
            display: 'inline-block',
            background: SN.gold,
            color: '#fff',
            borderRadius: SN.pill,
            padding: '14px 32px',
            fontWeight: 800,
            fontSize: 14.5,
            fontFamily: SN.font,
            textDecoration: 'none',
            letterSpacing: 0.2,
          }}
        >
          List your school →
        </Link>
      </div>
    </section>
  );
}

// ── HowItWorks ───────────────────────────────────────────────────────────────
// 3 steps: numbered circles + title + description
const STEPS: { title: string; description: string }[] = [
  {
    title: 'Search & filter',
    description:
      'Browse verified Nigerian schools by location, type, gender policy, boarding options and fee range. Every listing is checked by our team.',
  },
  {
    title: 'Compare schools',
    description:
      'Save up to three schools and compare them side-by-side — fees, facilities, scholarships, ratings and more in one clear view.',
  },
  {
    title: 'Enquire directly',
    description:
      'Send an enquiry straight to the school admissions team. No middlemen, no sign-up required — just a direct connection.',
  },
];

export function HowItWorks() {
  return (
    <section style={{ background: SN.bg, marginTop: 56 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: SN.gold,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: 12,
            fontFamily: SN.font,
          }}
        >
          Simple steps
        </div>
        <h2
          style={{
            fontFamily: SN.head,
            fontSize: 36,
            fontWeight: 600,
            fontStyle: 'italic',
            color: SN.ink,
            margin: '0 0 44px',
            lineHeight: 1.1,
          }}
        >
          How School Net works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: SN.accent,
                  color: '#FAF7F0',
                  fontSize: 22,
                  fontWeight: 800,
                  fontFamily: SN.font,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: SN.ink,
                  marginBottom: 10,
                  fontFamily: SN.font,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: SN.ink2,
                  lineHeight: 1.65,
                  fontFamily: SN.font,
                  fontWeight: 400,
                  maxWidth: 280,
                  margin: '0 auto',
                }}
              >
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── KidTrackMarketing ────────────────────────────────────────────────────────
// "Schools on KidTrack give parents more" + 5 feature tiles
const TILES: { emoji: string; title: string; text: string }[] = [
  { emoji: '🚌', title: 'Real-time bus tracking', text: "See exactly where your child's school bus is and get notified the moment they're picked up or dropped off." },
  { emoji: '🛡️', title: 'Safety alerts & pickup codes', text: 'Instant notifications for safety reports, late arrivals, or anything requiring your attention — straight to your phone.' },
  { emoji: '📘', title: 'Results & report cards', text: "View your child's assessment scores, CA results and termly report cards the moment they're published." },
  { emoji: '💳', title: 'Pay fees easily', text: 'Pay school fees securely via card or bank transfer. Get instant receipts and track your balance per term.' },
  { emoji: '📅', title: 'Attendance & calendar', text: 'See daily attendance records and the school calendar — never miss a PTA meeting, exam or school event.' },
];

export function KidTrackMarketing() {
  return (
    <section style={{ background: SN.accent, marginTop: 56 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: SN.gold,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 14,
                fontFamily: SN.font,
              }}
            >
              Powered by KidTrack
            </div>
            <h2
              style={{
                fontFamily: SN.head,
                fontSize: 42,
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#FAF7F0',
                margin: '0 0 16px',
                lineHeight: 1.05,
              }}
            >
              Schools on KidTrack give parents more
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'rgba(250,247,240,.7)',
                lineHeight: 1.75,
                marginBottom: 28,
                fontWeight: 400,
                maxWidth: 420,
                fontFamily: SN.font,
              }}
            >
              Once your child is enrolled, ask their school to join KidTrack. You get a dedicated parent app that keeps you informed and in control — bus, class, results and fees in one place.
            </p>
            <a
              href="#ask-your-school"
              style={{
                display: 'inline-block',
                background: SN.gold,
                color: '#fff',
                borderRadius: SN.pill,
                padding: '13px 26px',
                fontWeight: 800,
                fontSize: 14,
                fontFamily: SN.font,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Tell your school about KidTrack →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {TILES.map((t) => (
              <div
                key={t.title}
                style={{
                  background: 'rgba(250,247,240,.08)',
                  borderRadius: 16,
                  padding: '18px 16px',
                  border: '1px solid rgba(250,247,240,.12)',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>{t.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#FAF7F0', marginBottom: 5, fontFamily: SN.font }}>
                  {t.title}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'rgba(250,247,240,.6)',
                    fontWeight: 400,
                    lineHeight: 1.55,
                    fontFamily: SN.font,
                  }}
                >
                  {t.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SiteFooter ───────────────────────────────────────────────────────────────
// Dark footer: logo + links + tagline
const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: 'Find a school', href: '/find' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Jobs in schools', href: '/jobs' },
  { label: 'List your school', href: '/list-your-school' },
  { label: 'About', href: '/about' },
];

export function SiteFooter() {
  return (
    <footer style={{ background: SN.footerBg, fontFamily: SN.font }}>
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '40px 24px 28px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 32,
        }}
      >
        {/* Logo + tagline */}
        <div>
          <div
            style={{
              fontFamily: SN.head,
              fontSize: 22,
              fontStyle: 'italic',
              color: 'rgba(250,247,240,.9)',
              marginBottom: 8,
            }}
          >
            School Net{' '}
            <span style={{ color: 'rgba(250,247,240,.45)', fontStyle: 'italic', fontSize: 18 }}>
              by KidTrack
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(250,247,240,.4)', maxWidth: 280, lineHeight: 1.6, fontWeight: 400 }}>
            Nigeria&apos;s trusted directory of verified private schools — helping families find the right fit.
          </div>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: 'rgba(250,247,240,.55)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(250,247,240,.08)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 1160,
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: 12, color: 'rgba(250,247,240,.22)', fontWeight: 500 }}>
          © 2026 KidTrack Technologies Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Keep Reviews export so existing detail-page code continues to compile.
export function Reviews({ school }: { school: School }) {
  const list = school.reviews_list ?? [];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontFamily: SN.head, fontSize: 30, fontWeight: 600, color: SN.ink }}>{school.rating.toFixed(1)}</span>
        <div>
          <Stars rating={school.rating} />
          <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600 }}>{school.reviews} reviews</div>
        </div>
      </div>
      {list.length === 0 ? (
        <div style={{ color: SN.ink3, fontWeight: 600 }}>No written reviews yet.</div>
      ) : (
        list.map((r, i) => (
          <div key={i} style={{ padding: '14px 0', borderTop: i ? `1px solid ${SN.line}` : 'none' }}>
            <Stars rating={r.stars} />
            <div style={{ fontSize: 14.5, color: SN.ink, fontWeight: 500, margin: '8px 0 4px', lineHeight: 1.55 }}>
              {r.text}
            </div>
            <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600 }}>
              {r.anon ? 'Anonymous parent' : r.by}
            </div>
          </div>
        ))
      )}
      <div style={{ marginTop: 14, fontSize: 12.5, color: SN.ink3, fontWeight: 500 }}>
        Reviews come from verified parents in the KidTrack app and are moderated. They can&apos;t be written here.
      </div>
    </div>
  );
}
