import { T } from '@/lib/tokens';
import { SCNav } from '@/components/ui';
import { supabase } from '@/lib/supabase';

const SCHOOLOS_URL = process.env.NEXT_PUBLIC_SCHOOLOS_URL ?? 'https://schoolos.ng';

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

export default async function SNListSchool() {
  const foundingSlots = await getFoundingSlots();

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <SCNav backLabel="← Back to SchoolCity" backHref="/" />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${T.accent},${T.accent}ee)`, padding: '48px 40px 44px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.accentText + '60', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12 }}>
            SchoolCity listing is a SchoolOS benefit
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 900, color: T.accentText, lineHeight: 1.1 }}>
            Run your school on SchoolOS.<br />Get discovered on SchoolCity.
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 15, color: T.accentText + '78', lineHeight: 1.7 }}>
            SchoolCity listings are a benefit included with SchoolOS Standard and Pro plans. Set up your school on SchoolOS and your listing goes live automatically.
          </p>
          {foundingSlots !== null && foundingSlots.remaining > 0 && (
            <div style={{ marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(184,125,32,0.18)', border: '1.5px solid rgba(184,125,32,0.4)', borderRadius: 40, padding: '8px 18px' }}>
              <span style={{ fontSize: 15 }}>⭐</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.accentText }}>
                Founding school: {foundingSlots.remaining} of 20 slots remaining — lock in ₦7,000/student/yr for 2 years
              </span>
            </div>
          )}
          <a
            href={`${SCHOOLOS_URL}/register`}
            style={{ display: 'inline-block', background: '#FAF7F0', color: T.accent, borderRadius: T.btnR, padding: '14px 36px', fontSize: 15, fontWeight: 800, textDecoration: 'none', fontFamily: T.font }}
          >
            Register your school on SchoolOS →
          </a>
        </div>
      </div>

      {/* Feature explainers */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 60px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {([
          ['📋', 'SchoolCity public profile', 'A verified listing parents find when searching — photos, fees, facilities, ratings and direct enquiry.'],
          ['💳', 'Digital fee collection', 'Parents pay by card or bank transfer through Paystack. Automated receipts, overdue reminders, installment plans.'],
          ['📊', 'Results & report cards', '4-step approval chain: Subject Teacher → Class Teacher → Head → Admin. Digital report cards published instantly.'],
          ['🚌', 'Live bus tracking', 'GPS every 5 seconds during trips. 4-digit pickup codes. Real-time ETA notifications for every parent.'],
          ['👨‍👩‍👧', 'Parent app (free)', 'Every parent gets live tracking, instant results, fee payments and announcements on their phone. No app store sign-up.'],
          ['🏆', 'SchoolOS Verified badge', 'Displayed on your SchoolCity listing. A trust signal parents in Nigeria recognise when comparing schools.'],
        ] as [string, string, string][]).map(([e, t, d]) => (
          <div key={t} style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '20px 18px' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{e}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
