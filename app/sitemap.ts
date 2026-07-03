import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schoolcity.schoolos.ng';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data } = await supabase
    .from('schools')
    .select('id')
    .eq('status', 'active');

  const schoolUrls = (data ?? []).map(s => ({
    url: `${SITE}/schools/${s.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: SITE,                  changeFrequency: 'daily',  priority: 1   },
    { url: `${SITE}/find`,        changeFrequency: 'daily',  priority: 0.9 },
    { url: `${SITE}/vacancies`,   changeFrequency: 'daily',  priority: 0.8 },
    ...schoolUrls,
  ];
}
