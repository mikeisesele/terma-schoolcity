import { createServerClient } from '@/lib/supabase-server';
import { HomeClient } from './_HomeClient';

interface PlanPriceRow {
  plan: string;
  per_student_kobo: number;
}

async function getPlanPrices(): Promise<{ standard: string; pro: string }> {
  const fallback = { standard: '₦10k/student/yr', pro: '₦20k/student/yr' };
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('plan_pricing')
      .select('plan, per_student_kobo')
      .in('plan', ['standard', 'pro']);
    if (error || !data) return fallback;

    const format = (kobo: number) =>
      `₦${(kobo / 100_000).toFixed(0)}k/student/yr`;

    const result = { ...fallback };
    for (const row of data as PlanPriceRow[]) {
      if (row.plan === 'standard') result.standard = format(row.per_student_kobo);
      if (row.plan === 'pro')      result.pro      = format(row.per_student_kobo);
    }
    return result;
  } catch {
    return fallback;
  }
}

export default async function SNHome() {
  const prices = await getPlanPrices();
  return <HomeClient standardPrice={prices.standard} proPrice={prices.pro} />;
}
