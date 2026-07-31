import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase-server';
import { SchoolDetailClient } from './_SchoolDetailClient';

type Props = { params: { id: string } };

// ── Server-side school fetch (shared by generateMetadata and the page) ──────
async function fetchSchoolSeo(id: string) {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from('schools')
      .select('id, name, city, state, type, gender, levels, fees_from_kobo, fees_to_kobo, rating, review_count, image_url, motto')
      .eq('id', id)
      .maybeSingle();
    return data as {
      id: string;
      name: string;
      city: string;
      state: string;
      type: string;
      gender: string;
      levels: string;
      fees_from_kobo: number | null;
      fees_to_kobo: number | null;
      rating: number | null;
      review_count: number | null;
      image_url: string | null;
      motto: string | null;
    } | null;
  } catch {
    return null;
  }
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = await fetchSchoolSeo(params.id);

  if (!school) {
    return { title: 'School Not Found | SchoolCity' };
  }

  const feesFrom = typeof school.fees_from_kobo === 'number' ? school.fees_from_kobo : 0;
  const feesTo   = typeof school.fees_to_kobo   === 'number' ? school.fees_to_kobo   : 0;

  const feesStr = feesFrom > 0
    ? ` Fees from ₦${Math.round(feesFrom / 100).toLocaleString()}.`
    : feesTo > 0
    ? ` Fees up to ₦${Math.round(feesTo / 100).toLocaleString()}.`
    : '';

  const title       = `${school.name} | ${school.city} Private School — SchoolCity`;
  const description = `${school.name} is a private ${school.levels} school in ${school.city}, ${school.state}.${feesStr} Find reviews, fees, facilities and contact details.`;

  return {
    title,
    description,
    alternates: { canonical: `https://schools.terma.ng/schools/${params.id}` },
    openGraph: {
      title,
      description,
      ...(school.image_url ? { images: [{ url: school.image_url }] } : {}),
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function SCDetailPage({ params }: Props) {
  const school = await fetchSchoolSeo(params.id);

  const jsonLd = school
    ? {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: school.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: school.city,
          addressRegion: school.state,
          addressCountry: 'NG',
        },
        url: `https://schools.terma.ng/schools/${params.id}`,
        ...(typeof school.rating === 'number' &&
          school.rating > 0 &&
          typeof school.review_count === 'number' &&
          school.review_count > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: school.rating,
                reviewCount: school.review_count,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
        <SchoolDetailClient />
      </Suspense>
    </>
  );
}
