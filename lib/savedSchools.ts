import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

async function ensureSchoolCityUser(user: User) {
  const metadata = user.user_metadata ?? {};
  const { error } = await supabase.from('schoolcity_users').upsert({
    id: user.id,
    google_sub: user.id,
    name: String(metadata.full_name ?? metadata.name ?? user.email ?? 'SchoolCity user'),
    email: user.email ?? null,
    avatar_url: String(metadata.avatar_url ?? metadata.picture ?? '') || null,
    last_seen_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  if (error) throw error;
}

export async function loadSavedSchoolIds(user: User): Promise<string[]> {
  await ensureSchoolCityUser(user);
  const { data, error } = await supabase.from('parent_saved_schools').select('school_id').eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []).map(row => String(row.school_id));
}

export async function setSavedSchool(user: User, schoolId: string, saved: boolean) {
  await ensureSchoolCityUser(user);
  if (saved) {
    const { error } = await supabase.from('parent_saved_schools').upsert(
      { user_id: user.id, school_id: schoolId },
      { onConflict: 'user_id,school_id', ignoreDuplicates: true },
    );
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('parent_saved_schools').delete().eq('user_id', user.id).eq('school_id', schoolId);
  if (error) throw error;
}
