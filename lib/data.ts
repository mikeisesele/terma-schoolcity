// Public School Net data. In production this comes from the backend public endpoints
// (verified + published schools only). Fixtures here mirror that shape for SSR/ISR rendering.
// Source of truth: schoolnet-app.jsx SN_SCHOOLS + schoolnet-extras.jsx SN_VACANCIES

export interface Scholarship {
  title: string;
  value: string;
  provider: string;
  slots: number;
  deadline: string;
  criteria: string;
}

export interface Vacancy {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolColor: string;
  city: string;
  state: string;
  title: string;
  dept: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  deadline: string;
  summary: string;
  applyEmail: string;
}

export interface School {
  id: string;
  name: string;
  ktPlan?: 'Premium' | 'Standard';
  /** @deprecated use city + state — populated automatically */
  location: string;
  /** @deprecated use feeFrom — populated automatically */
  feeFromKobo: number;
  /** @deprecated use ktPlan — populated automatically */
  badge: 'standard' | 'featured' | 'premium' | null;
  /** @deprecated use features — populated automatically */
  facilities: string[];
  /** @deprecated use special — populated automatically */
  specialNeeds: boolean;
  /** @deprecated legacy review objects */
  reviews_list?: { stars: number; text: string; anon: boolean; by: string }[];
  city: string;
  state: string;
  type: string;
  gender: string;
  levels: string;
  orientation: string;
  transport: boolean;
  boarding: boolean;
  rating: number;
  reviews: number;
  verified: boolean;
  feeFrom: number; // kobo
  feeTo: number;   // kobo
  color: string;
  hue: number;     // HSL hue derived from color
  tagline: string;
  features: string[];
  scholarships: Scholarship[];
  vacancies: Vacancy[];
  students: string;
  established: number;
  address: string;
  phone: string;
  email: string;
  special?: boolean;
  specialFocus?: string[];
}

