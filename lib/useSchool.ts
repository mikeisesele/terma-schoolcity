/**
 * useSchool — fetches a single school by UUID with campuses and vacancy count.
 * Used by the school detail page.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { deriveFacilityImages } from '@/lib/data';
import type { School, Campus } from '@/lib/data';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Convert "Nursery,Primary,JSS,SSS" to the compact display form "Nursery–SSS". */
function formatLevels(raw: string): string {
  if (!raw.includes(',')) return raw; // already in range/single format
  const ALL = ['Nursery', 'Primary', 'JSS', 'SSS'];
  const present = raw.split(',').map(s => s.trim()).filter(s => ALL.includes(s));
  if (!present.length) return raw;
  const first = ALL.find(l => present.includes(l))!;
  const last = [...ALL].reverse().find(l => present.includes(l))!;
  return first === last ? first : `${first}–${last}`;
}

export type UseSchoolResult = {
  school: School | null;
  loading: boolean;
  notFound: boolean;
};

export function useSchool(id: string): UseSchoolResult {
  const [school,   setSchool]   = useState<School | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || !UUID_RE.test(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);

      const [schoolRes, campusRes, vacCountRes] = await Promise.all([
        supabase
          .from('schools')
          .select(`id, name, city, state, address, phone, email, motto, plan,
                   primary_colour, status, banner_url, image_url,
                   type, gender, levels, orientation, transport, boarding,
                   fees_from_kobo, fees_to_kobo, features,
                   scholarships, review_count, students, established,
                   is_featured, is_special, special_focus, rating,
                   lat, lng`)
          .eq('id', id)
          .maybeSingle(),

        supabase
          .from('school_campuses')
          .select('name, address, city, phone')
          .eq('school_id', id)
          .order('name'),

        supabase
          .from('school_vacancies')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', id)
          .eq('status', 'published'),
      ]);

      if (cancelled) return;

      if (!schoolRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const row = schoolRes.data as Record<string, unknown>;
      const features = (row.features as string[]) ?? [];
      const campuses = (campusRes.data ?? []) as Campus[];
      const vacCount = vacCountRes.count ?? 0;

      setSchool({
        id:           String(row.id),
        name:         String(row.name),
        ktPlan:       row.plan === 'pro' || row.plan === 'premium' ? 'Pro' : row.plan === 'standard' ? 'Standard' : undefined,
        city:         String(row.city ?? row.address ?? 'Nigeria'),
        state:        String(row.state ?? 'NG'),
        type:         String(row.type ?? 'Day'),
        gender:       String(row.gender ?? 'Mixed'),
        levels:       formatLevels(String(row.levels ?? 'Nursery–SSS')),
        orientation:  String(row.orientation ?? 'Non-denominational'),
        transport:    Boolean(row.transport),
        boarding:     Boolean(row.boarding),
        rating:       typeof row.rating === 'number' ? row.rating : 4.5,
        reviews:      typeof row.review_count === 'number' ? row.review_count : 0,
        verified:     row.status === 'active',
        feeFrom:      Math.round((typeof row.fees_from_kobo === 'number' ? row.fees_from_kobo : 0) / 100),
        feeTo:        Math.round((typeof row.fees_to_kobo === 'number' ? row.fees_to_kobo : 0) / 100),
        color:        String(row.primary_colour ?? '#1A3D2C'),
        tagline:      String(row.motto ?? ''),
        features,
        scholarships: typeof row.scholarships === 'number' ? row.scholarships : 0,
        vacancies:    vacCount,
        students:     String(row.students ?? ''),
        established:  typeof row.established === 'number' ? row.established : 2000,
        address:      String(row.address ?? ''),
        phone:        String(row.phone ?? ''),
        email:        String(row.email ?? ''),
        special:      Boolean(row.is_special),
        specialFocus: (row.special_focus as string[]) ?? [],
        isFeatured:   Boolean(row.is_featured),
        bannerUrl:    row.banner_url != null ? String(row.banner_url) : undefined,
        imageUrl:     row.image_url != null ? String(row.image_url) : undefined,
        lat:          typeof row.lat === 'number' ? row.lat : null,
        lng:          typeof row.lng === 'number' ? row.lng : null,
        campuses:     campuses.length > 1 ? campuses : undefined,
        facilityImages: deriveFacilityImages(features),
      });

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { school, loading, notFound };
}
