import { redirect } from 'next/navigation';

// /about — redirect to the main KidTrack landing page about section
export default function AboutPage() {
  redirect('https://kidtrack.app/#about');
}
