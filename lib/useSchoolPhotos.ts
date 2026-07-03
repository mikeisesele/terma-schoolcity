/**
 * useSchoolPhotos — fetches facility photos from school_photos table, grouped by category.
 * Falls back to an empty record while loading.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type SchoolPhoto = {
  id: string;
  category: string;
  url: string;
};

export type UseSchoolPhotosResult = {
  photos: SchoolPhoto[];
  byCategory: Record<string, SchoolPhoto[]>;
  loading: boolean;
};

export function useSchoolPhotos(schoolId: string | null | undefined): UseSchoolPhotosResult {
  const [photos, setPhotos] = useState<SchoolPhoto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    let cancelled = false;
    setLoading(true);

    supabase
      .from('school_photos')
      .select('id, category, url')
      .eq('school_id', schoolId)
      .then(({ data }) => {
        if (cancelled) return;
        setPhotos(
          (data ?? []).map(p => ({
            id:       String(p.id),
            category: String(p.category),
            url:      String(p.url),
          }))
        );
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [schoolId]);

  const byCategory = photos.reduce<Record<string, SchoolPhoto[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return { photos, byCategory, loading };
}
