import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Result = { data: unknown; error: { message: string } | null; count?: number };
const tableResults = new Map<string, Result>();

function chainFor(table: string) {
  const chain: Record<string, unknown> = {};
  for (const method of ['select', 'eq', 'gt', 'order']) chain[method] = vi.fn(() => chain);
  chain.then = (resolve: (value: Result) => unknown) => resolve(tableResults.get(table) ?? { data: [], error: null });
  return chain;
}

vi.mock('@/lib/supabase', () => ({
  supabase: { from: vi.fn((table: string) => chainFor(table)) },
}));

import { useSchools } from '@/lib/useSchools';
import { useVacancies } from '@/lib/useVacancies';

function SchoolsProbe() {
  const state = useSchools();
  if (state.loading) return <div>Loading schools</div>;
  if (state.error) return <div>Schools error: {state.error}</div>;
  return <div>{state.schools.map(school => `${school.name}:${school.schoolcityTier ?? 'none'}`).join('|') || 'No schools'}</div>;
}

function VacanciesProbe() {
  const state = useVacancies();
  if (state.loading) return <div>Loading vacancies</div>;
  if (state.error) return <div>Vacancies error: {state.error}</div>;
  return <div>{state.vacancies.map(vacancy => `${vacancy.title}:${vacancy.sName}`).join('|') || 'No vacancies'}</div>;
}

afterEach(cleanup);
beforeEach(() => tableResults.clear());

describe('SchoolCity data hooks', () => {
  it('maps active schools and chooses the strongest paid visibility placement', async () => {
    tableResults.set('schools', { data: [{
      id: 'school-1', name: 'Greenfield Academy', city: 'Abuja', state: 'FCT', plan: 'standard', status: 'active',
      features: ['Library'], fees_from_kobo: 100_000, fees_to_kobo: 300_000, review_count: 4, rating: 4.8,
    }], error: null });
    tableResults.set('schoolcity_visibility_orders', { data: [
      { school_id: 'school-1', tier: 'rated', visibility_scope: 'city', expires_at: '2099-01-01T00:00:00Z' },
      { school_id: 'school-1', tier: 'spotlight', visibility_scope: 'national', expires_at: '2099-01-01T00:00:00Z' },
    ], error: null });
    render(<SchoolsProbe />);
    expect(screen.getByText('Loading schools')).toBeTruthy();
    expect(await screen.findByText('Greenfield Academy:spotlight')).toBeTruthy();
  });

  it('surfaces school-directory failures instead of showing a false empty state', async () => {
    tableResults.set('schools', { data: null, error: { message: 'directory unavailable' } });
    tableResults.set('schoolcity_visibility_orders', { data: [], error: null });
    render(<SchoolsProbe />);
    expect(await screen.findByText('Schools error: directory unavailable')).toBeTruthy();
  });

  it('maps published vacancy payloads into the public model', async () => {
    tableResults.set('public_vacancies', { data: [{
      id: 'vacancy-1', school_id: 'school-1', school_name: 'Greenfield Academy', title: 'Mathematics Teacher',
      department: 'Mathematics', type: 'Full-time', published_at: '2026-09-20', perks: ['Housing'], trcn_required: true,
    }], error: null });
    render(<VacanciesProbe />);
    await waitFor(() => expect(screen.getByText('Mathematics Teacher:Greenfield Academy')).toBeTruthy());
  });

  it('surfaces vacancy loading failures', async () => {
    tableResults.set('public_vacancies', { data: null, error: { message: 'vacancies unavailable' } });
    render(<VacanciesProbe />);
    expect(await screen.findByText('Vacancies error: vacancies unavailable')).toBeTruthy();
  });
});
