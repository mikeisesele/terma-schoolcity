/**
 * useReviews — fetches reviews for a school from school_reviews table.
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type Review = {
  id: string;
  author: string;
  authorRole: string;
  rating: number;
  body: string;
  tag: string | null;
  isFeatured: boolean;
  createdAt: string;
};

export type UseReviewsResult = {
  reviews: Review[];
  loading: boolean;
  refetch: () => void;
};

export function useReviews(schoolId: string | null | undefined): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    if (!schoolId) return;
    let cancelled = false;
    setLoading(true);
    supabase
      .from('school_reviews')
      .select('id, author, author_role, rating, body, tag, is_featured, created_at')
      .eq('school_id', schoolId)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setReviews(
          (data ?? []).map(r => ({
            id:         String(r.id),
            author:     String(r.author),
            authorRole: String((r as Record<string, unknown>).author_role ?? 'parent'),
            rating:     Number(r.rating),
            body:       String(r.body),
            tag:        r.tag != null ? String(r.tag) : null,
            isFeatured: Boolean((r as Record<string, unknown>).is_featured),
            createdAt:  String(r.created_at),
          }))
        );
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [schoolId, tick]);

  return { reviews, loading, refetch };
}
