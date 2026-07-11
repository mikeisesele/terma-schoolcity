/**
 * useVacancies — fetches published vacancies from the public_vacancies view.
 * Pure DB mode: no static fallback. Returns empty array while loading.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Vacancy } from '@/lib/data';

export type UseVacanciesResult = {
  vacancies: Vacancy[];
  loading: boolean;
  error: string | null;
};

export function useVacancies(): UseVacanciesResult {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('public_vacancies')
        .select('*')
        .order('published_at', { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        const mapped: Vacancy[] = (data as Record<string, unknown>[] ?? []).map(row => ({
          id:                  String(row.id ?? ''),
          sId:                 String(row.school_id ?? ''),
          sName:               String(row.school_name ?? ''),
          sColor:              String(row.school_colour ?? '#1A3D2C'),
          city:                String(row.city ?? ''),
          state:               String(row.state ?? ''),
          title:               String(row.title ?? ''),
          dept:                String(row.department ?? ''),
          type:                String(row.type ?? 'Full-time'),
          deadline:            row.deadline != null ? String(row.deadline) : '',
          summary:             String(row.summary ?? row.role_overview ?? ''),
          applyEmail:          String(row.apply_email ?? ''),
          isSpecial:           Boolean(row.school_is_special),
          roleOverview:        row.role_overview != null ? String(row.role_overview) : null,
          keyResponsibilities: row.key_responsibilities != null ? String(row.key_responsibilities) : null,
          requirements:        row.requirements != null ? String(row.requirements) : null,
          perks:               Array.isArray(row.perks) ? (row.perks as string[]) : [],
          salaryRange:         row.salary_range != null ? String(row.salary_range) : null,
          minQualification:    row.min_qualification != null ? String(row.min_qualification) : null,
          experienceLevel:     row.experience_level != null ? String(row.experience_level) : null,
          location:            row.location != null ? String(row.location) : null,
          trcnRequired:        Boolean(row.trcn_required),
          applyInstructions:   row.apply_instructions != null ? String(row.apply_instructions) : null,
        }));
        setVacancies(mapped);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { vacancies, loading, error };
}

export type SchoolVacancy = {
  id: string; title: string; department: string; type: string;
  deadline: string | null; summary: string | null;
  role_overview: string | null; key_responsibilities: string | null;
  requirements: string | null; salary_range: string | null;
  min_qualification: string | null; experience_level: string | null;
  location: string | null; trcn_required: boolean;
  apply_email: string; apply_instructions: string | null; perks: string[];
};

export function useSchoolVacancies(schoolId: string | null): { vacancies: SchoolVacancy[]; loading: boolean } {
  const [vacancies, setVacancies] = useState<SchoolVacancy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    let cancelled = false;
    setLoading(true);
    supabase
      .from('school_vacancies')
      .select('id,title,department,type,deadline,summary,role_overview,key_responsibilities,requirements,salary_range,min_qualification,experience_level,location,trcn_required,apply_email,apply_instructions,perks')
      .eq('school_id', schoolId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) {
          setVacancies((data ?? []) as unknown as SchoolVacancy[]);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [schoolId]);

  return { vacancies, loading };
}
