import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { FindPageClient } from './_FindClient';

export const metadata: Metadata = {
  title: 'Search Schools in Nigeria — Filter by City, Fees & Type | SchoolCity',
  description: 'Search verified Nigerian private schools by city (Lagos, Abuja, Port Harcourt), fee range, school type (Nursery, Primary, Secondary) and facilities. Compare and contact schools directly.',
  keywords: ['schools in Lagos', 'schools in Abuja', 'private schools Nigeria', 'school search Nigeria', 'secondary schools Port Harcourt', 'affordable private schools'],
  alternates: { canonical: 'https://schools.terma.ng/find' },
};

async function getActiveSchoolCount(): Promise<number | null> {
  try {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');
    if (error) return null;
    return count;
  } catch {
    return null;
  }
}

export default async function SNFindSchool() {
  const count = await getActiveSchoolCount();
  // Build the full phrase so the client component just renders it verbatim.
  const schoolCountLabel =
    count !== null
      ? `${count.toLocaleString()} verified schools`
      : 'all verified schools';

  return <FindPageClient schoolCountLabel={schoolCountLabel} />;
}
