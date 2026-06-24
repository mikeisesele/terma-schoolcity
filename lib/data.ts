// Public School Net data. In production this comes from the backend public endpoints
// (verified + published schools only). Fixtures here mirror that shape for SSR/ISR rendering.
export interface School {
  id: string;
  name: string;
  tagline: string;
  location: string;
  type: 'All-through' | 'Secondary' | 'Primary';
  gender: 'Mixed' | 'Boys' | 'Girls';
  boarding: 'Day' | 'Boarding' | 'Day & Boarding';
  feeFromKobo: number;
  rating: number;
  reviews: number;
  badge: 'standard' | 'featured' | 'premium' | null;
  established: number;
  hue: number; // gradient placeholder seed
  facilities: string[];
  vacancies: { title: string; dept: string }[];
  scholarships: { title: string; value: string }[];
}

export const SCHOOLS: School[] = [
  { id: 'heritage', name: 'Heritage International College', tagline: 'Where heritage meets the future', location: 'Lekki, Lagos', type: 'Secondary', gender: 'Mixed', boarding: 'Day & Boarding', feeFromKobo: 45_000_000, rating: 4.8, reviews: 126, badge: 'premium', established: 2005, hue: 152, facilities: ['Science labs', 'Library', 'Sports complex', 'ICT centre'], vacancies: [{ title: 'Head of Science', dept: 'Academics' }], scholarships: [{ title: 'STEM Merit Scholarship', value: '₦250k/term' }] },
  { id: 'ladela', name: 'Ladela Schools', tagline: 'Excellence in every child since 1998', location: 'Surulere, Lagos', type: 'All-through', gender: 'Mixed', boarding: 'Day', feeFromKobo: 18_000_000, rating: 4.5, reviews: 89, badge: 'standard', established: 1998, hue: 130, facilities: ['Library', 'Computer lab', 'Playground'], vacancies: [{ title: 'Mathematics Teacher', dept: 'Academics' }], scholarships: [] },
  { id: 'greenwood', name: 'Greenwood Academy', tagline: 'Nurturing curious minds', location: 'Gwarinpa, Abuja', type: 'All-through', gender: 'Mixed', boarding: 'Day', feeFromKobo: 22_000_000, rating: 4.6, reviews: 64, badge: 'featured', established: 2010, hue: 168, facilities: ['STEM lab', 'Art studio', 'Swimming pool'], vacancies: [], scholarships: [{ title: 'Sports Bursary', value: 'Full tuition' }] },
  { id: 'crystal', name: 'Crystal Heights College', tagline: 'Character, scholarship, service', location: 'GRA, Port Harcourt', type: 'Secondary', gender: 'Girls', boarding: 'Boarding', feeFromKobo: 38_000_000, rating: 4.7, reviews: 51, badge: 'standard', established: 2003, hue: 110, facilities: ['Boarding house', 'Chapel', 'Science labs'], vacancies: [{ title: 'Boarding Matron', dept: 'Welfare' }], scholarships: [] },
  { id: 'sunrise', name: 'Sunrise Montessori', tagline: 'A joyful start to learning', location: 'Maitama, Abuja', type: 'Primary', gender: 'Mixed', boarding: 'Day', feeFromKobo: 12_000_000, rating: 4.4, reviews: 73, badge: 'standard', established: 2012, hue: 90, facilities: ['Montessori rooms', 'Garden', 'Music room'], vacancies: [], scholarships: [] },
  { id: 'wellington', name: 'Wellington Grammar School', tagline: 'Tradition and ambition', location: 'Ikoyi, Lagos', type: 'Secondary', gender: 'Boys', boarding: 'Day & Boarding', feeFromKobo: 52_000_000, rating: 4.9, reviews: 142, badge: 'premium', established: 1996, hue: 145, facilities: ['Rugby pitch', 'Observatory', 'Debate hall', 'Labs'], vacancies: [{ title: 'Physics Teacher', dept: 'Academics' }], scholarships: [{ title: 'Founders Scholarship', value: '50% tuition' }] },
];

export const getSchool = (id: string) => SCHOOLS.find((s) => s.id === id) ?? null;
export const naira = (kobo: number) => `₦${Math.round(kobo / 100).toLocaleString()}`;
