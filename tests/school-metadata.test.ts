import { beforeEach, describe, expect, it, vi } from 'vitest';

const activeSchool = {
  id: 'school-1',
  name: 'ROB-008 Academy 20260920105936',
  city: 'Ikeja',
  state: 'Lagos',
  type: 'Day',
  gender: 'Mixed',
  levels: 'JSS,SSS',
  fees_from_kobo: null,
  fees_to_kobo: null,
  rating: 4.5,
  review_count: 0,
  image_url: null,
  motto: 'Every learner seen and supported',
};

const query = vi.hoisted(() => ({
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock('@/lib/supabase-server', () => ({
  createServerClient: vi.fn(async () => ({
    from: () => query,
  })),
}));

vi.mock('@/app/schools/[id]/_SchoolDetailClient', () => ({
  SchoolDetailClient: () => null,
}));

import { generateMetadata } from '@/app/schools/[id]/page';

describe('school detail metadata', () => {
  beforeEach(() => {
    query.select.mockReset();
    query.eq.mockReset();
    query.maybeSingle.mockReset();
    query.select.mockReturnValue(query);
    query.eq
      .mockReturnValueOnce(Promise.resolve({ data: [{ id: activeSchool.id, name: activeSchool.name }] }))
      .mockReturnValue(query);
    query.maybeSingle.mockResolvedValue({ data: activeSchool });
  });

  it('awaits Next route params and resolves a newly-created school slug', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'rob-008-academy-20260920105936' }),
    });

    expect(metadata.title).toContain(activeSchool.name);
    expect(metadata.title).not.toContain('School Not Found');
    expect(metadata.alternates?.canonical).toContain('/schools/rob-008-academy-20260920105936');
  });
});
