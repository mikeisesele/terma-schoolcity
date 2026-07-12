'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { T } from '@/lib/tokens';
import { SCNav, Stars } from '@/components/ui';
import { useSchool } from '@/lib/useSchool';
import { useReviews } from '@/lib/useReviews';
import { useSchoolPhotos } from '@/lib/useSchoolPhotos';
import { useSchoolAchievements } from '@/lib/useSchoolAchievements';
import { supabase } from '@/lib/supabase';
import { deriveFacilityImages } from '@/lib/data';
import type { AchievementType } from '@/lib/useSchoolAchievements';
import { useSchoolVacancies } from '@/lib/useVacancies';

const LEVELS = ['Nursery', 'Primary', 'JSS', 'SSS'] as const;
type Level = (typeof LEVELS)[number];

type FacilityCard = { label: string; emoji: string; color: string; photoCount: number; urls: string[]; description: string };

function featureEmoji(label: string): { emoji: string; color: string } {
  const l = label.toLowerCase();
  if (l.includes('transport') || l.includes('bus'))      return { emoji: '🚌', color: '#E2922B' };
  if (l.includes('science'))                              return { emoji: '🔬', color: '#1A3D2C' };
  if (l.includes('computer') || l.includes('ict'))       return { emoji: '💻', color: '#15294B' };
  if (l.includes('library'))                              return { emoji: '📚', color: '#B87D20' };
  if (l.includes('sport') || l.includes('field'))        return { emoji: '⚽', color: '#1F8A5B' };
  if (l.includes('swimming') || l.includes('pool'))      return { emoji: '🏊', color: '#0284C7' };
  if (l.includes('boarding') || l.includes('hostel'))    return { emoji: '🏠', color: '#4B5563' };
  if (l.includes('music'))                               return { emoji: '🎵', color: '#7C3AED' };
  if (l.includes('dining') || l.includes('cafeteria'))   return { emoji: '🍽️', color: '#D4591A' };
  if (l.includes('security'))                            return { emoji: '🔐', color: '#2A6FDB' };
  if (l.includes('assembly') || l.includes('hall'))      return { emoji: '🏛️', color: '#7C3AED' };
  if (l.includes('sick') || l.includes('medical'))       return { emoji: '🏥', color: '#C41E3A' };
  if (l.includes('nursery') || l.includes('playground')) return { emoji: '🧒', color: '#C2692A' };
  if (l.includes('art') || l.includes('studio'))         return { emoji: '🎨', color: '#B87D20' };
  if (l.includes('garden') || l.includes('farm'))        return { emoji: '🌿', color: '#1F8A5B' };
  if (l.includes('chapel') || l.includes('mosque'))      return { emoji: '🕌', color: '#5B21B6' };
  return { emoji: '🏫', color: '#3D7058' };
}

function featureDescription(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('science'))     return 'Fully equipped for WAEC/NECO Biology, Chemistry & Physics practicals';
  if (l.includes('computer'))    return '40+ workstations, broadband internet, coding curriculum';
  if (l.includes('library'))     return '3,000+ books, quiet reading room, digital catalogue';
  if (l.includes('transport') || l.includes('bus'))  return 'GPS-tracked buses covering major routes';
  if (l.includes('sport') || l.includes('field'))    return 'Football pitch, basketball court, athletics track';
  if (l.includes('swimming'))    return 'Olympic-standard pool, trained lifeguards on duty';
  if (l.includes('boarding') || l.includes('hostel')) return 'Safe, supervised residential quarters with house parents';
  if (l.includes('music'))       return 'Instruments, recording space, choir and band practice area';
  if (l.includes('dining') || l.includes('cafeteria')) return 'Hot meals, dietary options, supervised dining hall';
  if (l.includes('security'))    return 'CCTV surveillance, gated compound, security personnel';
  if (l.includes('assembly') || l.includes('hall')) return 'Capacity 500+, air-conditioned, AV system';
  if (l.includes('sick') || l.includes('medical')) return 'Registered nurse on-site, first aid, parent notification';
  if (l.includes('nursery') || l.includes('playground')) return 'Age-appropriate play areas, sensory rooms and outdoor learning spaces';
  if (l.includes('ict'))         return 'ICT infrastructure, digital labs, technology integration';
  if (l.includes('art'))         return 'Art studio with supplies for visual arts and crafts';
  return '';
}

function activityEmoji(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('sport') || l.includes('inter-house') || l.includes('athletic')) return '🏆';
  if (l.includes('cultural') || l.includes('drama') || l.includes('theatre'))    return '🎭';
  if (l.includes('christmas') || l.includes('xmas') || l.includes('carol'))      return '🎄';
  if (l.includes('graduation') || l.includes('valedictory'))                      return '🎓';
  if (l.includes('science') && l.includes('fair'))                               return '🔭';
  if (l.includes('debate') || l.includes('quiz') || l.includes('spelling'))      return '🎤';
  if (l.includes('music') || l.includes('concert') || l.includes('choir'))       return '🎵';
  if (l.includes('art') || l.includes('exhibition'))                             return '🎨';
  if (l.includes('parent') || l.includes('open day'))                            return '👨‍👩‍👧';
  if (l.includes('prize') || l.includes('award'))                                return '🏅';
  if (l.includes('excursion') || l.includes('trip') || l.includes('field'))      return '🚌';
  if (l.includes('eid') || l.includes('sallah'))                                 return '🌙';
  if (l.includes('inter') || l.includes('compet'))                               return '🥇';
  return '📸';
}

