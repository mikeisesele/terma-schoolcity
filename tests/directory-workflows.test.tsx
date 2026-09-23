import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  search: new URLSearchParams(),
  schools: [] as Array<Record<string, unknown>>,
  session: null as unknown,
  authChange: null as ((event: string, session: unknown) => void) | null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mocks.back, push: mocks.push, replace: mocks.replace }),
  useSearchParams: () => mocks.search,
}));
vi.mock('@/lib/useSchools', () => ({ useSchools: () => ({ schools: mocks.schools, loading: false, error: null }) }));
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: mocks.session } })),
      getUser: vi.fn(async () => ({ data: { user: (mocks.session as { user?: unknown } | null)?.user ?? null } })),
      onAuthStateChange: vi.fn((_callback: (event: string, session: unknown) => void) => {
        mocks.authChange = _callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signOut: vi.fn(async () => ({ error: null })),
    },
  },
}));
vi.mock('@/lib/savedSchools', () => ({
  loadSavedSchoolIds: vi.fn(async () => ['school-1']),
  setSavedSchool: vi.fn(async () => undefined),
}));
vi.mock('react-hot-toast', () => ({ default: vi.fn() }));
vi.mock('@/components/ui', () => ({
  ExtrasNav: () => <nav>SchoolCity</nav>,
  SCNav: () => <nav>SchoolCity</nav>,
  SCAuthModal: ({ onSuccess }: { onSuccess: (account: Record<string, string>) => void }) => (
    <button onClick={() => onSuccess({ name: 'Ada Parent', email: 'ada@test.dev', avatar: '', color: '#000' })}>Complete sign in</button>
  ),
  SCCard: ({ school, onSelect, onToggleFav, onToggleCompare }: {
    school: { id: string; name: string };
    onSelect: (school: unknown) => void;
    onToggleFav: (id: string) => void;
    onToggleCompare: (id: string) => void;
  }) => (
    <article>
      <span>{school.name}</span>
      <button onClick={() => onSelect(school)}>Open {school.name}</button>
      <button onClick={() => onToggleFav(school.id)}>Save {school.name}</button>
      <button onClick={() => onToggleCompare(school.id)}>Compare {school.name}</button>
    </article>
  ),
  SCCompareBar: ({ onOpen, onClear }: { onOpen: () => void; onClear: () => void }) => (
    <div><button onClick={onOpen}>Open comparison</button><button onClick={onClear}>Clear comparison</button></div>
  ),
  SCCompareModal: ({ compareIds, allSchools, onRemove, onSelect, onClose }: {
    compareIds: string[];
    allSchools: Array<{ id: string; name: string }>;
    onRemove: (id: string) => void;
    onSelect: (school: unknown) => void;
    onClose: () => void;
  }) => <section aria-label="comparison">
    <span>{compareIds.join(',') || 'empty comparison'}</span>
    {allSchools.filter(school => compareIds.includes(school.id)).map(school => <div key={school.id}>
      <button onClick={() => onRemove(school.id)}>Remove {school.name}</button>
      <button onClick={() => onSelect(school)}>Select {school.name}</button>
    </div>)}
    <button onClick={onClose}>Close comparison</button>
  </section>,
}));

import ComparePage from '@/app/compare/page';
import SNFavorites from '@/app/favourites/page';
import { FindPageClient } from '@/app/find/_FindClient';

const school = (id: string, name: string, overrides: Record<string, unknown> = {}) => ({
  id, slug: name.toLowerCase().replaceAll(' ', '-'), name, city: 'Abuja', state: 'FCT', levels: 'Nursery,Primary,JSS,SSS',
  type: 'Day', gender: 'Mixed', orientation: 'Christian', transport: true, boarding: false,
  feeFrom: 100_000, feeTo: 300_000, scholarships: 1, vacancies: 1, ...overrides,
});

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
  mocks.search = new URLSearchParams();
  mocks.schools = [school('school-1', 'Greenfield Academy'), school('school-2', 'Unity College', { city: 'Lagos', gender: 'Girls' })];
});

describe('SchoolCity directory workflows', () => {
  it('restores, removes, persists, and closes a comparison', async () => {
    localStorage.setItem('sc_compare', JSON.stringify(['school-1', 'school-2']));
    render(<ComparePage />);
    expect(await screen.findByText('school-1,school-2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Greenfield Academy' }));
    expect(localStorage.getItem('sc_compare')).toBe(JSON.stringify(['school-2']));
    fireEvent.click(screen.getByRole('button', { name: 'Select Unity College' }));
    expect(mocks.push).toHaveBeenCalledWith('/schools/unity-college');
    fireEvent.click(screen.getByRole('button', { name: 'Close comparison' }));
    expect(mocks.back).toHaveBeenCalled();
  });

  it('requires authentication before displaying saved schools', async () => {
    render(<SNFavorites />);
    expect(screen.getByText('Sign in to see saved schools')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Complete sign in' }));
    expect(await screen.findByText(/Saved schools/)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('sc_user') ?? '{}').email).toBe('ada@test.dev');
  });

  it('loads saved schools and clears the complete list', async () => {
    localStorage.setItem('sc_user', JSON.stringify({ name: 'Ada Parent', email: 'ada@test.dev' }));
    localStorage.setItem('sc_favs', JSON.stringify(['school-1']));
    render(<SNFavorites />);
    expect(await screen.findByText('Greenfield Academy')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.getByText('No saved schools yet')).toBeTruthy();
    expect(localStorage.getItem('sc_favs')).toBeNull();
  });

  it('restores an authenticated Supabase session and saved schools', async () => {
    mocks.session = { user: { id: 'user-1', email: 'ada@test.dev', user_metadata: {} } };
    render(<SNFavorites />);
    expect(await screen.findByText('Greenfield Academy')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Save Greenfield Academy' }));
    mocks.authChange?.('SIGNED_OUT', null);
    mocks.session = null;
  });

  it('filters from URL state and routes filter changes back into the URL', () => {
    mocks.search = new URLSearchParams('q=greenfield&gender=Mixed');
    render(<FindPageClient schoolCountLabel="two schools" />);
    expect(screen.getByText('Greenfield Academy')).toBeTruthy();
    expect(screen.queryByText('Unity College')).toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/School name/), { target: { value: 'unity' } });
    expect(mocks.replace).toHaveBeenCalledWith('/find?q=unity&gender=Mixed', { scroll: false });
  });

  it('persists favourites and limits comparison to three schools', async () => {
    mocks.schools = [school('1', 'One'), school('2', 'Two'), school('3', 'Three'), school('4', 'Four')];
    render(<FindPageClient schoolCountLabel="four schools" />);
    fireEvent.click(screen.getByRole('button', { name: 'Save One' }));
    expect(localStorage.getItem('sc_favs')).toBe(JSON.stringify(['1']));
    for (const name of ['One', 'Two', 'Three', 'Four']) fireEvent.click(screen.getByRole('button', { name: `Compare ${name}` }));
    await waitFor(() => expect(localStorage.getItem('sc_compare')).toBe(JSON.stringify(['1', '2', '3'])));
  });
});
