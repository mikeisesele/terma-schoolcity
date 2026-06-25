import type { Metadata } from 'next';
import { getSchool, SCHOOLS, naira } from '@/lib/data';

export function generateStaticParams() {
  return SCHOOLS.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const s = getSchool(params.id);
  if (!s) return { title: 'School not found' };
  return {
    title: `${s.name} | School Net`,
    description: `${s.name} — ${s.tagline}. ${s.type} school in ${s.city}. Verified on School Net. Fees from ${naira(s.feeFrom)}/term.`,
    openGraph: {
      title: s.name,
      description: `${s.tagline} · ${s.city}`,
    },
  };
}