function achievementStyle(type: AchievementType): { icon: string; color: string; bg: string } {
  switch (type) {
    case 'waec':        return { icon: '📜', color: '#1E3A5F', bg: '#DBEAFE' };
    case 'award':       return { icon: '🏆', color: '#7A4A00', bg: '#FEF3C7' };
    case 'affiliation': return { icon: '🤝', color: '#065F46', bg: '#D1FAE5' };
    default:            return { icon: '⭐', color: '#5B21B6', bg: '#EDE9FE' };
  }
}

export default function SCDetail() {
  const router = useRouter();
  const params = useParams();
  const rawId  = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');

  const { school, loading: schoolLoading, notFound } = useSchool(rawId);
  const { reviews }              = useReviews(school?.id);
  const { byCategory }           = useSchoolPhotos(school?.id);
  const { achievements }         = useSchoolAchievements(school?.id);
  const { vacancies: jobList }   = useSchoolVacancies(school?.id ?? null);

  const [tab, setTab]                       = useState('overview');
  const [enquireOpen, setEnqOpen]           = useState(false);
  const [sending, setSending]               = useState(false);
  const [sent, setSent]                     = useState(false);
  const [form, setForm]                     = useState({ name: '', phone: '', email: '', message: '' });
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [facilityModal, setFM]              = useState<FacilityCard | null>(null);
  const [lightbox, setLightbox]             = useState<number | null>(null);
  const [reviewsOpen, setRO]                = useState(false);
  const [saveOpen, setSaveOpen]             = useState(false);
  const [isFav, setIsFav]                   = useState(false);
  const [expandedCampus, setExpandedCampus] = useState<string | null>(null);

  useEffect(() => {
    try { const f = JSON.parse(localStorage.getItem('sc_favs') || '[]'); setIsFav(f.includes(rawId)); } catch {}
  }, [rawId]);

  useEffect(() => {
    if (lightbox === null || !facilityModal) return;
    const n = facilityModal.photoCount;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowLeft')  setLightbox(p => ((p ?? 0) - 1 + n) % n);
      if (e.key === 'ArrowRight') setLightbox(p => ((p ?? 0) + 1) % n);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightbox, facilityModal]);

  if (schoolLoading) return <div style={{ padding: 40, fontFamily: T.font, color: T.ink2 }}>Loading…</div>;
  if (notFound || !school) return <div style={{ padding: 40, fontFamily: T.font, color: T.ink2 }}>School not found.</div>;

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const toggleFav = () => {
    try {
      const f: string[] = JSON.parse(localStorage.getItem('sc_favs') || '[]');
      const next = f.includes(school.id) ? f.filter(x => x !== school.id) : [...f, school.id];
      localStorage.setItem('sc_favs', JSON.stringify(next));
      setIsFav(next.includes(school.id));
      toast(next.includes(school.id) ? 'School saved ♥' : 'Removed from saved');
    } catch {}
  };

  const toggleLevel = (l: Level) =>
    setSelectedLevels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

  const submitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) return;
    setSending(true);
    try {
      const payload: Record<string, unknown> = {
        school_id: school.id, parent_name: form.name, phone: form.phone,
        email: form.email, message: form.message || null, source: 'schoolnet',
      };
      if (selectedLevels.length > 0) payload.level_interest = selectedLevels.join(',');
      const { error } = await supabase.from('school_enquiries').insert(payload);
      if (error) throw error;
      setSent(true);
    } catch {
      toast.error('Could not send enquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Curriculum options stored in features[] — filter them out before building facility list
  const CURRIC_OPTS = new Set(['WAEC / NECO', 'Cambridge (IGCSE)', 'British Curriculum', 'French Baccalaureate', 'Montessori', 'UTME']);
  const facilityFeatures = school.features.filter(f => !CURRIC_OPTS.has(f));

  // Facilities — DB photos with derived fallback
  const fallbackImages = deriveFacilityImages(facilityFeatures);
  const facilityList: FacilityCard[] = facilityFeatures.map(label => {
    const { emoji, color } = featureEmoji(label);
    const dbPhotos = byCategory[label] ?? [];
    const fallback = fallbackImages[label] ?? [];
    const urls = dbPhotos.length > 0 ? dbPhotos.map(p => p.url) : fallback;
    return { label, emoji, color, photoCount: urls.length, urls, description: featureDescription(label) };
  });

  // Activities & Events — photo categories not in the school's facility features
  const featureSet = new Set(facilityFeatures.map(f => f.toLowerCase()));
  const activityList = Object.keys(byCategory)
    .filter(cat => !featureSet.has(cat.toLowerCase()))
    .map(cat => ({ label: cat, emoji: activityEmoji(cat), photos: byCategory[cat] }));

  // Awards — platform auto-badges + DB achievements
  const platformBadges = [
    school.verified && { icon: '✅', label: 'SchoolOS Verified',   sub: 'Identity & facilities verified by SchoolOS',         color: '#1A3D2C', bg: '#E3EDE6' },
    school.ktPlan === 'Pro' && { icon: '⭐', label: 'SchoolOS Pro', sub: 'Full platform — GPS, fees, CBT, analytics', color: '#B87D20', bg: '#F5EDD0' },
    school.rating >= 4.7 && { icon: '🏆', label: 'Top Rated School', sub: `Rated ${school.rating}/5 by ${school.reviews} parents`, color: '#7A4A00', bg: '#FEF3C7' },
    school.scholarships > 2 && { icon: '🎓', label: 'Scholarship Excellence', sub: `${school.scholarships} scholarship programmes available`, color: '#5B21B6', bg: '#EDE9FE' },
    facilityFeatures.length >= 5 && { icon: '🌟', label: 'Well-Equipped Campus', sub: `${facilityFeatures.length} verified facilities`, color: '#065F46', bg: '#D1FAE5' },
    school.established > 0 && school.established <= 2005 && { icon: '🏛️', label: 'Established Institution', sub: `${2026 - school.established}+ years of academic excellence`, color: '#1E3A5F', bg: '#DBEAFE' },
  ].filter(Boolean) as { icon: string; label: string; sub: string; color: string; bg: string }[];

  const dbBadges = achievements.map(a => {
    const { icon, color, bg } = achievementStyle(a.type);
    const parts = [a.description, a.year ? String(a.year) : null].filter(Boolean);
    return { icon, label: a.title, sub: parts.join(' · '), color, bg };
  });

  const allBadges = [...platformBadges, ...dbBadges];

  // Rating distribution from loaded reviews
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
  const ratingTotal = ratingDist.reduce((s, r) => s + r.count, 0);

  const tabs: [string, string][] = [
    ['overview', 'Overview'],
    ['facilities', `Facilities (${facilityList.length})`],
    ['jobs', `Vacancies (${school.vacancies})`],
    ...(school.scholarships > 0 ? [['scholarships', `Scholarships (${school.scholarships})`] as [string, string]] : []),
    ['map', 'Map'],
  ];

  const schoolFactRows = [
    ['Levels', school.levels],
    ['Type', school.type],
    ['Gender', school.gender],
    ['Orientation', school.orientation],
    school.established > 0 ? ['Established', String(school.established)] : null,
    school.students ? ['Students', school.students] : null,
    school.transport ? ['Transport', 'Available'] : null,
    school.boarding ? ['Boarding', 'Available'] : null,
  ].filter(Boolean) as [string, string][];

  // Facility grid used in both single-campus and multi-campus views
  const FacilityGrid = ({ compact = false }: { compact?: boolean }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: compact ? 10 : 14 }}>
      {(facilityList.length > 0
        ? facilityList
        : school.features.map(f => ({ label: f, ...featureEmoji(f), photoCount: 0, urls: [], description: '' }))
      ).map(f => (
        <div
          key={f.label}
          onClick={() => setFM(f)}
          style={{ background: T.cardBg, borderRadius: 14, padding: compact ? '14px 12px' : '20px 16px', textAlign: 'center', cursor: 'pointer', border: `1.5px solid ${T.line}`, transition: 'all .2s', boxShadow: `0 1px 6px ${T.shadowColor}` }}
          onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = f.color + '60'; d.style.boxShadow = `0 6px 20px ${f.color}20`; d.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = T.line; d.style.boxShadow = `0 1px 6px ${T.shadowColor}`; d.style.transform = 'none'; }}
        >
          <div style={{ fontSize: compact ? 28 : 34, marginBottom: 8 }}>{f.emoji}</div>
          <div style={{ fontSize: compact ? 12.5 : 13.5, fontWeight: 800, color: T.ink, marginBottom: f.description ? 5 : 8 }}>{f.label}</div>
          {f.description && !compact && (
            <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 400, lineHeight: 1.45, marginBottom: 8 }}>{f.description}</div>
          )}
          {f.photoCount > 0
            ? <div style={{ fontSize: 11, fontWeight: 800, color: f.color, background: f.color + '14', borderRadius: T.btnR, padding: '3px 9px', display: 'inline-block' }}>📷 {f.photoCount} photos</div>
            : <div style={{ fontSize: 11, color: T.ink3, fontWeight: 500 }}>No photos yet</div>
          }
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <SCNav
        onBack={() => router.push('/')}
        backLabel="← Back"
        rightSlot={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => { const url = window.location.href; if (navigator.share) navigator.share({ title: school.name, url }); else navigator.clipboard?.writeText(url).then(() => toast('Link copied!')); }}
              style={{ border: `1.5px solid ${T.navInk}25`, background: 'transparent', color: T.navInk, borderRadius: T.btnR, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >↗ Share</button>
            <button
              onClick={() => isFav ? toggleFav() : setSaveOpen(true)}
              style={{ border: `1.5px solid ${isFav ? T.accent : T.navInk + '25'}`, background: isFav ? T.accent + '15' : 'transparent', color: isFav ? T.accent : T.navInk, borderRadius: T.btnR, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}
            >{isFav ? '♥ Saved' : '♡ Save'}</button>
            <button
              onClick={() => setEnqOpen(true)}
              style={{ border: 'none', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '9px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
            >Enquire now</button>
          </div>
        }
      />

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 60%, ${school.color}99 100%)`, position: 'relative', overflow: 'hidden', minHeight: 280 }}>
        {school.bannerUrl && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${school.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: school.bannerUrl ? 'linear-gradient(to bottom,rgba(0,0,0,.28) 0%,rgba(0,0,0,.75) 100%)' : 'linear-gradient(to bottom,rgba(0,0,0,.08) 0%,rgba(0,0,0,.5) 100%)' }} />
        <div style={{ position: 'relative', padding: '32px 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 250 }}>
          {/* Left: logo + name + info */}
          <div style={{ paddingBottom: 4, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: 'rgba(255,255,255,.2)', border: '2.5px solid rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', flexShrink: 0, overflow: 'hidden' }}>
                {school.imageUrl
                  ? <img src={school.imageUrl} alt={school.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#fff', fontSize: 30, fontWeight: 900 }}>{school.name[0]}</span>
                }
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.35)', lineHeight: 1.1 }}>{school.name}</h1>
                  {school.verified && (
                    <span style={{ background: 'rgba(255,255,255,.22)', border: '1px solid rgba(255,255,255,.45)', borderRadius: T.btnR, fontSize: 11, fontWeight: 800, color: '#fff', padding: '3px 10px', whiteSpace: 'nowrap' }}>✓ Verified</span>
                  )}
                  {school.ktPlan === 'Pro' && (
                    <span style={{ background: 'rgba(184,125,32,.9)', border: '1px solid rgba(255,255,255,.3)', borderRadius: T.btnR, fontSize: 11, fontWeight: 800, color: '#fff', padding: '3px 10px', whiteSpace: 'nowrap' }}>⭐ Pro</span>
                  )}
                </div>
                {school.tagline && (
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', fontWeight: 400, marginBottom: 6 }}>{school.tagline}</div>
                )}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>📍 {school.city}</span>
                  {school.established > 0 && <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>Est. {school.established}</span>}
                  {school.students && <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>{school.students} students</span>}
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>{school.levels}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right: rating widget */}
          {school.reviews > 0 && (
            <button
              onClick={() => setRO(true)}
              style={{ background: 'rgba(0,0,0,.45)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 16, padding: '14px 20px', textAlign: 'center', backdropFilter: 'blur(12px)', cursor: 'pointer', flexShrink: 0, marginLeft: 20, marginBottom: 4 }}
            >
              <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{school.rating.toFixed(1)}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '4px 0' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ fontSize: 13, color: s <= Math.round(school.rating) ? '#FCD34D' : 'rgba(255,255,255,.3)' }}>★</span>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{school.reviews} reviews</div>
            </button>
          )}
        </div>
      </div>

      {/* ── Tags strip ───────────────────────────────────────────────────────── */}
      <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.line}`, padding: '10px 40px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {[school.type, school.gender, school.orientation, school.transport ? 'Transport available' : null, school.boarding ? 'Boarding available' : null]
          .filter(Boolean).map(t => (
            <span key={t as string} style={{ fontSize: 12, fontWeight: 700, color: T.ink2, background: T.bg, borderRadius: T.btnR, padding: '4px 10px', border: `1px solid ${T.line}` }}>{t}</span>
          ))}
        {school.scholarships > 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#B87D20', background: '#FEF3C7', borderRadius: T.btnR, padding: '4px 10px', border: '1px solid #FDE68A' }}>🎓 Scholarships</span>
        )}
        {(school.specialFocus ?? []).map(sf => (
          <span key={sf} style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', borderRadius: T.btnR, padding: '4px 10px', border: '1px solid #C4B5FD' }}>{sf}</span>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.line}`, paddingLeft: 36, display: 'flex' }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ border: 'none', borderBottom: tab === id ? `3px solid ${school.color}` : '3px solid transparent', background: 'transparent', padding: '12px 18px', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === id ? 800 : 600, color: tab === id ? school.color : T.ink3, cursor: 'pointer', transition: 'all .15s', marginBottom: -1 }}>{label}</button>
        ))}
      </div>

      {/* ── Page body ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '28px 40px' }}>

        {/* ── Overview — 2-column (main + sticky sidebar) ───────────────────── */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

            {/* LEFT: main content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* About */}
              <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '24px 28px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: T.ink }}>About {school.name}</h3>
                <p style={{ margin: '0 0 16px', fontSize: 14.5, color: T.ink2, fontWeight: 400, lineHeight: 1.75 }}>
                  {school.name} is a verified {school.type.toLowerCase()} school in {school.city}, offering {school.levels} education for {school.gender.toLowerCase()} students.
                  {school.established > 0 ? ` Since ${school.established}, the school has been committed to academic excellence and holistic development — producing graduates who are confident, capable and ready for the world.` : ''}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[school.type, school.gender, school.orientation, ...(school.specialFocus ?? [])].filter(Boolean).map(t => (
                    <span key={t} style={{ fontSize: 12, fontWeight: 700, color: T.ink2, background: T.bg, borderRadius: T.btnR, padding: '4px 11px', border: `1px solid ${T.line}` }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Campus & Facilities */}
              <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '24px 24px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.ink }}>Campus &amp; Facilities</h3>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: T.ink3 }}>Tap to view photos</p>

                {school.campuses && school.campuses.length > 1 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {school.campuses.map((c, i) => {
                      const isOpen = expandedCampus === c.name;
                      return (
                        <div key={i} style={{ borderRadius: 14, border: `1.5px solid ${isOpen ? school.color : T.line}`, overflow: 'hidden', transition: 'border-color .2s' }}>
                          <button onClick={() => setExpandedCampus(isOpen ? null : c.name)} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
                            <div style={{ fontSize: 18 }}>📍</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>{c.name}</div>
                              <div style={{ fontSize: 12.5, color: T.ink2, marginTop: 2 }}>{c.address}</div>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? school.color : T.ink3 }}>{isOpen ? 'Hide ‹' : 'Facilities ›'}</span>
                          </button>
                          {isOpen && (
                            <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${T.line}` }}>
                              <div style={{ height: 14 }} />
                              <FacilityGrid compact />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : facilityList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px', color: T.ink3, fontSize: 14 }}>No facilities listed yet.</div>
                ) : (
                  <FacilityGrid />
                )}
              </div>

              {/* Activities & Events */}
              {activityList.length > 0 && (
                <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '24px 24px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: T.ink }}>Activities &amp; Events</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 13.5, color: T.ink3 }}>School events and activities gallery</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                    {activityList.map(a => (
                      <div
                        key={a.label}
                        onClick={() => setFM({ label: a.label, emoji: a.emoji, color: T.accent, photoCount: a.photos.length, urls: a.photos.map(p => p.url), description: '' })}
                        style={{ borderRadius: 14, border: `1.5px solid ${T.line}`, overflow: 'hidden', cursor: 'pointer', background: T.cardBg, transition: 'box-shadow .2s' }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 16px ${T.shadowHover}`)}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                      >
                        <div style={{ background: T.accentLight, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <span style={{ fontSize: 34 }}>{a.emoji}</span>
                          <span style={{ position: 'absolute', top: 8, right: 8, background: T.accent, color: T.accentText, fontSize: 10, fontWeight: 800, borderRadius: T.btnR, padding: '2px 8px' }}>{a.photos.length} photos</span>
                        </div>
                        <div style={{ padding: '10px 12px' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 800, color: T.ink, lineHeight: 1.3 }}>{a.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards & Recognition */}
              {allBadges.length > 0 && (
                <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '24px 24px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: T.ink }}>Awards &amp; Recognition</h3>
                  <p style={{ margin: '0 0 16px', fontSize: 13.5, color: T.ink3 }}>Verified achievements, accreditations and badges</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {allBadges.map((a, i) => (
                      <div key={i} style={{ background: a.bg, borderRadius: 14, padding: '16px', border: `1.5px solid ${a.color}22`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }}>{a.icon}</div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: a.color, marginBottom: 3, lineHeight: 1.2 }}>{a.label}</div>
                          {a.sub && <div style={{ fontSize: 11.5, color: a.color + 'AA', fontWeight: 500, lineHeight: 1.4 }}>{a.sub}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: sticky sidebar */}
            <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Enquire CTA */}
              <div style={{ background: T.accent, borderRadius: T.cardR, padding: '24px 22px', boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Enquire about admission</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.55, marginBottom: 18 }}>Get information about fees, availability and the admission process directly from the school.</div>
                <button onClick={() => setEnqOpen(true)} style={{ width: '100%', border: 'none', background: 'rgba(255,255,255,.15)', color: '#fff', borderRadius: T.btnR, padding: '12px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'background .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.25)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.15)')}
                >Send enquiry →</button>
              </div>

              {/* Quick Info */}
              <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '20px 20px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.ink3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Info</div>
                {(([
                  ['📍', school.address || school.city],
                  school.phone ? ['📞', school.phone] : null,
                  school.email ? ['✉️', school.email] : null,
                  (school.feeFrom > 0 || school.feeTo > 0) ? ['💰', `₦${(school.feeFrom / 1000).toFixed(0)}k – ₦${(school.feeTo / 1000).toFixed(0)}k per term`] : null,
                ] as ([string, string] | null)[]).filter(Boolean) as [string, string][]).map(([e, v]) => (
                  <div key={v} style={{ display: 'flex', gap: 10, marginBottom: 11, fontSize: 13, color: T.ink2, fontWeight: 500, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, fontSize: 14 }}>{e}</span>
                    <span style={{ lineHeight: 1.45 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* School Facts */}
              {schoolFactRows.length > 0 && (
                <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '20px 20px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: T.ink3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>School Facts</div>
                  {schoolFactRows.map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${T.line}` }}>
                      <span style={{ fontSize: 13, color: T.ink3, fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 13, color: T.ink, fontWeight: 800 }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Facilities tab ───────────────────────────────────────────────── */}
        {tab === 'facilities' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: T.ink }}>Campus Facilities</h2>
              <p style={{ margin: 0, fontSize: 14, color: T.ink3 }}>Tap any facility to view photos</p>
            </div>
            {facilityList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: T.ink3, fontSize: 15, fontWeight: 600 }}>No facilities listed for this school yet.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {facilityList.map(f => (
                  <div
                    key={f.label}
                    onClick={() => setFM(f)}
                    style={{ background: T.cardBg, borderRadius: 16, padding: '22px 18px', textAlign: 'center', cursor: 'pointer', border: `1.5px solid ${T.line}`, transition: 'all .2s', boxShadow: `0 1px 6px ${T.shadowColor}` }}
                    onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = f.color + '60'; d.style.boxShadow = `0 6px 20px ${f.color}20`; d.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = T.line; d.style.boxShadow = `0 1px 6px ${T.shadowColor}`; d.style.transform = 'none'; }}
                  >
                    <div style={{ fontSize: 38, marginBottom: 10 }}>{f.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 6 }}>{f.label}</div>
                    {f.description && <div style={{ fontSize: 12, color: T.ink3, fontWeight: 400, lineHeight: 1.45, marginBottom: 10 }}>{f.description}</div>}
                    {f.photoCount > 0
                      ? <div style={{ fontSize: 11.5, fontWeight: 800, color: f.color, background: f.color + '14', borderRadius: T.btnR, padding: '4px 10px', display: 'inline-block' }}>📷 {f.photoCount} photos</div>
                      : <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>No photos yet</div>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Vacancies ────────────────────────────────────────────────────── */}
        {tab === 'jobs' && (
          <div>
            {jobList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: T.ink3, fontSize: 15, fontWeight: 600 }}>No open vacancies at this time.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {jobList.map(job => (
                  <div key={job.id} style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '20px 24px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, marginBottom: 4 }}>{job.title}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: T.ink2 }}>{job.department}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#1A3D2C', background: '#E3EDE6', borderRadius: T.btnR, padding: '2px 9px' }}>{job.type}</span>
                          {job.trcn_required && <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', borderRadius: T.btnR, padding: '2px 9px' }}>TRCN required</span>}
                          {job.location && <span style={{ fontSize: 12, color: T.ink3, fontWeight: 600 }}>📍 {job.location}</span>}
                        </div>
                      </div>
                      {job.deadline && (
                        <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                          Deadline: {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    {job.summary && <p style={{ margin: '10px 0 0', fontSize: 14, color: T.ink2, lineHeight: 1.65 }}>{job.summary}</p>}
                    {job.salary_range && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: T.ink }}>💰 {job.salary_range}</div>}
                    <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <a href={`mailto:${job.apply_email}?subject=Application: ${encodeURIComponent(job.title)}`} style={{ border: 'none', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '9px 20px', fontFamily: T.font, fontSize: 13.5, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Apply →</a>
                      {job.apply_instructions && <span style={{ fontSize: 12.5, color: T.ink3 }}>{job.apply_instructions}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Scholarships ─────────────────────────────────────────────────── */}
        {tab === 'scholarships' && (
          <div>
            <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: T.cardR, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#92400E', marginBottom: 6 }}>🎓 {school.scholarships} Scholarship Programme{school.scholarships !== 1 ? 's' : ''}</div>
              <p style={{ margin: 0, fontSize: 14, color: '#92400E', lineHeight: 1.65 }}>
                {school.name} offers {school.scholarships} scholarship programme{school.scholarships !== 1 ? 's' : ''} for eligible students. Contact the school directly for eligibility criteria, the application process, and deadlines.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setEnqOpen(true)} style={{ border: 'none', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '11px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Enquire about scholarships →</button>
              {school.phone && <a href={`tel:${school.phone}`} style={{ border: `1.5px solid ${T.line}`, background: T.cardBg, color: T.ink2, borderRadius: T.btnR, padding: '11px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>📞 Call</a>}
            </div>
          </div>
        )}

        {/* ── Map ──────────────────────────────────────────────────────────── */}
        {tab === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: T.cardBg, borderRadius: T.cardR, padding: '12px 16px', border: `1.5px solid ${T.cardBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>📍</span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{school.address || school.city}</div>
                {(school.phone || school.email) && (
                  <div style={{ fontSize: 13, color: T.ink3 }}>{[school.phone, school.email].filter(Boolean).join(' · ')}</div>
                )}
              </div>
            </div>
            <div style={{ borderRadius: T.cardR, overflow: 'hidden', border: `1.5px solid ${T.cardBorder}`, height: 420 }}>
              {school.lat != null && school.lng != null ? (() => {
                const delta = 0.03;
                const bbox = `${school.lng - delta}%2C${school.lat - delta}%2C${school.lng + delta}%2C${school.lat + delta}`;
                const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${school.lat}%2C${school.lng}`;
                return <iframe title="School map" src={src} width="100%" height="420" style={{ border: 'none', display: 'block' }} loading="lazy" />;
              })() : (
                <div style={{ height: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: T.inputBg, color: T.ink3 }}>
                  <span style={{ fontSize: 40 }}>📍</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Location not available</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Facility modal ──────────────────────────────────────────────────── */}
      {facilityModal && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlay, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: T.cardBg, borderRadius: 18, width: '100%', maxWidth: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: `1px solid ${T.line}`, flexShrink: 0 }}>
              <span style={{ fontSize: 24 }}>{facilityModal.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{facilityModal.label}</div>
                <div style={{ fontSize: 13, color: T.ink3 }}>{facilityModal.description || (facilityModal.photoCount > 0 ? `${facilityModal.photoCount} photos` : 'No photos uploaded yet')}</div>
              </div>
              <button onClick={() => { setFM(null); setLightbox(null); }} style={{ border: 'none', background: T.inputBg, borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: T.ink3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {facilityModal.photoCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: T.ink3 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{facilityModal.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>No photos uploaded for this facility yet.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {facilityModal.urls.map((url, idx) => (
                    <div key={idx} onClick={() => setLightbox(idx)} style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: facilityModal.color + '18', transition: 'transform .15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
                      <img src={url} alt={facilityModal.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {facilityModal && lightbox !== null && facilityModal.photoCount > 0 && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, backdropFilter: 'blur(4px)' }}>
          <button onClick={e => { e.stopPropagation(); setLightbox(null); }} style={{ position: 'absolute', top: 24, right: 28, border: 'none', background: 'rgba(255,255,255,.12)', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <button onClick={e => { e.stopPropagation(); setLightbox(p => ((p ?? 0) - 1 + facilityModal.photoCount) % facilityModal.photoCount); }} style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,.12)', borderRadius: '50%', width: 54, height: 54, cursor: 'pointer', fontSize: 28, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <div onClick={e => e.stopPropagation()} style={{ width: 'min(900px,90vw)', maxHeight: '82vh', aspectRatio: '4/3', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.6)', position: 'relative' }}>
            <img src={facilityModal.urls[lightbox % facilityModal.urls.length]} alt={facilityModal.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{facilityModal.label}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)' }}>Photo {lightbox + 1} of {facilityModal.photoCount}</div>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); setLightbox(p => ((p ?? 0) + 1) % facilityModal.photoCount); }} style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,.12)', borderRadius: '50%', width: 54, height: 54, cursor: 'pointer', fontSize: 28, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            {facilityModal.urls.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightbox(i); }} style={{ width: i === lightbox ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === lightbox ? '#fff' : 'rgba(255,255,255,.35)', cursor: 'pointer', padding: 0, transition: 'all .25s' }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Reviews modal ────────────────────────────────────────────────────── */}
      {reviewsOpen && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlay, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: T.cardBg, borderRadius: 18, width: '100%', maxWidth: 600, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.35)' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: T.ink }}>Parent reviews</div>
                <div style={{ fontSize: 13, color: T.ink3 }}>Submitted via the SchoolOS Parent App</div>
              </div>
              <button onClick={() => setRO(false)} style={{ border: 'none', background: T.inputBg, borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: T.ink3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.line}`, display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: T.ink, lineHeight: 1 }}>{school.rating.toFixed(1)}</div>
                <Stars rating={school.rating} />
                <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600, marginTop: 3 }}>{school.reviews} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {ratingDist.map(({ star, count }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: T.ink3, fontWeight: 700, width: 8 }}>{star}</span>
                    <span style={{ fontSize: 12, color: T.starActive }}>★</span>
                    <div style={{ flex: 1, height: 6, background: T.inputBg, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: ratingTotal > 0 ? `${(count / ratingTotal) * 100}%` : '0%', background: T.starActive, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: T.ink3, fontWeight: 600, width: 18, textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '12px 24px' }}>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: T.ink3, fontSize: 14, fontWeight: 600 }}>No reviews yet for this school.</div>
              ) : reviews.map((r, i) => (
                <div key={r.id} style={{ padding: '16px 0', borderBottom: i < reviews.length - 1 ? `1px solid ${T.inputBg}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: school.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: school.color, fontSize: 13, flexShrink: 0 }}>
                      {r.author.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{r.author}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                        <span style={{ fontSize: 12, color: T.ink3, fontWeight: 600 }}>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {r.tag && <span style={{ fontSize: 11, fontWeight: 700, color: school.color, background: school.color + '15', borderRadius: T.btnR, padding: '2px 8px' }}>{r.tag}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 14, color: s <= r.rating ? T.starActive : T.starEmpty }}>★</span>)}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: T.ink2, lineHeight: 1.65, paddingLeft: 48 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Enquiry modal ────────────────────────────────────────────────────── */}
      {enquireOpen && !sent && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlay, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: T.cardBg, borderRadius: 18, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: T.ink }}>Enquire about {school.name}</div>
                <div style={{ fontSize: 13, color: T.ink3 }}>We reply via phone and email within 24h</div>
              </div>
              <button onClick={() => setEnqOpen(false)} style={{ border: 'none', background: T.inputBg, borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: T.ink3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, display: 'block', marginBottom: 5 }}>Full name *</label>
                  <input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Mrs Adaeze Obi" style={{ width: '100%', border: `1.5px solid ${T.line}`, borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, display: 'block', marginBottom: 5 }}>Phone *</label>
                  <input value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+234 800 000 0000" style={{ width: '100%', border: `1.5px solid ${T.line}`, borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, display: 'block', marginBottom: 5 }}>Email *</label>
                <input value={form.email} onChange={e => setF('email', e.target.value)} placeholder="you@gmail.com" style={{ width: '100%', border: `1.5px solid ${T.line}`, borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, display: 'block', marginBottom: 8 }}>Which level? <span style={{ color: T.ink3, fontWeight: 500 }}>(optional)</span></label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {LEVELS.map(l => {
                    const active = selectedLevels.includes(l);
                    return <button key={l} onClick={() => toggleLevel(l)} style={{ border: `1.5px solid ${active ? school.color : T.line}`, background: active ? school.color + '15' : T.cardBg, color: active ? school.color : T.ink3, borderRadius: T.btnR, padding: '6px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>{l}</button>;
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, display: 'block', marginBottom: 5 }}>Message</label>
                <textarea value={form.message} onChange={e => setF('message', e.target.value)} placeholder="Questions about admission, fees or facilities…" rows={3} style={{ width: '100%', border: `1.5px solid ${T.line}`, borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button
                onClick={submitEnquiry}
                disabled={sending || !form.name || !form.phone || !form.email}
                style={{ border: 'none', background: (!form.name || !form.phone || !form.email) ? T.disabledBg : school.color, color: T.accentText, borderRadius: 10, padding: '13px', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: (!form.name || !form.phone || !form.email) ? 'not-allowed' : 'pointer', transition: 'background .2s' }}
              >{sending ? 'Sending…' : 'Send enquiry →'}</button>
            </div>
          </div>
        </div>
      )}
      {sent && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlay, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: T.cardBg, borderRadius: 18, padding: '48px', textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 6 }}>Enquiry sent!</div>
            <div style={{ fontSize: 14, color: T.ink3, marginBottom: 20 }}>{school.name} will be in touch within 24 hours.</div>
            <button onClick={() => { setSent(false); setEnqOpen(false); setForm({ name: '', phone: '', email: '', message: '' }); setSelectedLevels([]); }} style={{ border: 'none', background: school.color, color: '#fff', borderRadius: 10, padding: '10px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Done</button>
          </div>
        </div>
      )}

      {/* ── Save school modal ────────────────────────────────────────────────── */}
      {saveOpen && (
        <div style={{ position: 'fixed', inset: 0, background: T.overlay, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: T.cardBg, borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.3)' }}>
            <div style={{ padding: '32px 28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>❤️</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 6 }}>Save {school.name}</div>
              <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.5 }}>Sign in to save schools, compare options and track your applications across devices.</div>
            </div>
            <div style={{ padding: '4px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => toast('Google sign-in coming soon!')} style={{ width: '100%', border: `1.5px solid ${T.line}`, background: T.cardBg, borderRadius: 10, padding: '11px 16px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: T.ink2 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: T.ink3, fontWeight: 600 }}>— or —</div>
              <button onClick={() => { toggleFav(); setSaveOpen(false); }} style={{ width: '100%', border: 'none', background: T.accent, color: T.accentText, borderRadius: 10, padding: '11px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Save to this device ♥</button>
              <button onClick={() => setSaveOpen(false)} style={{ width: '100%', border: 'none', background: 'none', padding: '8px', fontFamily: 'inherit', fontSize: 13.5, color: T.ink3, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
