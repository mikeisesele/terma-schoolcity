'use client';

import { useState } from 'react';
import { SNNav, Stars } from '@/components/ui';
import type { School, Vacancy } from '@/lib/data';
import { SN } from '@/lib/tokens';

// ─── Facility definitions (mirrors SN_FACILITIES in web-schoolnet.jsx) ───────
interface Facility {
  id: string;
  label: string;
  emoji: string;
  color: string;
  photos: number;
  detail: string;
}

const SN_FACILITIES: Facility[] = [
  { id: 'sciLab',    label: 'Science Laboratory',  emoji: '🔬', color: '#1A3D2C', photos: 6, detail: 'Fully equipped for WAEC/NECO Biology, Chemistry & Physics practicals' },
  { id: 'compLab',  label: 'Computer Laboratory',  emoji: '💻', color: '#15294B', photos: 4, detail: '40 workstations, broadband internet, coding curriculum' },
  { id: 'library',  label: 'Library',              emoji: '📚', color: '#B87D20', photos: 5, detail: '3,000+ titles, quiet reading room, digital catalogue' },
  { id: 'sports',   label: 'Sports Ground',        emoji: '⚽', color: '#1F8A5B', photos: 8, detail: 'Football pitch, basketball court, athletics track' },
  { id: 'dining',   label: 'Dining Hall',          emoji: '🍽️', color: '#D4591A', photos: 3, detail: 'Hot meals daily, dietary options available' },
  { id: 'assembly', label: 'Assembly Hall',        emoji: '🏛️', color: '#7C3AED', photos: 4, detail: 'Capacity 600 · air-conditioned · stage & AV system' },
  { id: 'transport',label: 'School Transport',     emoji: '🚌', color: '#E2922B', photos: 3, detail: '4 buses covering major routes' },
  { id: 'security', label: 'Security',             emoji: '🔐', color: '#2A6FDB', photos: 2, detail: 'CCTV surveillance, gated compound, uniformed personnel' },
  { id: 'hygiene',  label: 'Hygiene Facilities',   emoji: '🧼', color: '#0D9D8A', photos: 3, detail: 'Separate male/female, handwashing stations, clean daily' },
  { id: 'nursery',  label: 'Nursery Block',        emoji: '🧸', color: '#D97757', photos: 5, detail: 'Dedicated Pre-Nursery & Nursery wing with play area' },
  { id: 'medical',  label: 'Sick Bay / Medical',   emoji: '🏥', color: '#C41E3A', photos: 2, detail: 'Registered nurse on-site, first aid, parent notification' },
  { id: 'chapel',   label: 'Chapel / Prayer Room', emoji: '⛪', color: '#6B3FA0', photos: 3, detail: 'Weekly assembly, inter-denominational, multi-faith room' },
  { id: 'arts',     label: 'Arts & Crafts Studio', emoji: '🎨', color: '#B87D20', photos: 4, detail: 'Cultural arts, pottery, drawing, performance space' },
  { id: 'ict',      label: 'ICT Infrastructure',   emoji: '📡', color: '#15294B', photos: 2, detail: 'Fibre broadband, projectors in all classrooms, LMS' },
  { id: 'gate',     label: 'Entrance & Car Park',  emoji: '🏫', color: '#1F8A5B', photos: 3, detail: 'Security checkpoint, RFID parent entry, spacious parking' },
];

// ─── Mock reviews ─────────────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  { name: 'Mrs Adaeze Obi',       date: 'Apr 2026', tag: 'Parent · JSS',     rating: 5, text: 'My daughter has thrived since joining. The teachers are attentive, the facilities are excellent, and communication with parents is consistent. Highly recommend.' },
  { name: 'Mr Chinedu Eze',       date: 'Mar 2026', tag: 'Parent · SSS',     rating: 5, text: "My son's WAEC results exceeded our expectations. The school's exam preparation programme is serious and structured." },
  { name: 'Mrs Fatima Bello',     date: 'Feb 2026', tag: 'Parent · Primary', rating: 4, text: "Great environment for young learners. The reading programme has improved my daughter's confidence enormously." },
  { name: 'Mr Emeka Nwachukwu',  date: 'Jan 2026', tag: 'Parent · Nursery', rating: 5, text: 'We moved from another school and the difference is clear. Our son looks forward to school every day now.' },
  { name: 'Mrs Ngozi Adeyemi',    date: 'Dec 2025', tag: 'Parent · SSS',     rating: 4, text: 'Strong academic focus and very professional staff. The only minor gripe is parking during pick-up time.' },
];

