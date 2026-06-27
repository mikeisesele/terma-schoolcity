export type Campus = {
  name: string;
  address: string;
  city: string;
  phone?: string;
};

export type School = {
  id: string; name: string; ktPlan?: string; city: string; state: string;
  type: string; gender: string; levels: string; orientation: string;
  transport: boolean; boarding: boolean; rating: number; reviews: number;
  verified: boolean; feeFrom: number; feeTo: number; color: string;
  tagline: string; features: string[]; scholarships: number; vacancies: number;
  students: string; established: number; address: string; phone: string;
  email: string; special?: boolean; specialFocus?: string[];
  campuses?: Campus[];
  bannerUrl?: string;
  imageUrl?: string;
  facilityImages?: Record<string, string[]>;
};

// Shared facility image pools by category
const FI = {
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

export const SN_SCHOOLS: School[] = [
  {
    id:'gf', name:'Greenfield International School', ktPlan:'Premium',
    city:'Gwarinpa, Abuja', state:'FCT', type:'Day', gender:'Mixed', levels:'Nursery–SSS',
    orientation:'Christian', transport:true, boarding:false, rating:4.8, reviews:127, verified:true,
    feeFrom:380000, feeTo:780000, color:'#1A3D2C', tagline:'Excellence in Education',
    features:['Science Lab','Computer Lab','Sports Ground','Transport','Library','Sick Bay'],
    scholarships:4, vacancies:2, students:'600+', established:2007,
    address:'Plot 12, Gwarinpa Estate, Abuja', phone:'+234 803 441 0001', email:'info@greenfield.edu.ng',
    bannerUrl:'/schools/banner1.png',
    imageUrl:'/schools/banner1.png',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Transport': FI.transport,
      'Sick Bay': FI.academic,
    },
    campuses:[
      { name:'Gwarinpa Campus', address:'Plot 12, Gwarinpa Estate, Abuja', city:'Gwarinpa, Abuja', phone:'+234 803 441 0001' },
      { name:'Wuse II Campus',  address:'No. 5 Wole Soyinka Street, Wuse II, Abuja', city:'Wuse II, Abuja', phone:'+234 803 441 0002' },
      { name:'Kado Campus',     address:'Block B, Kado Estate, Kado, Abuja', city:'Kado, Abuja', phone:'+234 803 441 0003' },
    ],
  },
  {
    id:'hc', name:'Heritage College', ktPlan:'Standard',
    city:'Jabi, Abuja', state:'FCT', type:'Day & Boarding', gender:'Mixed', levels:'JSS–SSS',
    orientation:'Christian', transport:true, boarding:true, rating:4.7, reviews:212, verified:true,
    feeFrom:520000, feeTo:820000, color:'#2A6FDB', tagline:'Where Character Meets Excellence',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Boarding House','Chapel'],
    scholarships:3, vacancies:1, students:'800+', established:2003,
    address:'7 Jabi Lake Road, Jabi, Abuja', phone:'+234 805 987 6543', email:'info@heritagecollege.edu.ng',
    bannerUrl:'/schools/banner2.jpg',
    imageUrl:'/schools/banner2.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Boarding House': FI.hostel,
      'Chapel': FI.religion,
    },
  },
  {
    id:'sa', name:'Sunrise Academy', ktPlan:'Standard',
    city:'Garki, Abuja', state:'FCT', type:'Day', gender:'Mixed', levels:'Primary–SSS',
    orientation:'Non-denominational', transport:true, boarding:false, rating:4.5, reviews:89, verified:true,
    feeFrom:420000, feeTo:680000, color:'#B87D20', tagline:"Raising Tomorrow's Leaders",
    features:['Computer Lab','Library','Sports Ground','Transport'],
    scholarships:1, vacancies:0, students:'450+', established:2011,
    address:'15 Aminu Kano Crescent, Garki II, Abuja', phone:'+234 802 123 4567', email:'info@sunriseacademy.edu.ng',
    bannerUrl:'/schools/banner3.jpg',
    imageUrl:'/schools/banner3.jpg',
    facilityImages:{
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Transport': FI.transport,
    },
    campuses:[
      { name:'Garki Campus',   address:'15 Aminu Kano Crescent, Garki II, Abuja', city:'Garki, Abuja', phone:'+234 802 123 4567' },
      { name:'Maitama Campus', address:'22 Panama Street, Maitama, Abuja', city:'Maitama, Abuja', phone:'+234 802 123 4568' },
    ],
  },
  {
    id:'ms', name:'Model Schools FCT',
    city:'Maitama, Abuja', state:'FCT', type:'Day', gender:'Mixed', levels:'Primary–SSS',
    orientation:'Multi-faith', transport:false, boarding:false, rating:4.3, reviews:156, verified:true,
    feeFrom:350000, feeTo:620000, color:'#1F8A5B', tagline:'Academic Excellence, Moral Values',
    features:['Science Lab','Library','Sports Ground'],
    scholarships:0, vacancies:3, students:'750+', established:1998,
    address:'23 Aguiyi-Ironsi Street, Maitama, Abuja', phone:'+234 809 456 7890', email:'info@modelschools.edu.ng',
    bannerUrl:'/schools/banner4.png',
    imageUrl:'/schools/banner4.png',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
    },
  },
  {
    id:'rb', name:'Rainbow Nursery & Primary',
    city:'Wuse II, Abuja', state:'FCT', type:'Day', gender:'Mixed', levels:'Nursery–Primary',
    orientation:'Non-denominational', transport:true, boarding:false, rating:4.6, reviews:74, verified:true,
    feeFrom:280000, feeTo:480000, color:'#D4591A', tagline:'Every Child Counts',
    features:['Computer Lab','Library','Playground','Transport'],
    scholarships:0, vacancies:1, students:'300+', established:2014,
    address:'8 Amaechi Street, Wuse II, Abuja', phone:'+234 803 234 5678', email:'info@rainbownursery.edu.ng',
    bannerUrl:'/schools/bannery-nurseryschool.jpg',
    imageUrl:'/schools/bannery-nurseryschool.jpg',
    facilityImages:{
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Playground': FI.nursery,
      'Transport': FI.transport,
    },
  },
  {
    id:'cv', name:'Covenant Academy',
    city:'Lugbe, Abuja', state:'FCT', type:'Day', gender:'Mixed', levels:'Nursery–SSS',
    orientation:'Christian', transport:true, boarding:false, rating:4.4, reviews:98, verified:true,
    feeFrom:320000, feeTo:640000, color:'#7C3AED', tagline:'Faith, Knowledge, Excellence',
    features:['Science Lab','Library','Sports Ground','Transport'],
    scholarships:1, vacancies:2, students:'500+', established:2009,
    address:'Block C, Lugbe Extension, Abuja', phone:'+234 807 345 6789', email:'info@covenantacademy.edu.ng',
    bannerUrl:'/schools/banner5.jpg',
    imageUrl:'/schools/banner5.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Transport': FI.transport,
    },
  },
  {
    id:'li', name:'Lagos International School', ktPlan:'Premium',
    city:'Victoria Island', state:'Lagos', type:'Day', gender:'Mixed', levels:'Nursery–SSS',
    orientation:'Non-denominational', transport:false, boarding:false, rating:4.9, reviews:341, verified:true,
    feeFrom:680000, feeTo:1400000, color:'#C41E3A', tagline:'International Standards, Local Excellence',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Swimming Pool','Cafeteria'],
    scholarships:4, vacancies:5, students:'1,200+', established:1995,
    address:'14 Adeola Odeku Street, Victoria Island, Lagos', phone:'+234 812 456 7890', email:'info@lagosintl.edu.ng',
    bannerUrl:'/schools/banner6.png',
    imageUrl:'/schools/banner6.png',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Swimming Pool': FI.swimming,
      'Cafeteria': FI.life,
    },
    campuses:[
      { name:'Victoria Island Campus', address:'14 Adeola Odeku Street, Victoria Island, Lagos', city:'Victoria Island, Lagos', phone:'+234 812 456 7890' },
      { name:'Lekki Campus',           address:'Plot 45, Freedom Way, Lekki Phase 1, Lagos',     city:'Lekki, Lagos',            phone:'+234 812 456 7891' },
      { name:'Abuja Campus',           address:'No. 3 Udi Hills Street, Asokoro, Abuja',         city:'Asokoro, Abuja',          phone:'+234 812 456 7892' },
    ],
  },
  {
    id:'hil', name:'Hillcrest School', ktPlan:'Premium',
    city:'Jos, Plateau', state:'Plateau', type:'Day & Boarding', gender:'Mixed', levels:'Primary–SSS',
    orientation:'Christian', transport:false, boarding:true, rating:4.6, reviews:188, verified:true,
    feeFrom:480000, feeTo:760000, color:'#0D9D8A', tagline:'Nurturing Global Citizens',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Boarding House','Chapel'],
    scholarships:2, vacancies:1, students:'700+', established:1962,
    address:'Hillcrest Road, Jos South, Plateau State', phone:'+234 808 567 8901', email:'info@hillcrest.edu.ng',
    bannerUrl:'/schools/banner7.jpg',
    imageUrl:'/schools/banner7.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Boarding House': FI.hostel,
      'Chapel': FI.religion,
    },
  },
  {
    id:'ka', name:"King's College Lagos",
    city:'Lagos Island', state:'Lagos', type:'Boarding', gender:'Boys', levels:'JSS–SSS',
    orientation:'Non-denominational', transport:false, boarding:true, rating:4.7, reviews:294, verified:true,
    feeFrom:350000, feeTo:650000, color:'#1E3A5F', tagline:'Tradition of Excellence Since 1909',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Boarding House','Music Room'],
    scholarships:3, vacancies:2, students:'1,100+', established:1909,
    address:'6 Kings College Road, Lagos Island, Lagos', phone:'+234 813 456 7891', email:'info@kingscollegelagos.edu.ng',
    bannerUrl:'/schools/banner9-all-boys-school.jpg',
    imageUrl:'/schools/banner9-all-boys-school.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Boarding House': FI.hostel,
      'Music Room': FI.music,
    },
  },
  {
    id:'qc', name:'Queens College Lagos',
    city:'Yaba, Lagos', state:'Lagos', type:'Boarding', gender:'Girls', levels:'JSS–SSS',
    orientation:'Non-denominational', transport:false, boarding:true, rating:4.6, reviews:267, verified:true,
    feeFrom:320000, feeTo:580000, color:'#9D174D', tagline:'Raising Queens, Building the Nation',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Boarding House','Music Room'],
    scholarships:2, vacancies:3, students:'1,000+', established:1927,
    address:'Sabo, Yaba, Lagos State', phone:'+234 802 567 8912', email:'info@queenscollegelagos.edu.ng',
    bannerUrl:'/schools/banner10.jpg',
    imageUrl:'/schools/banner10.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Boarding House': FI.hostel,
      'Music Room': FI.music,
    },
  },
  {
    id:'bca', name:'Bingham Academy',
    city:'Karu, Abuja', state:'FCT', type:'Day & Boarding', gender:'Mixed', levels:'Primary–SSS',
    orientation:'Christian', transport:true, boarding:true, rating:4.5, reviews:143, verified:true,
    feeFrom:440000, feeTo:720000, color:'#7A4A00', tagline:'Excellence with Faith',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Boarding House','Chapel','Swimming Pool'],
    scholarships:2, vacancies:4, students:'650+', established:1978,
    address:'Karu-Mararaba Road, Karu, Abuja', phone:'+234 806 789 0123', email:'info@binghamacademy.edu.ng',
    bannerUrl:'/schools/banner11.jpg',
    imageUrl:'/schools/banner11.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Boarding House': FI.hostel,
      'Swimming Pool': FI.swimming,
    },
  },
  {
    id:'ld', name:'Ladela Schools', ktPlan:'Standard',
    city:'Surulere, Lagos', state:'Lagos', type:'Day', gender:'Mixed', levels:'Nursery–SSS',
    orientation:'Christian', transport:true, boarding:false, rating:4.5, reviews:0, verified:false,
    feeFrom:380000, feeTo:720000, color:'#065F46', tagline:'Grooming Leaders of Tomorrow',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Transport','Music Room'],
    scholarships:1, vacancies:2, students:'550+', established:2006,
    address:'14 Adeniran Ogunsanya Street, Surulere, Lagos', phone:'+234 807 890 1234', email:'info@ladelaschools.edu.ng',
    bannerUrl:'/schools/banner12.jpg',
    imageUrl:'/schools/banner12.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Transport': FI.transport,
      'Music Room': FI.music,
    },
  },
  {
    id:'hic', name:'Heritage International College',
    city:'Ibadan', state:'Oyo', type:'Day & Boarding', gender:'Mixed', levels:'Nursery–SSS',
    orientation:'Non-denominational', transport:true, boarding:true, rating:4.5, reviews:0, verified:false,
    feeFrom:350000, feeTo:680000, color:'#374151', tagline:'Cultivating Excellence in Every Child',
    features:['Science Lab','Computer Lab','Library','Sports Ground','Boarding House','Transport'],
    scholarships:0, vacancies:0, students:'400+', established:2010,
    address:'Ring Road, Ibadan, Oyo State', phone:'+234 805 901 2345', email:'info@heritagecollege-ibadan.edu.ng',
    bannerUrl:'/schools/banner13.jpg',
    imageUrl:'/schools/banner13.jpg',
    facilityImages:{
      'Science Lab': FI.scienceLab,
      'Computer Lab': FI.computerLab,
      'Library': FI.library,
      'Sports Ground': FI.sports,
      'Boarding House': FI.hostel,
      'Transport': FI.transport,
    },
  },
  {
    id:'pac', name:'Pacelli School for the Blind',
    city:'Surulere, Lagos', state:'Lagos', type:'Day & Boarding', gender:'Mixed', levels:'Primary–SSS',
    orientation:'Christian', transport:true, boarding:true, rating:4.7, reviews:64, verified:true,
    feeFrom:320000, feeTo:580000, color:'#6B3FA0', tagline:'Empowering the Visually Impaired',
    features:['Braille Library','Mobility Training','Music Room','Boarding House','Medical Unit'],
    scholarships:3, vacancies:1, students:'220+', established:1975,
    address:'Surulere, Lagos', phone:'+234 801 234 5670', email:'info@pacelli.edu.ng',
    special:true, specialFocus:['Visual impairment','Low vision'],
    bannerUrl:'/schools/banner14.jpg',
    imageUrl:'/schools/banner14.jpg',
    facilityImages:{
      'Boarding House': FI.hostel,
      'Music Room': FI.music,
    },
  },
  {
    id:'sfd', name:'FCT School for the Deaf',
    city:'Karu, Abuja', state:'FCT', type:'Day', gender:'Mixed', levels:'Nursery–SSS',
    orientation:'Non-denominational', transport:true, boarding:false, rating:4.5, reviews:41, verified:true,
    feeFrom:280000, feeTo:500000, color:'#2A6FDB', tagline:'Communication Without Barriers',
    features:['Sign Language Studio','Computer Lab','Sports Ground','Transport','Speech Therapy'],
    scholarships:2, vacancies:2, students:'180+', established:1989,
    address:'Karu District, Abuja', phone:'+234 802 345 6781', email:'info@fctdeafschool.edu.ng',
    special:true, specialFocus:['Hearing impairment','Speech & language'],
    bannerUrl:'/schools/banner15.jpg',
    imageUrl:'/schools/banner15.jpg',
    facilityImages:{
      'Computer Lab': FI.computerLab,
      'Sports Ground': FI.sports,
      'Transport': FI.transport,
    },
  },
  {
    id:'sts', name:'Stepping Stones Special School',
    city:'Ikeja, Lagos', state:'Lagos', type:'Day', gender:'Mixed', levels:'Nursery–Primary',
    orientation:'Non-denominational', transport:true, boarding:false, rating:4.8, reviews:88, verified:true,
    feeFrom:380000, feeTo:620000, color:'#D97757', tagline:'Every Child Can Learn',
    features:['Therapy Rooms','Sensory Room','Computer Lab','Transport','Small Class Sizes'],
    scholarships:1, vacancies:1, students:'120+', established:2005,
    address:'Ikeja, Lagos', phone:'+234 803 456 7892', email:'info@steppingstones.edu.ng',
    special:true, specialFocus:['Dyslexia','Dyscalculia','ADHD','Autism','Cerebral Palsy'],
    bannerUrl:'/schools/banner16.jpg',
    imageUrl:'/schools/banner16.jpg',
    facilityImages:{
      'Computer Lab': FI.computerLab,
      'Transport': FI.transport,
    },
  },
];

