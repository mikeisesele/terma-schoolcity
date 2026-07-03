/**
 * useSchoolAchievements — fetches awards & recognitions from school_achievements table.
 * type CHECK in DB: 'waec' | 'award' | 'affiliation' | 'other'
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type AchievementType = 'waec' | 'award' | 'affiliation' | 'other';

export type Achievement = {
  id: string;
  type: AchievementType;
  title: string;
  description: string | null;
  issuedAt: string | null;
};

export type UseSchoolAchievementsResult = {
  achievements: Achievement[];
  loading: boolean;
};

export function useSchoolAchievements(schoolId: string | null | undefined): UseSchoolAchievementsResult {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    let cancelled = false;
    setLoading(true);

    supabase
      .from('school_achievements')
      .select('id, type, title, description, issued_at')
      .eq('school_id', schoolId)
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setAchievements(
          (data ?? []).map(a => ({
            id:          String(a.id),
            type:        (a.type as AchievementType) ?? 'other',
            title:       String(a.title),
            description: a.description != null ? String(a.description) : null,
            issuedAt:    a.issued_at != null ? String(a.issued_at) : null,
          }))
        );
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [schoolId]);

  return { achievements, loading };
}
