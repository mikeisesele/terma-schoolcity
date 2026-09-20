import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  state: { school: null as Record<string, unknown> | null, loading: false, notFound: false },
  insert: vi.fn(),
  push: vi.fn(),
}));

vi.mock('next/dynamic', () => ({ default: () => () => <div>School map</div> }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }), useParams: () => ({ id: 'greenfield-academy' }) }));
vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }),
}));
vi.mock('@/components/ui', () => ({
  SCNav: ({ rightSlot }: { rightSlot: React.ReactNode }) => <nav>{rightSlot}</nav>,
  Stars: () => <span>stars</span>,
}));
vi.mock('@/lib/useSchool', () => ({ useSchool: () => mocks.state }));
vi.mock('@/lib/useReviews', () => ({ useReviews: () => ({ reviews: [] }) }));
vi.mock('@/lib/useSchoolPhotos', () => ({ useSchoolPhotos: () => ({ byCategory: {} }) }));
vi.mock('@/lib/useSchoolAchievements', () => ({ useSchoolAchievements: () => ({ achievements: [] }) }));
vi.mock('@/lib/useVacancies', () => ({ useSchoolVacancies: () => ({ vacancies: [] }) }));
vi.mock('@/lib/supabase', () => ({ supabase: { from: () => ({ insert: mocks.insert }) } }));

import { SchoolDetailClient } from '@/app/schools/[id]/_SchoolDetailClient';

const greenfield = {
  id: 'school-1', slug: 'greenfield-academy', name: 'Greenfield Academy', city: 'Abuja', state: 'FCT',
  type: 'Day', gender: 'Mixed', levels: 'Nursery,Primary,JSS,SSS', orientation: 'Christian', transport: true,
  boarding: false, rating: 4.8, reviews: 10, verified: true, feeFrom: 100_000, feeTo: 300_000,
  color: '#1A3D2C', tagline: 'Every child matters', features: ['Library'], scholarships: 1, vacancies: 0,
  students: '500', established: 2001, address: 'Central Area', phone: '08000000000', email: 'hello@greenfield.test',
};

const storage = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  clear: () => storage.clear(),
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
} });

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mocks.state = { school: greenfield, loading: false, notFound: false };
  mocks.insert.mockResolvedValue({ error: null });
});

describe('SchoolCity school details', () => {
  it('renders explicit loading and missing states', () => {
    mocks.state = { school: null, loading: true, notFound: false };
    const { rerender } = render(<SchoolDetailClient />);
    expect(screen.getByText('Loading…')).toBeTruthy();
    mocks.state = { school: null, loading: false, notFound: true };
    rerender(<SchoolDetailClient />);
    expect(screen.getByText('School not found.')).toBeTruthy();
  });

  it('saves the school to the current device', () => {
    render(<SchoolDetailClient />);
    fireEvent.click(screen.getByRole('button', { name: '♡ Save' }));
    fireEvent.click(screen.getByRole('button', { name: /Save to this device/ }));
    expect(localStorage.getItem('sc_favs')).toBe(JSON.stringify(['school-1']));
    expect(screen.getByRole('button', { name: '♥ Saved' })).toBeTruthy();
  });

  it('submits a normalized enquiry and confirms delivery', async () => {
    render(<SchoolDetailClient />);
    fireEvent.click(screen.getByRole('button', { name: 'Enquire now' }));
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0]!, { target: { value: 'Ada Parent' } });
    fireEvent.change(inputs[1]!, { target: { value: '08012345678' } });
    fireEvent.change(inputs[2]!, { target: { value: 'ada@test.dev' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Send enquiry/ }).at(-1)!);
    expect(await screen.findByText('Enquiry sent!')).toBeTruthy();
    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
      school_id: 'school-1', parent_name: 'Ada Parent', phone: '08012345678', email: 'ada@test.dev', source: 'schoolcity',
    }));
  });

  it('does not show success when enquiry persistence fails', async () => {
    mocks.insert.mockResolvedValue({ error: new Error('offline') });
    render(<SchoolDetailClient />);
    fireEvent.click(screen.getByRole('button', { name: 'Enquire now' }));
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0]!, { target: { value: 'Ada Parent' } });
    fireEvent.change(inputs[1]!, { target: { value: '08012345678' } });
    fireEvent.change(inputs[2]!, { target: { value: 'ada@test.dev' } });
    fireEvent.click(screen.getAllByRole('button', { name: /Send enquiry/ }).at(-1)!);
    await waitFor(() => expect(mocks.insert).toHaveBeenCalled());
    expect(screen.queryByText('Enquiry sent!')).toBeNull();
  });
});
