/**
 * useSchools — fetches the public school directory from Supabase.
 * Falls back to SN_SCHOOLS static data if the query returns empty (dev without seed).
 *
 * The `schools` table in the DB uses:
 *   id (uuid), name, logo_url, address (city/state derived), plan (maps to ktPlan),
 *   primary_colour, status, phone, email, motto (tagline)
 *
 * TODO: The DB schools table does not yet have:
 *   slug, city, state, type, fees_from_kobo, rating, is_public, gender, levels,
 *   orientation, transport, boarding, verified, scholarships, vacancies, students,
 *   established, features, special, specialFocus
 * Until those columns exist the query will return partial data and the mapper
 * fills in defaults. Remove the TODO when the schema is extended.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SN_SCHOOLS } from '@/lib/data';
import type { School } from '@/lib/data';

type DBSchool = {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  motto: string | null;
  plan: string | null;
  primary_colour: string | null;
  status: string | null;
};

/** Map a DB row to the local School shape used by all UI components. */
function mapDbToSchool(row: DBSchool): School {
  return {
    id: row.id,
    name: row.name,
    ktPlan: row.plan === 'premium' ? 'Premium' : row.plan === 'standard' ? 'Standard' : undefined,
    city: row.address ?? 'Nigeria',
    state: 'NG',
    type: 'Day',          // TODO: add `type` column to schools table
    gender: 'Mixed',      // TODO: add `gender` column to schools table
    levels: 'Nursery–SSS', // TODO: add `levels` column to schools table
    orientation: 'Non-denominational', // TODO: add `orientation` column
    transport: false,      // TODO: add `transport` column
    boarding: false,       // TODO: add `boarding` column
    rating: 4.5,           // TODO: add `rating` column / aggregate from reviews
    reviews: 0,            // TODO: aggregate from reviews table
    verified: row.status === 'active',
    feeFrom: 0,            // TODO: add `fees_from_kobo` column
    feeTo: 0,              // TODO: add `fees_to_kobo` column
    color: row.primary_colour ?? '#1A3D2C',
    tagline: row.motto ?? '',
    features: [],          // TODO: add `features` column / join
    scholarships: 0,       // TODO: add `scholarships` count
    vacancies: 0,          // TODO: add `vacancies` count / join
    students: '',          // TODO: add `students` column
    established: 2000,     // TODO: add `established` column
    address: row.address ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
  };
}

export type UseSchoolsResult = {
  schools: School[];
  loading: boolean;
  error: string | null;
  isLive: boolean; // true = from Supabase, false = static fallback
};

export function useSchools(): UseSchoolsResult {
  const [schools, setSchools] = useState<School[]>(SN_SCHOOLS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('schools')
        .select('id, name, logo_url, address, phone, email, motto, plan, primary_colour, status')
        .eq('status', 'active') // TODO: replace with .eq('is_public', true) once column exists
        .order('name');

      if (cancelled) return;

      if (err) {
        setError(err.message);
        // keep static fallback
      } else if (data && data.length > 0) {
        // Merge: start from the full static list (preserves bannerUrl, imageUrl, all rich data),
        // enrich matching schools with live DB values (id→UUID, phone, email, address, plan, color),
        // and append any DB schools whose names don't match any static entry.
        const merged = [...SN_SCHOOLS];
        const usedDbIds = new Set<string>();
        const nameLower = (s: string) => s.toLowerCase().trim();

        for (const row of data as DBSchool[]) {
          const idx = merged.findIndex(s => nameLower(s.name) === nameLower(row.name));
          if (idx !== -1) {
            merged[idx] = {
              ...merged[idx],
              id: row.id,                               // use UUID so detail page fetches live data
              phone: row.phone ?? merged[idx].phone,
              email: row.email ?? merged[idx].email,
              address: row.address ?? merged[idx].address,
              tagline: row.motto ?? merged[idx].tagline,
              color: row.primary_colour ?? merged[idx].color,
              ktPlan: row.plan === 'premium' ? 'Premium' : row.plan === 'standard' ? 'Standard' : merged[idx].ktPlan,
              verified: row.status === 'active',
            };
            usedDbIds.add(row.id);
          }
        }

        // Append DB-only schools (not matched to any static entry)
        const BANNER_POOL = SN_SCHOOLS.filter(s => s.bannerUrl).map(s => s.bannerUrl!);
        let poolIdx = 0;
        for (const row of data as DBSchool[]) {
          if (!usedDbIds.has(row.id)) {
            const banner = BANNER_POOL[poolIdx % BANNER_POOL.length];
            poolIdx++;
            merged.push({
              id: row.id,
              name: row.name,
              ktPlan: row.plan === 'premium' ? 'Premium' : row.plan === 'standard' ? 'Standard' : undefined,
              city: row.address ?? 'Nigeria',
              state: 'NG', type: 'Day', gender: 'Mixed', levels: 'Nursery–SSS',
              orientation: 'Non-denominational', transport: false, boarding: false,
              rating: 4.5, reviews: 0, verified: row.status === 'active',
              feeFrom: 0, feeTo: 0,
              color: row.primary_colour ?? '#1A3D2C',
              tagline: row.motto ?? '',
              features: [], scholarships: 0, vacancies: 0, students: '', established: 2000,
              address: row.address ?? '', phone: row.phone ?? '', email: row.email ?? '',
              bannerUrl: banner, imageUrl: banner,
            });
          }
        }

        setSchools(merged);
        setIsLive(true);
      }
      // Otherwise keep the static SN_SCHOOLS fallback (dev / partially seeded DB)

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { schools, loading, error, isLive };
}
