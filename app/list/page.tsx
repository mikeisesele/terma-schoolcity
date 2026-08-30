import { T } from '@/lib/tokens';
import { SCNav } from '@/components/ui';
import { createServerClient } from '@/lib/supabase-server';

const SCHOOLOS_URL = process.env.NODE_ENV === 'production'
  ? 'https://app.terma.ng'
  : (process.env.NEXT_PUBLIC_SCHOOLOS_URL ?? 'https://app.terma.ng');
const FOREST = '#1A3D2C';
const GOLD   = '#B87D20';
const CREAM  = '#FAF7F0';
async function getSchoolCount(): Promise<number> {
  try {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

const FEATURES: [string, string, string][] = [
  ['🏫', 'Your school, ready to run', 'Set up students, staff, core school information and the access each person needs from one secure operating system.'],
  ['📊', 'Results parents can understand', 'CBT scores, assessment results and report cards move through one workflow and reach families when the school releases them.'],
  ['📢', 'Communication without the noise', 'Announcements, calendar updates and direct parent communication live in one place instead of scattered group chats.'],
  ['🌐', 'A verified SchoolCity profile', 'Schools appear on SchoolCity after onboarding, with a complete profile families can trust and use to make an enquiry.'],
];

const STATIC_STATS: [string, string][] = [
  ['One', 'SCHOOL SYSTEM'],
  ['Parents', 'KEPT INFORMED'],
  ['Verified', 'SCHOOLCITY PROFILE'],
];

export default async function SNListSchool() {
  const schoolCount = await getSchoolCount();
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
            For schools ready to run better
          </div>

          <h1 style={{ margin: '0 0 20px', fontFamily: "'Cormorant Garamond','Georgia',serif", lineHeight: 1.05, fontWeight: 700 }}>
            <span style={{ display: 'block', fontSize: 54, color: CREAM }}>Bring Terma to</span>
            <span style={{ display: 'block', fontSize: 54, color: GOLD, fontStyle: 'italic' }}>your school.</span>
          </h1>

          <p style={{ margin: '0 0 28px', fontSize: 16, color: 'rgba(250,247,240,.65)', lineHeight: 1.7, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            One school operating system for your staff, students and parents. Set up your school with Terma, then publish a verified SchoolCity profile that families can discover with confidence.
          </p>

          <div>
            <a
              href={`${SCHOOLOS_URL}/register`}
              style={{ display: 'inline-block', background: GOLD, color: FOREST, borderRadius: 100, padding: '15px 40px', fontSize: 15.5, fontWeight: 800, textDecoration: 'none', fontFamily: T.font, letterSpacing: '-.01em' }}
            >
              Get started with Terma →
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
            One system for the work<br />
            <span style={{ fontStyle: 'italic' }}>that matters every day.</span>
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

      <div style={{ height: 64 }} />
    </div>
  );
}
