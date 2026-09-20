import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ insert: vi.fn(), push: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('@/components/ui', () => ({ SCNav: () => <nav>SchoolCity</nav> }));
vi.mock('@/lib/supabase', () => ({
  supabase: { from: vi.fn(() => ({ insert: mocks.insert })) },
}));

import SNPostVacancy from '@/app/vacancies/post/page';

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.insert.mockResolvedValue({ error: null });
});

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText('e.g. Greenfield International School'), { target: { value: 'Greenfield Academy' } });
  fireEvent.change(screen.getByPlaceholderText('hr@school.edu.ng'), { target: { value: 'hr@greenfield.test' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. Mathematics Teacher (SSS)'), { target: { value: 'Mathematics Teacher' } });
}

function fillOptionalFields() {
  const selects = screen.getAllByRole('combobox');
  fireEvent.change(selects[0]!, { target: { value: 'Primary – Academic' } });
  fireEvent.change(selects[1]!, { target: { value: 'Part-time' } });
  fireEvent.change(document.querySelector('input[type="date"]')!, { target: { value: '2026-10-31' } });
  fireEvent.change(screen.getByPlaceholderText(/Key responsibilities/), { target: { value: 'Teach mathematics.' } });
  fireEvent.change(screen.getByPlaceholderText(/TRCN registered/), { target: { value: 'B.Ed required.' } });
}

describe('vacancy posting workflow', () => {
  it('does not submit incomplete vacancy data', () => {
    render(<SNPostVacancy />);
    fireEvent.click(screen.getByRole('button', { name: /Post vacancy/i }));
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it('submits normalized vacancy data and renders confirmation', async () => {
    render(<SNPostVacancy />);
    fillRequiredFields();
    fillOptionalFields();
    fireEvent.click(screen.getByRole('button', { name: /Post vacancy/i }));
    await waitFor(() => expect(screen.getByText('Vacancy posted!')).toBeTruthy());
    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
      school_name: 'Greenfield Academy',
      contact_email: 'hr@greenfield.test',
      title: 'Mathematics Teacher',
      department: 'Primary – Academic',
      employment_type: 'Part-time',
      deadline: '2026-10-31',
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Back to SchoolCity' }));
    expect(mocks.push).toHaveBeenCalledWith('/');
  });

  it('shows a retryable error instead of a false success when persistence fails', async () => {
    mocks.insert.mockResolvedValue({ error: new Error('database unavailable') });
    render(<SNPostVacancy />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /Post vacancy/i }));
    expect((await screen.findByRole('alert')).textContent).toContain('could not submit');
    expect(screen.queryByText('Vacancy posted!')).toBeNull();
    expect(screen.getByRole('button', { name: /Post vacancy/i })).toBeTruthy();
  });
});
