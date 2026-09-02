import type { Metadata } from 'next';
import { HomeClient } from './_HomeClient';

export const metadata: Metadata = {
  title: 'Find Private Schools in Nigeria | SchoolCity by Terma',
  description: 'Discover and compare verified Nigerian private schools. Search by city, fees, curriculum and facilities. Nursery, Primary, Secondary schools across Lagos, Abuja, Port Harcourt and more.',
  keywords: ['private schools Nigeria', 'find schools Lagos', 'schools in Abuja', 'best schools Nigeria', 'school fees Nigeria', 'school directory Nigeria'],
  alternates: { canonical: 'https://schools.terma.ng' },
  openGraph: {
    title: 'Find Private Schools in Nigeria',
    description: 'Discover, compare and enquire with verified Nigerian private schools on SchoolCity.',
  },
};

export default async function SNHome() {
  return <HomeClient />;
}
