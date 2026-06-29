import { redirect } from 'next/navigation';

// /about — redirect to the main SchoolOS landing page about section
export default function AboutPage() {
  redirect('https://schoolos.app/#about');
}
