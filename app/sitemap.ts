import type { MetadataRoute } from 'next';
import { SN_SCHOOLS } from '@/lib/data';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schoolnet.kidtrack.ng';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/find`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/vacancies`, changeFrequency: 'daily', priority: 0.8 },
    ...SN_SCHOOLS.map((s) => ({ url: `${SITE}/schools/${s.id}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
}
