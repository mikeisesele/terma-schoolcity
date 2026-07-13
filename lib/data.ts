// ── Types ─────────────────────────────────────────────────────────────────────
export type Campus = {
  name: string;
  address: string;
  city: string;
  phone?: string;
};

export type School = {
  id: string; slug: string; name: string; ktPlan?: string; city: string; state: string;
  type: string; gender: string; levels: string; orientation: string;
  transport: boolean; boarding: boolean; rating: number; reviews: number;
  verified: boolean; feeFrom: number; feeTo: number; color: string;
  tagline: string; features: string[]; scholarships: number; vacancies: number;
  students: string; established: number; address: string; phone: string;
  email: string; special?: boolean; specialFocus?: string[];
  isFeatured?: boolean;
  campuses?: Campus[];
  bannerUrl?: string;
  imageUrl?: string;
  facilityImages?: Record<string, string[]>;
  lat?: number | null;
  lng?: number | null;
};

/** Derive a URL-safe slug from a school name. */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Facility image pools (static CDN path constants — not real data) ──────────
export const FI = {
  scienceLab:  ['/schools/facility-schence-lab1.jpeg', '/schools/facility-sciencelab2.png', '/schools/facility-sciencelab3.webp'],
  computerLab: ['/schools/facility-computer-lab.jpg', '/schools/facility-computer-lab2.jpg', '/schools/facility-computer-lab3.jpg'],
  library:     ['/schools/facility-library.jpg', '/schools/facility-library2.jpg', '/schools/facility-library3.jpg'],
  sports:      ['/schools/extracurricular-sport.jpg', '/schools/extracurricular-sport2.jpg', '/schools/extracurricular-sport3.png', '/schools/extracurricular-sport4.jpg'],
  transport:   ['/schools/facility-schoolbus.jpg'],
  swimming:    ['/schools/facility-swimingpool.jpg'],
  nursery:     ['/schools/facility-nursery-playground.jpg', '/schools/bannery-nurseryschool.jpg', '/schools/banner-nurseryschool2.jpg', '/schools/banner-nurseryschool3.jpg'],
  hygiene:     ['/schools/facility-toilets.jpeg'],
  hostel:      ['/schools/facility-hostel.jpeg', '/schools/facility-hostel2.jpg'],
  music:       ['/schools/facility-music-lab.jpg', '/schools/extracurricular-band.jpg'],
  ict:         ['/schools/extra-curricular-ict.jpg', '/schools/facility-computer-lab2.jpg'],
  academic:    ['/schools/academic-session.jpg', '/schools/acedemic-session2.jpg', '/schools/academic-session3.jpg', '/schools/academic-session4.jpg'],
  life:        ['/schools/school-life-student-bonding.jpg', '/schools/handson.jpg', '/schools/extracurricular-seminar.jpg'],
  cultural:    ['/schools/extracuricular-cultural.jpg'],
  religion:    ['/schools/extracurricular-religion.jpg'],
  birthday:    ['/schools/extra-curricular-birthday.jpg'],
  club:        ['/schools/extracurricular-club1.jpg', '/schools/extracurricular-club2.jpg', '/schools/extracurricular-club3.jpg'],
};

/** Derive facility photo pools from a school's feature list. */
export function deriveFacilityImages(features: string[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const f of features) {
    const lower = f.toLowerCase();
    if (lower.includes('science'))         map[f] = FI.scienceLab;
    else if (lower.includes('computer'))   map[f] = FI.computerLab;
    else if (lower.includes('library'))    map[f] = FI.library;
    else if (lower.includes('sport'))      map[f] = FI.sports;
    else if (lower.includes('transport'))  map[f] = FI.transport;
    else if (lower.includes('swimming'))   map[f] = FI.swimming;
    else if (lower.includes('boarding') || lower.includes('hostel')) map[f] = FI.hostel;
    else if (lower.includes('music'))      map[f] = FI.music;
    else if (lower.includes('nursery') || lower.includes('playground')) map[f] = FI.nursery;
    else if (lower.includes('chapel') || lower.includes('mosque'))      map[f] = FI.religion;
    else if (lower.includes('cafeteria') || lower.includes('dining'))   map[f] = FI.life;
    else if (lower.includes('ict') || lower.includes('computer'))       map[f] = FI.ict;
    else if (lower.includes('sick') || lower.includes('medical') || lower.includes('sick bay')) map[f] = FI.academic;
    else if (lower.includes('art') || lower.includes('studio') || lower.includes('drama'))      map[f] = FI.cultural;
    else if (lower.includes('assembly') || lower.includes('hall'))      map[f] = FI.academic;
    else if (lower.includes('security'))                                 map[f] = FI.academic;
  }
  return map;
}

// ── Marketing copy (hardcoded — design spec, not real data) ──────────────────
export const SN_PARENT_FEATURES = [
  { emoji:'📊', title:'Results & report cards', text:'CA scores, class exams, term standings, and official report cards — on your phone the moment school publishes. No printing, no gate queues.' },
  { emoji:'💬', title:'Class announcements', text:"Notices targeted to your child's exact class, not a group of 400 parents. Absence notes in two taps. Every message flows through the school, on record." },
  { emoji:'✉️', title:'Direct teacher messaging', text:"Message your child's class teacher directly from the app. No personal phone numbers, no lost texts — all conversations in one auditable thread." },
  { emoji:'🗓️', title:'School calendar, live', text:'Exam timetables, PTA meetings, school events and public holidays — all in one place, always current. Updated instantly when school makes a change.' },
  { emoji:'📋', title:'Full attendance record', text:"See every day your child was present, absent, or excused — across the entire term. Know what's happening before the report card arrives." },
  { emoji:'🌅', title:'Daily welfare reports', text:"Class teachers send a brief daily note on your child's mood, participation and wellbeing. Real school-day visibility, not just results day." },
  { emoji:'💳', title:'Fees — pay on your phone', text:'Pay term fees in full or in part from your phone. Multiple siblings on one checkout. Instant digital receipts and a complete payment history in your account.' },
  { emoji:'🔔', title:'Safe pickup & drop-off', text:'Every handover — morning drop-off and afternoon pickup — verified with a 4-digit code. Medical alerts visible to the driver at handover. Every child, every time.' },
  { emoji:'🚌', title:'Live bus tracking', text:'See the school bus on a live map. Get notified when your child boards and when they arrive at school or home — for every family on the bus.' },
  { emoji:'🎓', title:'Student portal access', text:'Your child gets their own portal for CBT exams, class timetable, results history, and digital library. Available on any phone — no app install needed.' },
];

// ── Vacancy type + filter constants ──────────────────────────────────────────
export type Vacancy = {
  id: string; sId: string; sName: string; sColor: string; city: string; state: string;
  title: string; dept: string; type: string; deadline: string; summary: string; applyEmail: string;
  isSpecial?: boolean;
  roleOverview: string | null;
  keyResponsibilities: string | null;
  requirements: string | null;
  perks: string[];
  salaryRange: string | null;
  minQualification: string | null;
  experienceLevel: string | null;
  location: string | null;
  trcnRequired: boolean;
  applyInstructions: string | null;
};

export const V_DEPTS = [
  'All departments','Secondary – Academic','Primary – Academic','Nursery – Academic',
  'Administration','ICT & Technology','Arts & Culture','Physical Education',
  'Support & Welfare','Special Education',
];
export const V_TYPES  = ['All','Full-time','Part-time','Contract'];
export const V_TYPE_CLR: Record<string,string> = { 'Full-time':'#1A3D2C','Part-time':'#B87D20','Contract':'#2A6FDB' };
