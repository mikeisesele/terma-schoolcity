/**
 * useSchools — fetches the public school directory from Supabase.
 * Pure DB mode: no static fallback. Returns empty array while loading.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { deriveFacilityImages, publicPlanLabel, toSlug } from '@/lib/data';
import type { School, SchoolCityVisibilityScope } from '@/lib/data';

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
  schoolcity_tier: string | null;
  schoolcity_visibility_scope: string | null;
  schoolcity_tier_expires_at: string | null;
  is_special: boolean | null;
  special_focus: string[] | null;
  rating: number | null;
};

type VisibilityOrder = {
  school_id: string;
  tier: string;
  visibility_scope: string | null;
  expires_at: string;
};

function normalizeScope(scope: string | null): SchoolCityVisibilityScope {
  if (scope === 'national' || scope === 'state') return scope;
  return 'city';
}

function scopeRank(scope: SchoolCityVisibilityScope) {
  if (scope === 'national') return 3;
  if (scope === 'state') return 2;
  return 1;
}

function normalizePlacement(row: VisibilityOrder): { tier: 'spotlight' | 'rated'; scope: SchoolCityVisibilityScope; expiresAt: string } | null {
  if (row.tier !== 'spotlight' && row.tier !== 'rated') return null;
  return { tier: row.tier, scope: normalizeScope(row.visibility_scope), expiresAt: row.expires_at };
}

function mapDbToSchool(row: DBSchool): School {
  const features = row.features ?? [];
  const tierExpiresAt = row.schoolcity_tier_expires_at;
  const activeTier = tierExpiresAt && new Date(tierExpiresAt).getTime() > Date.now()
    ? row.schoolcity_tier
    : null;
  return {
    id:           row.id,
    slug:         toSlug(row.name),
    name:         row.name,
    ktPlan:       publicPlanLabel(row.plan),
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
    schoolcityTier: activeTier === 'spotlight' || activeTier === 'rated' ? activeTier : null,
    schoolcityVisibilityScope: row.schoolcity_visibility_scope ? normalizeScope(row.schoolcity_visibility_scope) : null,
    schoolcityTierExpiresAt: tierExpiresAt,
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
      const [schoolsRes, visibilityRes] = await Promise.all([
        supabase
          .from('schools')
          .select(`id, name, city, state, address, phone, email, motto, plan,
                 primary_colour, status, banner_url, image_url,
                 type, gender, levels, orientation, transport, boarding,
                 fees_from_kobo, fees_to_kobo, features,
                 scholarships, review_count, students, established,
                 is_featured, schoolcity_tier, schoolcity_visibility_scope, schoolcity_tier_expires_at,
                 is_special, special_focus, rating`)
          .eq('status', 'active')
          .order('name'),
        supabase
          .from('schoolcity_visibility_orders')
          .select('school_id, tier, visibility_scope, expires_at')
          .eq('paystack_status', 'confirmed')
          .gt('expires_at', new Date().toISOString()),
      ]);

      if (cancelled) return;

      if (schoolsRes.error) {
        setError(schoolsRes.error.message);
      } else {
        const placements = new Map<string, NonNullable<School['schoolcityPlacements']>>();
        for (const order of (visibilityRes.data as VisibilityOrder[] | null) ?? []) {
          const placement = normalizePlacement(order);
          if (!placement) continue;
          const existing = placements.get(order.school_id) ?? [];
          existing.push(placement);
          placements.set(order.school_id, existing);
        }

        setSchools(((schoolsRes.data as DBSchool[] | null) ?? []).map(row => {
          const school = mapDbToSchool(row);
          const activePlacements = placements.get(row.id);
          if (!activePlacements?.length) return school;
          const primary = [...activePlacements].sort((a, b) => {
            const tierRank = (b.tier === 'spotlight' ? 2 : 1) - (a.tier === 'spotlight' ? 2 : 1);
            if (tierRank !== 0) return tierRank;
            return scopeRank(b.scope) - scopeRank(a.scope);
          })[0]!;
          return {
            ...school,
            schoolcityTier: primary.tier,
            schoolcityVisibilityScope: primary.scope,
            schoolcityTierExpiresAt: primary.expiresAt,
            schoolcityPlacements: activePlacements,
          };
        }));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { schools, loading, error };
}
