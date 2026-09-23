import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Private Schools in Nigeria | SchoolCity by Terma',
  description: 'Discover and compare verified Nigerian private schools. Search by city, fees, curriculum and facilities. Nursery, Primary, Secondary schools across Lagos, Abuja, Port Harcourt and more.',
  keywords: ['private schools Nigeria', 'find schools Lagos', 'schools in Abuja', 'best schools Nigeria', 'school fees Nigeria', 'school directory Nigeria'],
  alternates: { canonical: 'https://schools.terma.ng' },
  openGraph: {
    title: 'Find Private Schools in Nigeria',
    description: 'Discover, compare and enquire with verified Nigerian private schools on SchoolCity.',
  },
};

export default async function SNHome() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 32, background: '#FAF7F0', color: '#1A3D2C', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ maxWidth: 620, textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: '#B87D20', marginBottom: 16 }}>SchoolCity</div>
        <h1 style={{ margin: '0 0 16px', fontSize: 48, lineHeight: 1.05 }}>School discovery is opening soon.</h1>
        <p style={{ margin: '0 auto 28px', maxWidth: 500, fontSize: 17, lineHeight: 1.65, color: '#5C6B5E' }}>We are preparing a verified school directory for Nigerian families. Join the waitlist and we will let you know when access opens.</p>
        <a href="mailto:hello@terma.ng?subject=SchoolCity%20waitlist" style={{ display: 'inline-block', background: '#1A3D2C', color: '#FAF7F0', borderRadius: 10, padding: '14px 24px', fontWeight: 700, textDecoration: 'none' }}>Join the waitlist →</a>
      </section>
    </main>
  );
}
