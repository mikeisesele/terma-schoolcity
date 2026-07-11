import { T } from '@/lib/tokens';
import { SCNav } from '@/components/ui';
import { supabase } from '@/lib/supabase';

const SCHOOLOS_URL = process.env.NEXT_PUBLIC_SCHOOLOS_URL ?? 'https://schoolos.ng';
const FOREST = '#1A3D2C';
const GOLD   = '#B87D20';
const CREAM  = '#FAF7F0';

async function getFoundingSlots(): Promise<{ remaining: number } | null> {
  try {
    const { count } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('is_founding_school', true);
    return { remaining: Math.max(0, 20 - (count ?? 0)) };
  } catch {
    return null;
  }
}

async function getSchoolCount(): Promise<number> {
  try {
    const { count } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');
    return count ?? 0;
  } catch {
    return 0;
  }
}

const FEATURES: [string, string, string][] = [
  ['🌐', 'Public school profile', 'A verified listing parents discover when searching SchoolCity. Photos, fees, facilities, ratings and a direct enquiry button — all managed from your school portal.'],
  ['📋', 'Student & staff records', 'Basic digital records for your students and staff, accessible to the right people in your school. The foundation every school needs to run properly.'],
  ['📢', 'School announcements', 'Broadcast updates to all parents instantly. No WhatsApp groups. School-to-parent communication, done properly.'],
  ['🏛️', 'School info management', "Keep your school's profile accurate — address, photos, description, fee ranges. What parents see on SchoolCity is always up to date."],
];

const STATIC_STATS: [string, string][] = [
  ['94%',     'PARENT SATISFACTION'],
  ['Minutes', 'TO GO LIVE'],
  ['₦0',      'TO GET STARTED'],
];

export default async function SNListSchool() {
  const [foundingSlots, schoolCount] = await Promise.all([getFoundingSlots(), getSchoolCount()]);
  const showFounding  = foundingSlots !== null && foundingSlots.remaining > 0;
  const schoolCountLabel = schoolCount > 0 ? `${schoolCount}+` : '500+';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <SCNav backLabel="← School Net" backHref="/" />

      {/* ── Hero ── */}
      <div style={{ background: FOREST, padding: '64px 40px 56px', position: 'relative', overflow: 'hidden' }}>
        {/* subtle radial glows */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(184,125,32,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 50% at 10% 80%, rgba(255,255,255,.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(250,247,240,.45)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>
            SchoolCity Listing · Completely Free
          </div>

          <h1 style={{ margin: '0 0 20px', fontFamily: "'Cormorant Garamond','Georgia',serif", lineHeight: 1.05, fontWeight: 700 }}>
            <span style={{ display: 'block', fontSize: 54, color: CREAM }}>List your school.</span>
            <span style={{ display: 'block', fontSize: 54, color: GOLD, fontStyle: 'italic' }}>Reach more parents.</span>
          </h1>

          <p style={{ margin: '0 0 28px', fontSize: 16, color: 'rgba(250,247,240,.65)', lineHeight: 1.7, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Create a free SchoolCity profile in 5 minutes. Parents searching in your area will find your school — with photos, fees, facilities and direct enquiry.
          </p>

          {showFounding && (
            <div style={{ marginBottom: 32, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(184,125,32,.18)', border: '1.5px solid rgba(184,125,32,.45)', borderRadius: 40, padding: '9px 20px' }}>
              <span style={{ fontSize: 15 }}>⭐</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: CREAM }}>
                Founding school offer — lock in ₦7,000/student/yr for 2 years
              </span>
            </div>
          )}

          <div>
            <a
              href={`${SCHOOLOS_URL}/register`}
              style={{ display: 'inline-block', background: GOLD, color: FOREST, borderRadius: 100, padding: '15px 40px', fontSize: 15.5, fontWeight: 800, textDecoration: 'none', fontFamily: T.font, letterSpacing: '-.01em' }}
            >
              List your school — free →
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${T.line}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {([[schoolCountLabel, 'SCHOOLS ON SCHOOLCITY'], ...STATIC_STATS] as [string, string][]).map(([val, lbl], i) => (
            <div
              key={lbl}
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${T.line}` : 'none',
              }}
            >
              <div style={{ fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: 34, fontWeight: 700, color: FOREST, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink3, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── What you get ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 40px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12 }}>
            What you get
          </div>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond','Georgia',serif", fontSize: 42, fontWeight: 700, lineHeight: 1.05, color: FOREST }}>
            Everything you need.<br />
            <span style={{ fontStyle: 'italic' }}>Nothing to pay.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {FEATURES.map(([emoji, title, desc]) => (
            <div key={title} style={{ background: '#fff', border: `1.5px solid ${T.cardBorder}`, borderRadius: T.cardR, padding: '24px 22px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accentLight, display: 'grid', placeItems: 'center', fontSize: 22, marginBottom: 14 }}>{emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upsell: full platform ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 40px 64px' }}>
        <div style={{ background: 'rgba(184,125,32,.06)', border: `1.5px solid rgba(184,125,32,.25)`, borderRadius: 20, padding: '32px 36px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 10 }}>
            Want the full platform?
          </div>
          <h3 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: FOREST }}>
            Start a Standard trial — free for one term.
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: T.ink2, lineHeight: 1.7 }}>
            Full operational tools: results, fee collection, GPS, parent app, CBT. Up to 50 students.<br />
            After the trial, your school drops back to Free — listing stays live, records preserved. No data lost.
          </p>
          <a
            href={`${SCHOOLOS_URL}/register`}
            style={{ display: 'inline-block', background: FOREST, color: CREAM, borderRadius: 10, padding: '13px 28px', fontSize: 14.5, fontWeight: 800, textDecoration: 'none', fontFamily: T.font }}
          >
            Get started →
          </a>
        </div>
      </div>
    </div>
  );
}
