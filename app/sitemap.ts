import type { MetadataRoute } from 'next';
import { SCHOOLS } from '@/lib/data';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schoolnet.kidtrack.ng';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/vacancies`, changeFrequency: 'daily', priority: 0.8 },
    ...SCHOOLS.map((s) => ({ url: `${SITE}/schools/${s.id}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
}
