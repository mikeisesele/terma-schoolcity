import { redirect } from 'next/navigation';

// /schools (bare) — redirect to the school finder
export default function SchoolsIndex() {
  redirect('/find');
}
