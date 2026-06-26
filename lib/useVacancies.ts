/**
 * useVacancies — fetches open vacancies from Supabase.
 * Falls back to SN_VACANCIES static data if the query returns empty (dev without seed).
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SN_VACANCIES } from '@/lib/data';
import type { Vacancy } from '@/lib/data';

export type UseVacanciesResult = {
  vacancies: Vacancy[];
  loading: boolean;
  error: string | null;
  isLive: boolean;
};

export function useVacancies(): UseVacanciesResult {
  const [vacancies, setVacancies] = useState<Vacancy[]>(SN_VACANCIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('vacancies')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
        // keep static fallback
      } else if (data && data.length > 0) {
        // Map DB rows to the local Vacancy shape.
        // DB columns: id, school_id, school_name, school_colour, city, state,
        //   title, department, employment_type, deadline, summary, apply_email
        // Adjust the mapping below once the exact DB schema is confirmed.
        const mapped: Vacancy[] = (data as Record<string, string>[]).map(row => ({
          id: row.id,
          sId: row.school_id ?? '',
          sName: row.school_name ?? '',
          sColor: row.school_colour ?? '#1A3D2C',
          city: row.city ?? '',
          state: row.state ?? '',
          title: row.title ?? '',
          dept: row.department ?? '',
          type: row.employment_type ?? 'Full-time',
          deadline: row.deadline ?? '',
          summary: row.summary ?? '',
          applyEmail: row.apply_email ?? '',
        }));
        setVacancies(mapped);
        setIsLive(true);
      }
      // If data is empty, keep the static SN_VACANCIES fallback (dev without seed)

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { vacancies, loading, error, isLive };
}
