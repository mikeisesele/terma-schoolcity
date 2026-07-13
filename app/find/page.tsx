import { createServerClient } from '@/lib/supabase-server';
import { FindPageClient } from './_FindClient';

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
