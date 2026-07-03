/**
 * useReviews — fetches reviews for a school from school_reviews table.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type Review = {
  id: string;
  author: string;
  rating: number;
  body: string;
  tag: string | null;
  createdAt: string;
};

export type UseReviewsResult = {
  reviews: Review[];
  loading: boolean;
};

export function useReviews(schoolId: string | null | undefined): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    let cancelled = false;
    setLoading(true);
    supabase
      .from('school_reviews')
      .select('id, author, rating, body, tag, created_at')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setReviews(
          (data ?? []).map(r => ({
            id:        String(r.id),
            author:    String(r.author),
            rating:    Number(r.rating),
            body:      String(r.body),
            tag:       r.tag != null ? String(r.tag) : null,
            createdAt: String(r.created_at),
          }))
        );
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [schoolId]);

  return { reviews, loading };
}