// ---------------------------------------------------------------------------
// Vacancy seed (from SN_VACANCIES in schoolnet-extras.jsx)
// ---------------------------------------------------------------------------
export const VACANCIES: Vacancy[] = [
  { id: 'v1',  schoolId: 'gf',  schoolName: 'Greenfield International School', schoolColor: '#1A3D2C', city: 'Gwarinpa, Abuja', state: 'FCT',     title: 'Mathematics Teacher (SSS)',                dept: 'Secondary – Academic',       type: 'Full-time', deadline: '30 Jul 2026', summary: 'TRCN-registered Maths teacher for SSS 1–3. Strong classroom management required.',                           applyEmail: 'careers@greenfield.edu.ng' },
  { id: 'v2',  schoolId: 'gf',  schoolName: 'Greenfield International School', schoolColor: '#1A3D2C', city: 'Gwarinpa, Abuja', state: 'FCT',     title: 'Basic Science Teacher (JSS)',               dept: 'Secondary – Academic',       type: 'Full-time', deadline: '25 Jul 2026', summary: 'Passionate science teacher for JSS 1–3 with lab supervision experience.',                                    applyEmail: 'careers@greenfield.edu.ng' },
  { id: 'v3',  schoolId: 'hc',  schoolName: 'Heritage College',                 schoolColor: '#2A6FDB', city: 'Jabi, Abuja',     state: 'FCT',     title: 'School Librarian',                          dept: 'Non-academic / Support',     type: 'Full-time', deadline: '20 Jul 2026', summary: 'Manage school library, catalogue new acquisitions, support reading programme.',                               applyEmail: 'hr@heritagecollege.edu.ng' },
  { id: 'v4',  schoolId: 'ms',  schoolName: 'Model Schools FCT',                schoolColor: '#1F8A5B', city: 'Maitama, Abuja',  state: 'FCT',     title: 'ICT Coordinator',                           dept: 'Administration',             type: 'Full-time', deadline: '15 Jul 2026', summary: 'Oversee computer lab, school ICT infrastructure and digital learning resources.',                             applyEmail: 'admin@modelschools.edu.ng' },
  { id: 'v5',  schoolId: 'ms',  schoolName: 'Model Schools FCT',                schoolColor: '#1F8A5B', city: 'Maitama, Abuja',  state: 'FCT',     title: 'English Language Teacher',                  dept: 'Secondary – Academic',       type: 'Full-time', deadline: '10 Aug 2026', summary: 'WAEC-focused English teaching for JSS and SSS. 3+ years required.',                                         applyEmail: 'admin@modelschools.edu.ng' },
  { id: 'v6',  schoolId: 'ms',  schoolName: 'Model Schools FCT',                schoolColor: '#1F8A5B', city: 'Maitama, Abuja',  state: 'FCT',     title: 'School Accountant',                         dept: 'Administration',             type: 'Full-time', deadline: '5 Aug 2026',  summary: 'Fee reconciliation, payroll processing and monthly financial reporting.',                                    applyEmail: 'admin@modelschools.edu.ng' },
  { id: 'v7',  schoolId: 'rb',  schoolName: 'Rainbow Nursery & Primary',        schoolColor: '#D4591A', city: 'Wuse II, Abuja',  state: 'FCT',     title: 'Nursery Class Teacher',                     dept: 'Nursery – Academic',         type: 'Full-time', deadline: '1 Aug 2026',  summary: 'Caring teacher for Pre-Nursery/Nursery 1–2. Montessori experience preferred.',                               applyEmail: 'jobs@rainbownursery.edu.ng' },
  { id: 'v8',  schoolId: 'cv',  schoolName: 'Covenant Academy',                 schoolColor: '#7C3AED', city: 'Lugbe, Abuja',    state: 'FCT',     title: 'Physical Education Teacher',                dept: 'Secondary – Academic',       type: 'Full-time', deadline: '25 Jul 2026', summary: 'Deliver PE curriculum JSS–SSS, coach school sports teams and inter-house events.',                           applyEmail: 'hr@covenantacademy.edu.ng' },
  { id: 'v9',  schoolId: 'cv',  schoolName: 'Covenant Academy',                 schoolColor: '#7C3AED', city: 'Lugbe, Abuja',    state: 'FCT',     title: 'School Nurse',                              dept: 'Non-academic / Support',     type: 'Full-time', deadline: '18 Jul 2026', summary: 'Manage sick bay, administer first aid, maintain student health records.',                                    applyEmail: 'hr@covenantacademy.edu.ng' },
  { id: 'v10', schoolId: 'li',  schoolName: 'Lagos International School',       schoolColor: '#C41E3A', city: 'Victoria Island', state: 'Lagos',   title: 'Head of Science Department',                dept: 'Secondary – Academic',       type: 'Full-time', deadline: '15 Aug 2026', summary: 'Lead Science dept, mentor teachers, coordinate WAEC/NECO preparations.',                                    applyEmail: 'recruitment@lagosintl.edu.ng' },
  { id: 'v11', schoolId: 'li',  schoolName: 'Lagos International School',       schoolColor: '#C41E3A', city: 'Victoria Island', state: 'Lagos',   title: 'IT Systems Administrator',                  dept: 'Administration',             type: 'Full-time', deadline: '20 Aug 2026', summary: 'Maintain school network, servers, student devices and digital infrastructure.',                              applyEmail: 'recruitment@lagosintl.edu.ng' },
  { id: 'v12', schoolId: 'li',  schoolName: 'Lagos International School',       schoolColor: '#C41E3A', city: 'Victoria Island', state: 'Lagos',   title: 'French Teacher (JSS + SSS)',                dept: 'Secondary – Academic',       type: 'Part-time', deadline: '10 Aug 2026', summary: 'Deliver French curriculum and prepare students for WAEC French paper.',                                     applyEmail: 'recruitment@lagosintl.edu.ng' },
  { id: 'v13', schoolId: 'hil', schoolName: 'Hillcrest School',                 schoolColor: '#0D9D8A', city: 'Jos, Plateau',    state: 'Plateau', title: 'Boarding House Master',                     dept: 'Non-academic / Support',     type: 'Full-time', deadline: '5 Aug 2026',  summary: 'Supervise boarding students, enforce house rules, support student welfare. Residential.',                    applyEmail: 'staffing@hillcrest.edu.ng' },
  { id: 'v14', schoolId: 'sfd', schoolName: 'FCT School for the Deaf',          schoolColor: '#2A6FDB', city: 'Karu, Abuja',     state: 'FCT',     title: 'Sign Language Interpreter',                 dept: 'Non-academic / Support',     type: 'Full-time', deadline: '28 Jul 2026', summary: 'BSL/NSL interpretation across classrooms and school events.',                                               applyEmail: 'hr@fctdeafschool.edu.ng' },
  { id: 'v15', schoolId: 'sfd', schoolName: 'FCT School for the Deaf',          schoolColor: '#2A6FDB', city: 'Karu, Abuja',     state: 'FCT',     title: 'Speech Therapist',                          dept: 'Non-academic / Support',     type: 'Contract',  deadline: '15 Aug 2026', summary: 'Weekly speech therapy sessions for students with hearing and speech challenges.',                            applyEmail: 'hr@fctdeafschool.edu.ng' },
  { id: 'v16', schoolId: 'sts', schoolName: 'Stepping Stones Special School',   schoolColor: '#D97757', city: 'Ikeja, Lagos',    state: 'Lagos',   title: 'Special Education Teacher (Dyslexia)',      dept: 'Primary – Academic',         type: 'Full-time', deadline: '20 Aug 2026', summary: 'Personalised learning for students with dyslexia and reading difficulties.',                                applyEmail: 'jobs@steppingstones.edu.ng' },
  { id: 'v17', schoolId: 'pac', schoolName: 'Pacelli School for the Blind',     schoolColor: '#6B3FA0', city: 'Surulere, Lagos', state: 'Lagos',   title: 'Braille Instructor',                        dept: 'Non-academic / Support',     type: 'Full-time', deadline: '1 Sep 2026',  summary: 'Teach Grade 1 & 2 Braille reading and writing to visually impaired students.',                              applyEmail: 'staff@pacelli.edu.ng' },
  // li v13 duplicate (5 total for li: v10, v11, v12, v13-li, v14-li)
  { id: 'v18', schoolId: 'li',  schoolName: 'Lagos International School',       schoolColor: '#C41E3A', city: 'Victoria Island', state: 'Lagos',   title: 'Physical Education Teacher',                dept: 'Secondary – Academic',       type: 'Full-time', deadline: '25 Aug 2026', summary: 'Lead PE and sports activities for JSS and SSS. Coaching certification preferred.',                          applyEmail: 'recruitment@lagosintl.edu.ng' },
  { id: 'v19', schoolId: 'li',  schoolName: 'Lagos International School',       schoolColor: '#C41E3A', city: 'Victoria Island', state: 'Lagos',   title: 'School Counsellor',                         dept: 'Non-academic / Support',     type: 'Full-time', deadline: '1 Sep 2026',  summary: 'Provide academic and pastoral counselling to secondary school students.',                                   applyEmail: 'recruitment@lagosintl.edu.ng' },
];

