import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ exchange: vi.fn() }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: { exchangeCodeForSession: mocks.exchange } })),
}));

import { GET } from '@/app/auth/callback/route';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.exchange.mockResolvedValue({ error: null });
});

describe('SchoolCity OAuth callback', () => {
  it('exchanges an authorization code and keeps relative redirects on origin', async () => {
    const result = await GET(new Request('https://schools.test/auth/callback?code=oauth-code&next=%2Ffavourites') as never);
    expect(mocks.exchange).toHaveBeenCalledWith('oauth-code');
    expect(result.headers.get('location')).toBe('https://schools.test/favourites');
  });

  it('rejects external and protocol-relative redirect targets', async () => {
    let result = await GET(new Request('https://schools.test/auth/callback?next=https%3A%2F%2Fevil.test') as never);
    expect(result.headers.get('location')).toBe('https://schools.test/');
    result = await GET(new Request('https://schools.test/auth/callback?next=%2F%2Fevil.test') as never);
    expect(result.headers.get('location')).toBe('https://schools.test/');
    expect(mocks.exchange).not.toHaveBeenCalled();
  });

  it('returns to the origin with a normalized auth error when exchange fails', async () => {
    mocks.exchange.mockResolvedValue({ error: { message: 'invalid code' } });
    const result = await GET(new Request('https://schools.test/auth/callback?code=bad') as never);
    expect(result.headers.get('location')).toBe('https://schools.test/?auth_error=invalid%20code');
  });
});
