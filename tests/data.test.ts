import { afterEach, describe, expect, it } from 'vitest';
import {
  deriveFacilityImages,
  FI,
  publicPlanLabel,
  schoolHeroFallbackUrl,
  schoolHeroImageUrl,
  shouldUseSchoolCityDemoImages,
  toSlug,
} from '@/lib/data';

const originalVisibility = process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY;

afterEach(() => {
  if (originalVisibility === undefined) delete process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY;
  else process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY = originalVisibility;
});

describe('public school normalization', () => {
  it.each(['trial', 'standard', 'starter', 'premium', 'pro', 'custom'])('normalizes %s', plan => {
    expect(publicPlanLabel(plan)).toBe('Standard');
  });

  it.each([undefined, null, 'free', 'enterprise'])('rejects non-public plan %s', plan => {
    expect(publicPlanLabel(plan)).toBeUndefined();
  });

  it('creates stable URL-safe slugs', () => {
    expect(toSlug("  King's College, Lagos!  ")).toBe('kings-college-lagos');
    expect(toSlug('A---B')).toBe('a-b');
  });
});

describe('school hero image policy', () => {
  const school = { id: 'school-1', name: 'Example Academy', bannerUrl: 'https://cdn.test/banner.jpg' };

  it('uses demo images only when explicitly enabled outside local development', () => {
    delete process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY;
    expect(shouldUseSchoolCityDemoImages()).toBe(false);
    process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY = 'true';
    expect(shouldUseSchoolCityDemoImages()).toBe(true);
  });

  it('prefers an owned banner and falls back only after failure in demo mode', () => {
    process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY = 'true';
    expect(schoolHeroImageUrl(school)).toBe(school.bannerUrl);
    expect(schoolHeroImageUrl(school, [school.bannerUrl])).toMatch(/^\/schools\/banner/);
    process.env.NEXT_PUBLIC_SCHOOLCITY_STAGING_VISIBILITY = 'false';
    expect(schoolHeroImageUrl(school, [school.bannerUrl])).toBeUndefined();
  });

  it('keeps the Greenfield fixture stable and hashes other schools deterministically', () => {
    expect(schoolHeroFallbackUrl({ id: 'g', name: 'Greenfield School' })).toBe('/schools/banner23.jpg');
    const first = schoolHeroFallbackUrl({ id: 'x', name: 'Other School' });
    expect(first).toBe(schoolHeroFallbackUrl({ id: 'x', name: 'Other School' }));
  });
});

describe('facility image derivation', () => {
  it('maps every supported facility family and ignores unknown labels', () => {
    const mapped = deriveFacilityImages([
      'Science laboratory', 'Computer laboratory', 'Library', 'Sports field',
      'Transport fleet', 'Swimming pool', 'Boarding hostel', 'Music room',
      'Nursery playground', 'School chapel', 'Cafeteria dining', 'ICT suite',
      'Medical sick bay', 'Art drama studio', 'Assembly hall', 'Security post', 'Other',
    ]);
    expect(mapped['Science laboratory']).toBe(FI.scienceLab);
    expect(mapped['Computer laboratory']).toBe(FI.computerLab);
    expect(mapped.Library).toBe(FI.library);
    expect(mapped['Sports field']).toBe(FI.sports);
    expect(mapped['Transport fleet']).toBe(FI.transport);
    expect(mapped['Swimming pool']).toBe(FI.swimming);
    expect(mapped['Boarding hostel']).toBe(FI.hostel);
    expect(mapped['Music room']).toBe(FI.music);
    expect(mapped['Nursery playground']).toBe(FI.nursery);
    expect(mapped['School chapel']).toBe(FI.religion);
    expect(mapped['Cafeteria dining']).toBe(FI.life);
    expect(mapped['ICT suite']).toBe(FI.ict);
    expect(mapped['Medical sick bay']).toBe(FI.academic);
    expect(mapped['Art drama studio']).toBe(FI.cultural);
    expect(mapped['Assembly hall']).toBe(FI.academic);
    expect(mapped['Security post']).toBe(FI.academic);
    expect(mapped.Other).toBeUndefined();
  });
});
