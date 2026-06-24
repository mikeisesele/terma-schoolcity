import type { Metadata } from 'next';
import Link from 'next/link';
import { SNNav, SHead } from '@/components/ui';
import { SCHOOLS } from '@/lib/data';
import { SN } from '@/lib/tokens';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Find a vacancy', description: 'Teaching and school jobs across verified Nigerian private schools.' };

export default function Vacancies() {
  const jobs = SCHOOLS.flatMap((s) => s.vacancies.map((v) => ({ ...v, school: s.name, schoolId: s.id, location: s.location })));
  return (
    <>
      <SNNav />
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '56px 24px 80px' }}>
        <SHead eyebrow="Careers" title="Find a vacancy" sub={`${jobs.length} open roles · sign in with Google to apply`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map((j, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: SN.cardR, border: `1px solid ${SN.line}`, boxShadow: SN.shadow, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: SN.ink }}>{j.title}</div>
                <div style={{ fontSize: 13.5, color: SN.ink3, fontWeight: 600 }}>{j.dept} · {j.school} · {j.location}</div>
              </div>
              <Link href={`/schools/${j.schoolId}`} style={{ fontSize: 13.5, fontWeight: 700, color: SN.accent }}>View school →</Link>
              <button style={{ background: SN.accent, color: '#fff', border: 'none', borderRadius: SN.pill, padding: '10px 18px', fontWeight: 700, fontSize: 13.5, fontFamily: SN.font, cursor: 'pointer' }}>Apply</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
