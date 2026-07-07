/**
 * useSchools — fetches the public school directory from Supabase.
 * Pure DB mode: no static fallback. Returns empty array while loading.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { deriveFacilityImages } from '@/lib/data';
import type { School } from '@/lib/data';

type DBSchool = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  motto: string | null;
  plan: string | null;
  primary_colour: string | null;
  status: string | null;
  banner_url: string | null;
  image_url: string | null;
  type: string | null;
  gender: string | null;
  levels: string | null;
  orientation: string | null;
  transport: boolean | null;
  boarding: boolean | null;
  fees_from_kobo: number | null;
  fees_to_kobo: number | null;
  features: string[] | null;
  scholarships: number | null;
  review_count: number | null;
  students: string | null;
  established: number | null;
  is_featured: boolean | null;
  is_special: boolean | null;
  special_focus: string[] | null;
  rating: number | null;
};

function mapDbToSchool(row: DBSchool): School {
  const features = row.features ?? [];
  return {
    id:           row.id,
    name:         row.name,
    ktPlan:       row.plan === 'pro' || row.plan === 'premium' ? 'Pro' : row.plan === 'standard' ? 'Standard' : undefined,
    city:         row.city ?? row.address ?? 'Nigeria',
    state:        row.state ?? 'NG',
    type:         row.type ?? 'Day',
    gender:       row.gender ?? 'Mixed',
    levels:       row.levels ?? 'Nursery–SSS',
    orientation:  row.orientation ?? 'Non-denominational',
    transport:    row.transport ?? false,
    boarding:     row.boarding ?? false,
    rating:       typeof row.rating === 'number' ? row.rating : 4.5,
    reviews:      row.review_count ?? 0,
    verified:     row.status === 'active',
    feeFrom:      Math.round((row.fees_from_kobo ?? 0) / 100),
    feeTo:        Math.round((row.fees_to_kobo ?? 0) / 100),
    color:        row.primary_colour ?? '#1A3D2C',
    tagline:      row.motto ?? '',
    features,
    scholarships: row.scholarships ?? 0,
    vacancies:    0,
    students:     row.students ?? '',
    established:  row.established ?? 2000,
    address:      row.address ?? '',
    phone:        row.phone ?? '',
    email:        row.email ?? '',
    special:      row.is_special ?? false,
    specialFocus: row.special_focus ?? [],
    isFeatured:   row.is_featured ?? false,
    bannerUrl:    row.banner_url ?? undefined,
    imageUrl:     row.image_url ?? undefined,
    facilityImages: deriveFacilityImages(features),
  };
}

export type UseSchoolsResult = {
  schools: School[];
  loading: boolean;
  error: string | null;
};

export function useSchools(): UseSchoolsResult {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('schools')
        .select(`id, name, city, state, address, phone, email, motto, plan,
                 primary_colour, status, banner_url, image_url,
                 type, gender, levels, orientation, transport, boarding,
                 fees_from_kobo, fees_to_kobo, features,
                 scholarships, review_count, students, established,
                 is_featured, is_special, special_focus, rating`)
        .eq('status', 'active')
        .order('name');

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        setSchools((data as DBSchool[] ?? []).map(mapDbToSchool));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { schools, loading, error };
}