// ---------------------------------------------------------------------------
// Helper to compute HSL hue from a hex colour
// ---------------------------------------------------------------------------
function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  return h < 0 ? h + 360 : h;
}

// ---------------------------------------------------------------------------
// School seed (from SN_SCHOOLS in schoolnet-app.jsx)
// ---------------------------------------------------------------------------
// Compat fields (location, feeFromKobo, badge, facilities, specialNeeds) are
// populated by the forEach below; cast here so the object literals stay clean.
export const SCHOOLS: School[] = ([] as School[]).concat([
  {
    id: 'gf', name: 'Greenfield International School', ktPlan: 'Premium',
    city: 'Gwarinpa, Abuja', state: 'FCT',
    type: 'Day', gender: 'Mixed', levels: 'Nursery–SSS',
    orientation: 'Christian', transport: true, boarding: false,
    rating: 4.8, reviews: 127, verified: true,
    feeFrom: 38_000_000, feeTo: 78_000_000,
    color: '#1A3D2C', hue: hexToHue('#1A3D2C'),
    tagline: 'Excellence in Education',
    features: ['Science Lab', 'Computer Lab', 'Sports Ground', 'Transport', 'Library', 'Sick Bay'],
    scholarships: [
      { title: 'Academic Excellence Bursary',  value: '₦250,000/term', provider: 'School Alumni Foundation',  slots: 3, deadline: '31 Jul 2026', criteria: 'Top 5% of class, financial need demonstrated' },
      { title: 'Sports Scholarship',            value: '50% tuition',   provider: 'School Sports Committee',   slots: 5, deadline: '15 Aug 2026', criteria: 'Varsity-level athlete, 60%+ academic average' },
      { title: 'Girls in STEM Scholarship',     value: '100% tuition',  provider: 'TechBridge Nigeria',        slots: 4, deadline: '20 Aug 2026', criteria: 'Female student, Maths & Science above 75%, SSS entry' },
      { title: 'Alumni Bursary',                value: '₦150,000/term', provider: 'Old Students Association',  slots: 6, deadline: '1 Sep 2026',  criteria: 'Financial need demonstrated, good conduct record' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'gf'),
    students: '600+', established: 2007,
    address: 'Plot 12, Gwarinpa Estate, Abuja',
    phone: '+234 803 441 0001', email: 'info@greenfield.edu.ng',
  },
  {
    id: 'hc', name: 'Heritage College', ktPlan: 'Standard',
    city: 'Jabi, Abuja', state: 'FCT',
    type: 'Day & Boarding', gender: 'Mixed', levels: 'JSS–SSS',
    orientation: 'Christian', transport: true, boarding: true,
    rating: 4.7, reviews: 212, verified: true,
    feeFrom: 52_000_000, feeTo: 82_000_000,
    color: '#2A6FDB', hue: hexToHue('#2A6FDB'),
    tagline: 'Where Character Meets Excellence',
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'Boarding House', 'Chapel'],
    scholarships: [
      { title: 'Academic Excellence Bursary',  value: '₦250,000/term', provider: 'Heritage Alumni Foundation', slots: 3, deadline: '31 Jul 2026', criteria: 'Top 5% of class, financial need demonstrated' },
      { title: 'Sports Scholarship',            value: '50% tuition',   provider: 'Heritage Sports Committee',  slots: 4, deadline: '15 Aug 2026', criteria: 'Varsity-level athlete, 60%+ academic average' },
      { title: 'Girls in STEM Scholarship',     value: '100% tuition',  provider: 'TechBridge Nigeria',         slots: 2, deadline: '20 Aug 2026', criteria: 'Female student, Maths & Science above 75%, SSS entry' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'hc'),
    students: '800+', established: 2003,
    address: '7 Jabi Lake Road, Jabi, Abuja',
    phone: '+234 805 987 6543', email: 'info@heritagecollege.edu.ng',
  },
  {
    id: 'sa', name: 'Sunrise Academy', ktPlan: 'Standard',
    city: 'Garki, Abuja', state: 'FCT',
    type: 'Day', gender: 'Mixed', levels: 'Primary–SSS',
    orientation: 'Non-denominational', transport: true, boarding: false,
    rating: 4.5, reviews: 89, verified: true,
    feeFrom: 42_000_000, feeTo: 68_000_000,
    color: '#B87D20', hue: hexToHue('#B87D20'),
    tagline: "Raising Tomorrow's Leaders",
    features: ['Computer Lab', 'Library', 'Sports Ground', 'Transport'],
    scholarships: [
      { title: 'Academic Excellence Bursary', value: '₦200,000/term', provider: 'Sunrise Alumni Foundation', slots: 3, deadline: '31 Jul 2026', criteria: 'Top 5% of class, financial need demonstrated' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'sa'),
    students: '450+', established: 2011,
    address: '15 Aminu Kano Crescent, Garki II, Abuja',
    phone: '+234 802 123 4567', email: 'info@sunriseacademy.edu.ng',
  },
  {
    id: 'ms', name: 'Model Schools FCT',
    city: 'Maitama, Abuja', state: 'FCT',
    type: 'Day', gender: 'Mixed', levels: 'Primary–SSS',
    orientation: 'Multi-faith', transport: false, boarding: false,
    rating: 4.3, reviews: 156, verified: true,
    feeFrom: 35_000_000, feeTo: 62_000_000,
    color: '#1F8A5B', hue: hexToHue('#1F8A5B'),
    tagline: 'Academic Excellence, Moral Values',
    features: ['Science Lab', 'Library', 'Sports Ground'],
    scholarships: [],
    vacancies: VACANCIES.filter(v => v.schoolId === 'ms'),
    students: '750+', established: 1998,
    address: '23 Aguiyi-Ironsi Street, Maitama, Abuja',
    phone: '+234 809 456 7890', email: 'info@modelschools.edu.ng',
  },
  {
    id: 'rb', name: 'Rainbow Nursery & Primary',
    city: 'Wuse II, Abuja', state: 'FCT',
    type: 'Day', gender: 'Mixed', levels: 'Nursery–Primary',
    orientation: 'Non-denominational', transport: true, boarding: false,
    rating: 4.6, reviews: 74, verified: true,
    feeFrom: 28_000_000, feeTo: 48_000_000,
    color: '#D4591A', hue: hexToHue('#D4591A'),
    tagline: 'Every Child Counts',
    features: ['Computer Lab', 'Library', 'Playground', 'Transport'],
    scholarships: [],
    vacancies: VACANCIES.filter(v => v.schoolId === 'rb'),
    students: '300+', established: 2014,
    address: '8 Amaechi Street, Wuse II, Abuja',
    phone: '+234 803 234 5678', email: 'info@rainbownursery.edu.ng',
  },
  {
    id: 'cv', name: 'Covenant Academy',
    city: 'Lugbe, Abuja', state: 'FCT',
    type: 'Day', gender: 'Mixed', levels: 'Nursery–SSS',
    orientation: 'Christian', transport: true, boarding: false,
    rating: 4.4, reviews: 98, verified: true,
    feeFrom: 32_000_000, feeTo: 64_000_000,
    color: '#7C3AED', hue: hexToHue('#7C3AED'),
    tagline: 'Faith, Knowledge, Excellence',
    features: ['Science Lab', 'Library', 'Sports Ground', 'Transport'],
    scholarships: [
      { title: 'Faith & Excellence Bursary', value: '₦180,000/term', provider: 'Covenant Church Education Fund', slots: 4, deadline: '31 Jul 2026', criteria: 'Financial need, good conduct record, church membership' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'cv'),
    students: '500+', established: 2009,
    address: 'Block C, Lugbe Extension, Abuja',
    phone: '+234 807 345 6789', email: 'info@covenantacademy.edu.ng',
  },
  {
    id: 'li', name: 'Lagos International School', ktPlan: 'Premium',
    city: 'Victoria Island', state: 'Lagos',
    type: 'Day', gender: 'Mixed', levels: 'Nursery–SSS',
    orientation: 'Non-denominational', transport: false, boarding: false,
    rating: 4.9, reviews: 341, verified: true,
    feeFrom: 68_000_000, feeTo: 140_000_000,
    color: '#C41E3A', hue: hexToHue('#C41E3A'),
    tagline: 'International Standards, Local Excellence',
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'Swimming Pool', 'Cafeteria'],
    scholarships: [
      { title: 'Academic Excellence Award',   value: '100% tuition',  provider: 'LIS Founders Trust',       slots: 3, deadline: '20 Aug 2026', criteria: 'Top-ranked BECE or JSSCE result, leadership record' },
      { title: 'Sports Scholarship',           value: '50% tuition',   provider: 'LIS Sports Committee',     slots: 6, deadline: '15 Aug 2026', criteria: 'National or state-level athlete, 60%+ academic average' },
      { title: 'Girls in STEM Scholarship',    value: '100% tuition',  provider: 'TechBridge Nigeria',       slots: 4, deadline: '20 Aug 2026', criteria: 'Female student, Maths & Science above 75%, SSS entry' },
      { title: 'Community Access Bursary',     value: '₦400,000/term', provider: 'LIS Alumni Association',   slots: 5, deadline: '1 Sep 2026',  criteria: 'Financial need demonstrated, strong academic record' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'li'),
    students: '1,200+', established: 1995,
    address: '14 Adeola Odeku Street, Victoria Island, Lagos',
    phone: '+234 812 456 7890', email: 'info@lagosintl.edu.ng',
  },
  {
    id: 'hil', name: 'Hillcrest School', ktPlan: 'Premium',
    city: 'Jos, Plateau', state: 'Plateau',
    type: 'Day & Boarding', gender: 'Mixed', levels: 'Primary–SSS',
    orientation: 'Christian', transport: false, boarding: true,
    rating: 4.6, reviews: 188, verified: true,
    feeFrom: 48_000_000, feeTo: 76_000_000,
    color: '#0D9D8A', hue: hexToHue('#0D9D8A'),
    tagline: 'Nurturing Global Citizens',
    features: ['Science Lab', 'Computer Lab', 'Library', 'Sports Ground', 'Boarding House', 'Chapel'],
    scholarships: [
      { title: 'Academic Excellence Bursary', value: '₦250,000/term', provider: 'Hillcrest Alumni Foundation', slots: 3, deadline: '31 Jul 2026', criteria: 'Top 5% of class, financial need demonstrated' },
      { title: 'Global Citizens Scholarship',  value: '40% tuition',   provider: 'SIM International',          slots: 2, deadline: '15 Aug 2026', criteria: 'Missionary family or cross-cultural service background' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'hil'),
    students: '700+', established: 1962,
    address: 'Hillcrest Road, Jos South, Plateau State',
    phone: '+234 808 567 8901', email: 'info@hillcrest.edu.ng',
  },
  {
    id: 'pac', name: 'Pacelli School for the Blind',
    city: 'Surulere, Lagos', state: 'Lagos',
    type: 'Day & Boarding', gender: 'Mixed', levels: 'Primary–SSS',
    orientation: 'Christian', transport: true, boarding: true,
    rating: 4.7, reviews: 64, verified: true,
    feeFrom: 32_000_000, feeTo: 58_000_000,
    color: '#6B3FA0', hue: hexToHue('#6B3FA0'),
    tagline: 'Empowering the Visually Impaired',
    features: ['Braille Library', 'Mobility Training', 'Music Room', 'Boarding House', 'Medical Unit'],
    scholarships: [
      { title: 'Visual Impairment Support Bursary', value: '100% tuition',  provider: 'CBM Nigeria',                  slots: 5, deadline: '31 Aug 2026', criteria: 'Clinically certified visual impairment, financial need' },
      { title: 'Ministry of Education Grant',        value: '₦200,000/term', provider: 'Lagos State MoE',              slots: 4, deadline: '15 Aug 2026', criteria: 'Lagos State resident, certified disability status' },
      { title: 'Pacelli Alumni Bursary',             value: '₦150,000/term', provider: 'Pacelli Old Students Association', slots: 3, deadline: '1 Sep 2026', criteria: 'Financial need, good academic standing' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'pac'),
    students: '220+', established: 1975,
    address: 'Surulere, Lagos',
    phone: '+234 801 234 5670', email: 'info@pacelli.edu.ng',
    special: true, specialFocus: ['Visual impairment', 'Low vision'],
  },
  {
    id: 'sfd', name: 'FCT School for the Deaf',
    city: 'Karu, Abuja', state: 'FCT',
    type: 'Day', gender: 'Mixed', levels: 'Nursery–SSS',
    orientation: 'Non-denominational', transport: true, boarding: false,
    rating: 4.5, reviews: 41, verified: true,
    feeFrom: 28_000_000, feeTo: 50_000_000,
    color: '#2A6FDB', hue: hexToHue('#2A6FDB'),
    tagline: 'Communication Without Barriers',
    features: ['Sign Language Studio', 'Computer Lab', 'Sports Ground', 'Transport', 'Speech Therapy'],
    scholarships: [
      { title: 'Hearing Impairment Support Grant', value: '100% tuition',  provider: 'CBM Nigeria',       slots: 6, deadline: '31 Aug 2026', criteria: 'Clinically certified hearing impairment, financial need' },
      { title: 'FCT Education Bursary',            value: '₦180,000/term', provider: 'FCT Education Board', slots: 4, deadline: '15 Aug 2026', criteria: 'FCT resident, certified disability status' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'sfd'),
    students: '180+', established: 1989,
    address: 'Karu District, Abuja',
    phone: '+234 802 345 6781', email: 'info@fctdeafschool.edu.ng',
    special: true, specialFocus: ['Hearing impairment', 'Speech & language'],
  },
  {
    id: 'sts', name: 'Stepping Stones Special School',
    city: 'Ikeja, Lagos', state: 'Lagos',
    type: 'Day', gender: 'Mixed', levels: 'Nursery–Primary',
    orientation: 'Non-denominational', transport: true, boarding: false,
    rating: 4.8, reviews: 88, verified: true,
    feeFrom: 38_000_000, feeTo: 62_000_000,
    color: '#D97757', hue: hexToHue('#D97757'),
    tagline: 'Every Child Can Learn',
    features: ['Therapy Rooms', 'Sensory Room', 'Computer Lab', 'Transport', 'Small Class Sizes'],
    scholarships: [
      { title: 'Learning Differences Bursary', value: '₦200,000/term', provider: 'Stepping Stones Foundation', slots: 4, deadline: '31 Aug 2026', criteria: 'Documented learning difference (dyslexia, ADHD, autism etc.), financial need' },
    ],
    vacancies: VACANCIES.filter(v => v.schoolId === 'sts'),
    students: '120+', established: 2005,
    address: 'Ikeja, Lagos',
    phone: '+234 803 456 7892', email: 'info@steppingstones.edu.ng',
    special: true, specialFocus: ['Dyslexia', 'Dyscalculia', 'ADHD', 'Autism', 'Cerebral Palsy'],
  },
] as School[]);

// Populate deprecated compat aliases so existing components continue to compile
// without modification until they are migrated to the new field names.
SCHOOLS.forEach((s) => {
  s.location = `${s.city}, ${s.state}`;
  s.feeFromKobo = s.feeFrom;
  s.badge = s.ktPlan === 'Premium' ? 'premium' : s.ktPlan === 'Standard' ? 'standard' : null;
  s.facilities = s.features;
  s.specialNeeds = s.special ?? false;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const getSchool = (id: string): School | null =>
  SCHOOLS.find((s) => s.id === id) ?? null;

/** Format kobo integer to naira display string */
export const naira = (kobo: number): string =>
  `₦${Math.round(kobo / 100).toLocaleString()}`;

export const topRated = (): School[] =>
  [...SCHOOLS].sort((a, b) => b.rating - a.rating).slice(0, 4);

export const withScholarships = (): School[] =>
  SCHOOLS.filter((s) => s.scholarships.length > 0);

export const hiring = (): School[] =>
  SCHOOLS.filter((s) => s.vacancies.length > 0);

export const specialNeedsSchools = (): School[] =>
  SCHOOLS.filter((s) => s.special === true);

export const getVacancies = (): Vacancy[] => VACANCIES;

export const getVacanciesBySchool = (schoolId: string): Vacancy[] =>
  VACANCIES.filter((v) => v.schoolId === schoolId);
