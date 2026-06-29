import { redirect } from 'next/navigation';

// /contact — redirect to the main SchoolOS landing page contact/demo section
export default function ContactPage() {
  redirect('https://schoolos.app/#contact');
}