// ─── Mock scholarship detail (mirrors mockScholarships in SNDetail) ───────────
interface ScholarshipDetail {
  title: string;
  provider: string;
  category: string;
  value: string;
  slots: number;
  remaining: number;
  deadline: string;
  covers: string[];
  eligibility: string[];
  steps: string[];
  applyEmail: string;
}

const MOCK_SCHOLARSHIP_DETAILS: ScholarshipDetail[] = [
  { title: 'Academic Excellence Bursary', provider: 'School Alumni Foundation',  category: 'Bursary',     value: '₦250,000/term', slots: 3, remaining: 2, deadline: '31 Jul 2026', covers: ['Tuition (partial)', 'Books & materials'],                                        eligibility: ['Top 5% of class in previous term', 'Financial need demonstrated', 'Parent income declaration required'], steps: ['Download application form', 'Attach last term result', 'Submit to school admin'],    applyEmail: 'bursary@school.edu.ng' },
  { title: 'Sports Scholarship',          provider: 'School Sports Committee',    category: 'Scholarship', value: '50% tuition',   slots: 5, remaining: 3, deadline: '15 Aug 2026', covers: ['Tuition (50%)', 'Sports kit', 'Coaching sessions'],                                eligibility: ['Varsity-level athlete', 'Maintains 60%+ academic average'],                                               steps: ['Sports trial with coach', 'Academic assessment', 'Letter of recommendation'],       applyEmail: 'sports@school.edu.ng' },
  { title: 'Girls in STEM Scholarship',   provider: 'TechBridge Nigeria',         category: 'Scholarship', value: '100% tuition',  slots: 4, remaining: 1, deadline: '20 Aug 2026', covers: ['Full tuition', 'STEM textbooks', 'Lab coat & equipment', 'Mentorship sessions'],  eligibility: ['Female student', 'Mathematics above 75%', 'Science above 75%', 'SSS entry only'],                         steps: ['Online application', 'STEM aptitude test', 'Panel interview'],                      applyEmail: 'stem@techbridge.ng' },
  { title: 'Alumni Bursary',              provider: 'Old Students Association',    category: 'Bursary',     value: '₦150,000/term', slots: 6, remaining: 4, deadline: '1 Sep 2026',  covers: ['Tuition (partial)', 'Examination fees'],                                          eligibility: ['Financial need demonstrated', 'Good conduct record'],                                                     steps: ['Submit income declaration', 'Two references', 'Panel interview'],                    applyEmail: 'alumni@school.edu.ng' },
];

type Tab = 'about' | 'jobs' | 'scholarships' | 'reviews' | 'map';