export const FEATURED_IDS = ['gf','li','hc','ka','hil','bca','sa','qc'];
export const CAROUSEL     = SN_SCHOOLS.filter(s => FEATURED_IDS.includes(s.id));
export const HIGHLY_RATED = [...SN_SCHOOLS].filter(s => !s.special).sort((a,b) => b.rating - a.rating).slice(0,6);

export const MOCK_REVIEWS = [
  { name:'Mrs A. O.', rating:5, date:'May 2026', text:'Excellent school! My children have thrived here. The teachers are dedicated and communication with parents is superb.', tag:'Academic quality' },
  { name:'Mr T. F.',  rating:4, date:'Apr 2026', text:'Very good school overall. The bus service is reliable and the staff are responsive. The science lab impressed me the most.', tag:'Transport & safety' },
  { name:'Mrs Z. S.', rating:5, date:'Mar 2026', text:'My daughter has grown so much academically and in character. The teachers really care. Highly recommended.', tag:'Character development' },
  { name:'Mr E. N.',  rating:4, date:'Feb 2026', text:'Fees are reasonable for the quality of education. I wish there were more extracurricular activities but the core academics are excellent.', tag:'Value for money' },
  { name:'Mrs C. A.', rating:5, date:'Jan 2026', text:'Safe environment, great facilities, wonderful teachers. My son loves going to school every day. The PTA is also very active.', tag:'School environment' },
  { name:'Mr D. O.',  rating:3, date:'Dec 2025', text:'Good school but the dining food could be better. Teachers are hardworking and results are consistently strong.', tag:'Facilities' },
];

