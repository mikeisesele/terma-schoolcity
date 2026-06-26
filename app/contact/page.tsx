import { redirect } from 'next/navigation';

// /contact — redirect to the main KidTrack landing page contact/demo section
export default function ContactPage() {
  redirect('https://kidtrack.app/#contact');
}