// ─── Apply modal ──────────────────────────────────────────────────────────────
function ApplyModal({ vacancy, color, onClose }: { vacancy: Vacancy; color: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', cv: '', note: '' });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (sent) return (
    <Overlay zIndex={300}>
      <SuccessCard color={color} title="Application submitted!" body="The school will reach out within 5 business days." onClose={onClose} />
    </Overlay>
  );

  return (
    <Overlay zIndex={300}>
      <ModalBox maxWidth={520}>
        <ModalHeader title={`Apply — ${vacancy.title}`} sub={vacancy.dept} onClose={onClose} />
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Row2>
            <Field label="Full name"><Input value={form.name} onChange={v => set('name', v)} placeholder="e.g. Emeka Osei" /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={v => set('phone', v)} placeholder="+234 800 000 0000" /></Field>
          </Row2>
          <Field label="Email"><Input value={form.email} onChange={v => set('email', v)} placeholder="you@gmail.com" /></Field>
          <Field label="CV / Resume link"><Input value={form.cv} onChange={v => set('cv', v)} placeholder="Google Drive or Dropbox link" /></Field>
          <Field label="Cover note">
            <textarea value={form.note} onChange={e => set('note', e.target.value)} placeholder="Briefly describe your experience and why you want this role..." rows={3} style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </Field>
          <SubmitBtn color={color} onClick={() => { if (form.name && form.email && form.phone) setSent(true); }}>Submit application →</SubmitBtn>
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ─── Enquire modal ────────────────────────────────────────────────────────────
function EnquireModal({ schoolName, color, onClose }: { schoolName: string; color: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', children: '1', level: 'Primary', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (sent) return (
    <Overlay zIndex={300}>
      <SuccessCard color={color} title="Enquiry sent!" body={`${schoolName} will reply within 24 hours.`} onClose={onClose} />
    </Overlay>
  );

  return (
    <Overlay zIndex={300}>
      <ModalBox maxWidth={520}>
        <ModalHeader title={`Enquire about ${schoolName}`} sub="We reply via phone and email within 24h" onClose={onClose} />
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Row2>
            <Field label="Full name"><Input value={form.name} onChange={v => set('name', v)} placeholder="e.g. Mrs Adaeze Obi" /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={v => set('phone', v)} placeholder="+234 800 000 0000" /></Field>
          </Row2>
          <Row2>
            <div style={{ flex: 2 }}><Field label="Email"><Input value={form.email} onChange={v => set('email', v)} placeholder="you@gmail.com" /></Field></div>
            <div style={{ flex: 1 }}>
              <Field label="No. of children">
                <select value={form.children} onChange={e => set('children', e.target.value)} style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  {['1', '2', '3', '4+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </Field>
            </div>
          </Row2>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 5 }}>Level interested in</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Nursery', 'Primary', 'JSS', 'SSS'].map(lvl => (
                <button key={lvl} onClick={() => set('level', lvl)} style={{ border: `1.5px solid ${form.level === lvl ? color : '#E5E9EC'}`, background: form.level === lvl ? color + '18' : '#fff', color: form.level === lvl ? color : '#6B7280', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>{lvl}</button>
              ))}
            </div>
          </div>
          <Field label="Message">
            <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Any specific questions about admission, fees or facilities..." rows={3} style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </Field>
          <SubmitBtn color={color} onClick={() => { if (form.name && form.phone && form.email) setSent(true); }}>Send enquiry →</SubmitBtn>
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ─── Facility photo modal ─────────────────────────────────────────────────────
function FacilityModal({ facility, onClose }: { facility: Facility; onClose: () => void }) {
  return (
    <Overlay zIndex={200}>
      <ModalBox maxWidth={680} style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: '1px solid #E5E9EC', flexShrink: 0 }}>
          <span style={{ fontSize: 24 }}>{facility.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>{facility.label}</div>
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{facility.detail}</div>
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {Array.from({ length: facility.photos }, (_, idx) => (
              <div key={idx} style={{ aspectRatio: '4/3', borderRadius: 12, background: `linear-gradient(135deg, ${facility.color} 0%, ${facility.color}99 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ fontSize: 40 }}>{facility.emoji}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', fontWeight: 700 }}>Photo {idx + 1} of {facility.photos}</span>
              </div>
            ))}
          </div>
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ─── Reviews modal ────────────────────────────────────────────────────────────
function ReviewsModal({ school, onClose }: { school: School; onClose: () => void }) {
  const breakdown: [number, number][] = [[5, 68], [4, 31], [3, 14], [2, 8], [1, 6]];
  const total = breakdown.reduce((s, [, n]) => s + n, 0);
  return (
    <Overlay zIndex={200}>
      <ModalBox maxWidth={600} style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E9EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>Parent reviews — {school.name}</div>
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Submitted via the Kidtrack Parent App</div>
          </div>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E9EC', display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#111827', lineHeight: 1 }}>{school.rating}</div>
            <Stars rating={school.rating} />
            <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, marginTop: 3 }}>{school.reviews} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {breakdown.map(([stars, count]) => (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', width: 16, textAlign: 'right' }}>{stars}★</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#F3F4F6', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round(count / total * 100)}%`, height: '100%', background: '#F59E0B', borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, width: 24 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 24px' }}>
          {MOCK_REVIEWS.map((r, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: i < MOCK_REVIEWS.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: school.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: school.color, fontSize: 13, flexShrink: 0 }}>
                  {r.name.replace(/[^A-Z]/g, '').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{r.date} · {r.tag}</div>
                </div>
                <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>{'★'.repeat(r.rating)}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: '#374151', fontWeight: 500, lineHeight: 1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Overlay({ children, zIndex }: { children: React.ReactNode; zIndex: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.62)', zIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      {children}
    </div>
  );
}

function ModalBox({ children, maxWidth, style }: { children: React.ReactNode; maxWidth: number; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth, boxShadow: '0 24px 64px rgba(0,0,0,.35)', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function ModalHeader({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E9EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#9CA3AF' }}>{sub}</div>
      </div>
      <CloseBtn onClose={onClose} />
    </div>
  );
}

function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} style={{ border: 'none', background: '#F3F4F6', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
  );
}

function SuccessCard({ color, title, body, onClose }: { color: string; title: string; body: string; onClose: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '48px', textAlign: 'center', maxWidth: 380 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 500, marginBottom: 20 }}>{body}</div>
      <button onClick={onClose} style={{ border: 'none', background: color, color: '#fff', borderRadius: 10, padding: '10px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Done</button>
    </div>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 12 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
  );
}

function SubmitBtn({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ border: 'none', background: color, color: '#fff', borderRadius: 10, padding: '13px', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: 'pointer', width: '100%' }}>{children}</button>
  );
}

// ─── Main client component ────────────────────────────────────────────────────
export function SchoolDetailClient({ school: s }: { school: School }) {
  const [tab, setTab] = useState<Tab>('about');
  const [enquireOpen, setEnqireOpen] = useState(false);
  const [facilityModal, setFacilityModal] = useState<Facility | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);
  const [isFav, setIsFav] = useState(false);

  // Derive facilities list for this school
  const facilityList = SN_FACILITIES.filter(f =>
    s.features.some(sf => sf.toLowerCase().includes(f.label.toLowerCase().split(' ')[0].toLowerCase()))
  );
  const displayFacilities = facilityList.length > 0
    ? facilityList
    : s.features.map((f): Facility => ({ id: f, label: f, emoji: '🏫', color: s.color, photos: 3, detail: '' }));

  const scholarshipDetails = MOCK_SCHOLARSHIP_DETAILS.slice(0, Math.max(s.scholarships.length, 1));

  const tabs: [Tab, string][] = [
    ['about', 'About & Facilities'],
    ['jobs', `Vacancies (${s.vacancies.length})`],
    ['scholarships', `Scholarships (${s.scholarships.length})`],
    ['reviews', 'Reviews'],
    ['map', 'Location'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFB', fontFamily: SN.font }}>
      {/* Nav */}
      <SNNav rightSlot={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setIsFav(v => !v)}
            style={{ border: '1.5px solid rgba(255,255,255,.3)', background: isFav ? 'rgba(239,68,68,.3)' : 'transparent', color: isFav ? '#fca5a5' : '#fff', borderRadius: 8, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}>
            {isFav ? '♥ Saved' : '♡ Save'}
          </button>
          <button onClick={() => setEnqireOpen(true)} style={{ border: 'none', background: '#B87D20', color: '#fff', borderRadius: 9, padding: '9px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Enquire now</button>
        </div>
      } />

      {/* Banner */}
      <div style={{ height: 200, background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}bb 60%, ${s.color}66 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 50px)' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 40, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'rgba(255,255,255,.2)', border: '3px solid rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 900 }}>{s.name[0]}</span>
          </div>
          <div style={{ paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#fff' }}>{s.name}</h1>
              {s.verified && <span style={{ background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.4)', borderRadius: 6, fontSize: 11, fontWeight: 800, color: '#fff', padding: '2px 8px' }}>✓ Verified</span>}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>{s.tagline} · {s.city}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 20, right: 40, display: 'flex', gap: 12 }}>
          {([['👩‍🎓', s.students, 'students'], ['🏫', s.levels, ''], ['📅', `Est. ${s.established}`, '']] as [string, string, string][]).map(([e, v, l]) => (
            <div key={v} style={{ background: 'rgba(0,0,0,.2)', borderRadius: 10, padding: '8px 14px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{e} {v}</div>
              {l && <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{l}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Tags + rating row */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E9EC', padding: '10px 40px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {[s.type, s.gender, s.orientation, s.transport ? 'Transport available' : null, s.boarding ? 'Boarding available' : null].filter(Boolean).map(t => (
          <span key={t!} style={{ fontSize: 12.5, fontWeight: 700, color: '#374151', background: '#F3F4F6', borderRadius: 6, padding: '4px 10px', border: '1px solid #E5E9EC' }}>{t}</span>
        ))}
        {s.special && (s.specialFocus ?? []).map(sf => (
          <span key={sf} style={{ fontSize: 12.5, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', borderRadius: 6, padding: '4px 10px', border: '1px solid #C4B5FD' }}>{sf}</span>
        ))}
        <div style={{ flex: 1 }} />
        <Stars rating={s.rating} />
        <button onClick={() => setReviewsOpen(true)} style={{ border: 'none', background: 'none', color: '#1A3D2C', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>{s.reviews} reviews</button>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E9EC', paddingLeft: 36, display: 'flex' }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ border: 'none', borderBottom: tab === id ? `3px solid ${s.color}` : '3px solid transparent', background: 'transparent', padding: '12px 18px', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === id ? 800 : 600, color: tab === id ? s.color : '#6B7280', cursor: 'pointer', transition: 'all .15s', marginBottom: -1 }}>{label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 40px' }}>

        {/* ── About & Facilities ── */}
        {tab === 'about' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28 }}>
            <div>
              <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 800, color: '#111827' }}>About us</h3>
              <p style={{ margin: '0 0 20px', fontSize: 14.5, color: '#374151', fontWeight: 500, lineHeight: 1.7 }}>
                {s.name} is a verified school in {s.city}. We offer {s.levels} education in a {s.type.toLowerCase()} setting for {s.gender.toLowerCase()} students. Since {s.established}, we have been committed to academic excellence and holistic development.
              </p>
              <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: '#111827' }}>
                Facilities{' '}
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>— click any tile to view photos</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {displayFacilities.map(f => (
                  <div key={f.label} onClick={() => setFacilityModal(f)}
                    style={{ background: f.color + '12', borderRadius: 14, padding: '18px 12px', textAlign: 'center', cursor: 'pointer', border: `1.5px solid ${f.color}28`, transition: 'all .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.background = f.color + '22'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.background = f.color + '12'; }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{f.emoji}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, lineHeight: 1.3, marginBottom: 6 }}>{f.detail}</div>
                    <div style={{ fontSize: 12, color: f.color, fontWeight: 700 }}>{f.photos} photos</div>
                  </div>
                ))}
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 800, color: '#111827' }}>Fee range</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {([['Nursery', '₦380k', 'per term'], ['Primary', '₦420k–₦460k', 'per term'], ['JSS', '₦520k', 'per term'], ['SSS Science', '₦580k', 'per term'], ['SSS Arts/Comm.', '₦560k', 'per term']] as [string, string, string][]).map(([lvl, range, sub]) => (
                  <div key={lvl} style={{ flex: 1, minWidth: 100, background: '#F9FAFB', borderRadius: 10, padding: '10px', textAlign: 'center', border: '1px solid #E5E9EC' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', marginBottom: 3 }}>{lvl}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{range}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #E5E9EC', padding: '18px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Quick info</div>
              {([['📍', s.address], ['📞', s.phone], ['✉️', s.email], ['💰', `₦${Math.round(s.feeFrom / 100_000)}k – ₦${Math.round(s.feeTo / 100_000)}k per term`]] as [string, string][]).map(([e, v]) => (
                <div key={v} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                  <span>{e}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <button onClick={() => setEnqireOpen(true)} style={{ width: '100%', marginTop: 6, border: 'none', background: s.color, color: '#fff', borderRadius: 10, padding: '12px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Send enquiry →</button>
            </div>
          </div>
        )}

        {/* ── Vacancies ── */}
        {tab === 'jobs' && (
          <div>
            {s.vacancies.length === 0
              ? <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: 15, fontWeight: 600 }}>No open vacancies at this time.</div>
              : s.vacancies.map(v => (
                <div key={v.id} style={{ background: '#fff', border: '1.5px solid #E5E9EC', borderRadius: 14, padding: '16px 18px', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>💼</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 3 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600, marginBottom: 5 }}>{v.dept} · Deadline: {v.deadline}</div>
                    <div style={{ fontSize: 13.5, color: '#374151', fontWeight: 500 }}>{v.summary}</div>
                  </div>
                  <button onClick={() => setApplyVacancy(v)} style={{ border: `2px solid ${s.color}`, background: '#fff', color: s.color, borderRadius: 9, padding: '8px 18px', fontFamily: 'inherit', fontSize: 13, fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}>Apply</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Scholarships ── */}
        {tab === 'scholarships' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 12, padding: '12px 16px', fontSize: 13.5, color: '#92400E', fontWeight: 600 }}>
              🎓 {s.name} offers {s.scholarships.length} scholarship{s.scholarships.length !== 1 ? 's' : ''} — apply directly through the school.
            </div>
            {scholarshipDetails.map((sc, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid #E5E9EC', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #FFFBEB, #FEF3C7)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #FDE68A' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF3C7', border: '2px solid #FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>🎓</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: '#111827', marginBottom: 2 }}>{sc.title}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>By {sc.provider}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#D97706' }}>{sc.value}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{sc.remaining} of {sc.slots} slots left</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>What it covers</div>
                    {sc.covers.map(c => <div key={c} style={{ fontSize: 13.5, color: '#374151', fontWeight: 500, marginBottom: 5 }}>✓ {c}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Eligibility</div>
                    {sc.eligibility.map(e => <div key={e} style={{ fontSize: 12.5, color: '#374151', fontWeight: 500, marginBottom: 5, display: 'flex', gap: 6 }}><span style={{ color: '#D97706', flexShrink: 0 }}>•</span>{e}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>How to apply</div>
                    {sc.steps.map((step, si) => (
                      <div key={si} style={{ fontSize: 12.5, color: '#374151', fontWeight: 500, marginBottom: 5, display: 'flex', gap: 8 }}>
                        <span style={{ width: 18, height: 18, minWidth: 18, borderRadius: '50%', background: '#FEF3C7', color: '#D97706', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{si + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA' }}>
                  <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Deadline: <strong style={{ color: '#111827' }}>{sc.deadline}</strong> · {sc.applyEmail}</div>
                  <button onClick={() => setEnqireOpen(true)} style={{ border: 'none', background: '#D97706', color: '#fff', borderRadius: 9, padding: '9px 20px', fontFamily: 'inherit', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Enquire to apply →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Reviews tab ── */}
        {tab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24, background: '#fff', borderRadius: 14, border: '1.5px solid #E5E9EC', padding: '20px 24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: '#111827', lineHeight: 1 }}>{s.rating}</div>
                <Stars rating={s.rating} />
                <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, marginTop: 4 }}>{s.reviews} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {([[5, 68], [4, 31], [3, 14], [2, 8], [1, 6]] as [number, number][]).map(([stars, count]) => (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', width: 16, textAlign: 'right' }}>{stars}★</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#F3F4F6', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round(count / 127 * 100)}%`, height: '100%', background: '#F59E0B', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, width: 24 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E5E9EC', padding: '16px 20px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: s.color, fontSize: 13, flexShrink: 0 }}>
                    {r.name.replace(/[^A-Z]/g, '').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{r.date} · {r.tag}</div>
                  </div>
                  <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>{'★'.repeat(r.rating)}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#374151', fontWeight: 500, lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Location ── */}
        {tab === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', border: '1.5px solid #E5E9EC', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>📍</span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#111827' }}>{s.address}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>{s.phone} · {s.email}</div>
              </div>
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1.5px solid #E5E9EC', height: 420 }}>
              <iframe
                title="School map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.37%2C9.09%2C7.43%2C9.13&layer=mapnik&marker=9.1092%2C7.3911"
                width="100%"
                height="420"
                style={{ border: 'none', display: 'block' }}
                loading="lazy"
              />
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=9.1092&mlon=7.3911#map=15/9.1092/7.3911"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12.5, color: s.color, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
              View larger map →
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      {facilityModal && <FacilityModal facility={facilityModal} onClose={() => setFacilityModal(null)} />}
      {reviewsOpen && <ReviewsModal school={s} onClose={() => setReviewsOpen(false)} />}
      {enquireOpen && <EnquireModal schoolName={s.name} color={s.color} onClose={() => setEnqireOpen(false)} />}
      {applyVacancy && <ApplyModal vacancy={applyVacancy} color={s.color} onClose={() => setApplyVacancy(null)} />}

      <div style={{ height: 60 }} />
    </div>
  );
}