export const SN_PARENT_FEATURES = [
  { emoji:'📊', title:'Results, instantly', text:'CA scores, exams, class standing, and term report cards — on your phone the moment they are published. No printing. No waiting.' },
  { emoji:'💬', title:'School communication that works', text:"Targeted announcements for your child's class. Absence notes in two taps. No WhatsApp groups. No lost messages." },
  { emoji:'📅', title:'Attendance and calendar', text:'See every day your child was present, absent, or excused. School events, PTA dates, and exam schedules in one calendar.' },
  { emoji:'💳', title:'Fee payments and receipts', text:'Pay full or part from your phone. Siblings combined. Instant receipts. Complete payment history.' },
  { emoji:'🔔', title:'Pickup confirmation', text:'Every pickup verified with a 4-digit code. Medical alerts visible to the driver at handover.' },
  { emoji:'🚌', title:'Live bus tracking', text:'See the bus on a map. Get notified when your child boards and when they arrive — for families on the school bus.' },
];

export type Vacancy = {
  id: string; sId: string; sName: string; sColor: string; city: string; state: string;
  title: string; dept: string; type: string; deadline: string; summary: string; applyEmail: string;
};

export const SN_VACANCIES: Vacancy[] = [
  { id:'v1',  sId:'gf',  sName:'Greenfield International School', sColor:'#1A3D2C', city:'Gwarinpa, Abuja', state:'FCT', title:'Mathematics Teacher (SSS)', dept:'Secondary – Academic', type:'Full-time', deadline:'30 Jul 2026', summary:'TRCN-registered Maths teacher for SSS 1–3. Strong classroom management required.', applyEmail:'careers@greenfield.edu.ng' },
  { id:'v2',  sId:'gf',  sName:'Greenfield International School', sColor:'#1A3D2C', city:'Gwarinpa, Abuja', state:'FCT', title:'Basic Science Teacher (JSS)', dept:'Secondary – Academic', type:'Full-time', deadline:'25 Jul 2026', summary:'Passionate science teacher for JSS 1–3 with lab supervision experience.', applyEmail:'careers@greenfield.edu.ng' },
  { id:'v3',  sId:'hc',  sName:'Heritage College', sColor:'#2A6FDB', city:'Jabi, Abuja', state:'FCT', title:'School Librarian', dept:'Non-academic / Support', type:'Full-time', deadline:'20 Jul 2026', summary:'Manage school library, catalogue new acquisitions, support reading programme.', applyEmail:'hr@heritagecollege.edu.ng' },
  { id:'v4',  sId:'ms',  sName:'Model Schools FCT', sColor:'#1F8A5B', city:'Maitama, Abuja', state:'FCT', title:'ICT Coordinator', dept:'Administration', type:'Full-time', deadline:'15 Jul 2026', summary:'Oversee computer lab, school ICT infrastructure and digital learning resources.', applyEmail:'admin@modelschools.edu.ng' },
  { id:'v5',  sId:'ms',  sName:'Model Schools FCT', sColor:'#1F8A5B', city:'Maitama, Abuja', state:'FCT', title:'English Language Teacher', dept:'Secondary – Academic', type:'Full-time', deadline:'10 Aug 2026', summary:'WAEC-focused English teaching for JSS and SSS. 3+ years required.', applyEmail:'admin@modelschools.edu.ng' },
  { id:'v6',  sId:'ms',  sName:'Model Schools FCT', sColor:'#1F8A5B', city:'Maitama, Abuja', state:'FCT', title:'School Accountant', dept:'Administration', type:'Full-time', deadline:'5 Aug 2026', summary:'Fee reconciliation, payroll processing and monthly financial reporting.', applyEmail:'admin@modelschools.edu.ng' },
  { id:'v7',  sId:'rb',  sName:'Rainbow Nursery & Primary', sColor:'#D4591A', city:'Wuse II, Abuja', state:'FCT', title:'Nursery Class Teacher', dept:'Nursery – Academic', type:'Full-time', deadline:'1 Aug 2026', summary:'Caring teacher for Pre-Nursery/Nursery 1–2. Montessori experience preferred.', applyEmail:'jobs@rainbownursery.edu.ng' },
  { id:'v8',  sId:'cv',  sName:'Covenant Academy', sColor:'#7C3AED', city:'Lugbe, Abuja', state:'FCT', title:'Physical Education Teacher', dept:'Secondary – Academic', type:'Full-time', deadline:'25 Jul 2026', summary:'Deliver PE curriculum JSS–SSS, coach school sports teams and inter-house events.', applyEmail:'hr@covenantacademy.edu.ng' },
  { id:'v9',  sId:'cv',  sName:'Covenant Academy', sColor:'#7C3AED', city:'Lugbe, Abuja', state:'FCT', title:'School Nurse', dept:'Non-academic / Support', type:'Full-time', deadline:'18 Jul 2026', summary:'Manage sick bay, administer first aid, maintain student health records.', applyEmail:'hr@covenantacademy.edu.ng' },
  { id:'v10', sId:'li',  sName:'Lagos International School', sColor:'#C41E3A', city:'Victoria Island', state:'Lagos', title:'Head of Science Department', dept:'Secondary – Academic', type:'Full-time', deadline:'15 Aug 2026', summary:'Lead Science dept, mentor teachers, coordinate WAEC/NECO preparations.', applyEmail:'recruitment@lagosintl.edu.ng' },
  { id:'v11', sId:'li',  sName:'Lagos International School', sColor:'#C41E3A', city:'Victoria Island', state:'Lagos', title:'IT Systems Administrator', dept:'Administration', type:'Full-time', deadline:'20 Aug 2026', summary:'Maintain school network, servers, student devices and digital infrastructure.', applyEmail:'recruitment@lagosintl.edu.ng' },
  { id:'v12', sId:'li',  sName:'Lagos International School', sColor:'#C41E3A', city:'Victoria Island', state:'Lagos', title:'French Teacher (JSS + SSS)', dept:'Secondary – Academic', type:'Part-time', deadline:'10 Aug 2026', summary:'Deliver French curriculum and prepare students for WAEC French paper.', applyEmail:'recruitment@lagosintl.edu.ng' },
  { id:'v13', sId:'hil', sName:'Hillcrest School', sColor:'#0D9D8A', city:'Jos, Plateau', state:'Plateau', title:'Boarding House Master', dept:'Non-academic / Support', type:'Full-time', deadline:'5 Aug 2026', summary:'Supervise boarding students, enforce house rules, support student welfare. Residential.', applyEmail:'staffing@hillcrest.edu.ng' },
  { id:'v14', sId:'ka',  sName:"King's College Lagos", sColor:'#1E3A5F', city:'Lagos Island', state:'Lagos', title:'History Teacher (JSS–SSS)', dept:'Secondary – Academic', type:'Full-time', deadline:'28 Jul 2026', summary:'Experienced History teacher for JSS and SSS with strong WAEC results record.', applyEmail:'hr@kingscollegelagos.edu.ng' },
  { id:'v15', sId:'ka',  sName:"King's College Lagos", sColor:'#1E3A5F', city:'Lagos Island', state:'Lagos', title:'Music Director', dept:'Non-academic / Support', type:'Full-time', deadline:'1 Aug 2026', summary:'Lead school music programme, coordinate choir, band and cultural activities.', applyEmail:'hr@kingscollegelagos.edu.ng' },
  { id:'v16', sId:'bca', sName:'Bingham Academy', sColor:'#7A4A00', city:'Karu, Abuja', state:'FCT', title:'Chemistry Teacher', dept:'Secondary – Academic', type:'Full-time', deadline:'20 Aug 2026', summary:'TRCN-registered Chemistry teacher. Lab supervision and safety compliance required.', applyEmail:'jobs@binghamacademy.edu.ng' },
  { id:'v17', sId:'bca', sName:'Bingham Academy', sColor:'#7A4A00', city:'Karu, Abuja', state:'FCT', title:'Counsellor', dept:'Non-academic / Support', type:'Full-time', deadline:'15 Aug 2026', summary:'Student guidance and counselling — academic, emotional and career support.', applyEmail:'jobs@binghamacademy.edu.ng' },
  { id:'v18', sId:'bca', sName:'Bingham Academy', sColor:'#7A4A00', city:'Karu, Abuja', state:'FCT', title:'Swimming Coach', dept:'Non-academic / Support', type:'Part-time', deadline:'10 Aug 2026', summary:'Train school swim team, manage pool safety and inter-school swim competitions.', applyEmail:'jobs@binghamacademy.edu.ng' },
  { id:'v19', sId:'ld',  sName:'Ladela Schools', sColor:'#065F46', city:'Surulere, Lagos', state:'Lagos', title:'Primary Class Teacher (Yr 4–6)', dept:'Primary – Academic', type:'Full-time', deadline:'5 Aug 2026', summary:'Experienced primary teacher for upper primary classes, strong literacy focus.', applyEmail:'careers@ladelaschools.edu.ng' },
  { id:'v20', sId:'ld',  sName:'Ladela Schools', sColor:'#065F46', city:'Surulere, Lagos', state:'Lagos', title:'Vice Principal (Academics)', dept:'Administration', type:'Full-time', deadline:'30 Jul 2026', summary:'Oversee academic programmes, timetable and teacher performance management.', applyEmail:'careers@ladelaschools.edu.ng' },
  { id:'v21', sId:'sfd', sName:'FCT School for the Deaf', sColor:'#2A6FDB', city:'Karu, Abuja', state:'FCT', title:'Sign Language Interpreter', dept:'Non-academic / Support', type:'Full-time', deadline:'28 Jul 2026', summary:'BSL/NSL interpretation across classrooms and school events.', applyEmail:'hr@fctdeafschool.edu.ng' },
  { id:'v22', sId:'sfd', sName:'FCT School for the Deaf', sColor:'#2A6FDB', city:'Karu, Abuja', state:'FCT', title:'Speech Therapist', dept:'Non-academic / Support', type:'Contract', deadline:'15 Aug 2026', summary:'Weekly speech therapy sessions for students with hearing and speech challenges.', applyEmail:'hr@fctdeafschool.edu.ng' },
  { id:'v23', sId:'sts', sName:'Stepping Stones Special School', sColor:'#D97757', city:'Ikeja, Lagos', state:'Lagos', title:'Special Education Teacher (Dyslexia)', dept:'Primary – Academic', type:'Full-time', deadline:'20 Aug 2026', summary:'Personalised learning for students with dyslexia and reading difficulties.', applyEmail:'jobs@steppingstones.edu.ng' },
  { id:'v24', sId:'pac', sName:'Pacelli School for the Blind', sColor:'#6B3FA0', city:'Surulere, Lagos', state:'Lagos', title:'Braille Instructor', dept:'Non-academic / Support', type:'Full-time', deadline:'1 Sep 2026', summary:'Teach Grade 1 & 2 Braille reading and writing to visually impaired students.', applyEmail:'staff@pacelli.edu.ng' },
];

export const V_DEPTS   = ['All departments','Secondary – Academic','Primary – Academic','Nursery – Academic','Administration','Non-academic / Support'];
export const V_TYPES   = ['All','Full-time','Part-time','Contract'];
export const V_TYPE_CLR: Record<string,string> = { 'Full-time':'#1F8A5B','Part-time':'#2A6FDB','Contract':'#D97706' };
export const V_SPEC_IDS = ['pac','sfd','sts'];
