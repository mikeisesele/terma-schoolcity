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

const LEVELS = ['Nursery', 'Primary', 'JSS', 'SSS'] as const;
type Level = (typeof LEVELS)[number];

type FacilityCard = {
  label: string;
  emoji: string;
  color: string;
  photoCount: number;
  urls: string[];
};

function featureEmoji(label: string): { emoji: string; color: string } {
  const l = label.toLowerCase();
  if (l.includes('science'))                              return { emoji: '🔬', color: '#1A3D2C' };
  if (l.includes('computer') || l.includes('ict'))       return { emoji: '💻', color: '#15294B' };
  if (l.includes('library'))                              return { emoji: '📚', color: '#B87D20' };
  if (l.includes('transport') || l.includes('bus'))      return { emoji: '🚌', color: '#E2922B' };
  if (l.includes('sport') || l.includes('field'))        return { emoji: '⚽', color: '#1F8A5B' };
  if (l.includes('swimming') || l.includes('pool'))      return { emoji: '🏊', color: '#0284C7' };
  if (l.includes('boarding') || l.includes('hostel'))    return { emoji: '🏠', color: '#4B5563' };
  if (l.includes('music'))                               return { emoji: '🎵', color: '#7C3AED' };
  if (l.includes('dining') || l.includes('cafeteria'))   return { emoji: '🍽️', color: '#D4591A' };
  if (l.includes('security'))                            return { emoji: '🔐', color: '#2A6FDB' };
  if (l.includes('assembly') || l.includes('hall'))      return { emoji: '🏛️', color: '#7C3AED' };
  if (l.includes('sick') || l.includes('medical'))       return { emoji: '🩺', color: '#C41E3A' };
  if (l.includes('nursery') || l.includes('playground')) return { emoji: '🧒', color: '#C2692A' };
  if (l.includes('art') || l.includes('studio'))         return { emoji: '🎨', color: '#B87D20' };
  if (l.includes('garden') || l.includes('farm'))        return { emoji: '🌿', color: '#1F8A5B' };
  if (l.includes('chapel') || l.includes('mosque'))      return { emoji: '🕌', color: '#5B21B6' };
  return { emoji: '🏫', color: '#3D7058' };
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
  const router   = useRouter();
  const params   = useParams();
  const rawId    = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');

  const { school, loading: schoolLoading, notFound } = useSchool(rawId);
  const { reviews }                                  = useReviews(school?.id);
  const { byCategory: photosByCategory }             = useSchoolPhotos(school?.id);
  const { achievements }                             = useSchoolAchievements(school?.id);

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
    try {
      const f = JSON.parse(localStorage.getItem('sc_favs') || '[]');
      setIsFav(f.includes(rawId));
    } catch {}
  }, [rawId]);

  useEffect(() => {
    if (lightbox === null || !facilityModal) return;
    const n = facilityModal.photoCount;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowLeft')  setLightbox(p => ((p ?? 0) - 1 + n) % n);
      if (e.key === 'ArrowRight') setLightbox(p => ((p ?? 0) + 1) % n);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, facilityModal]);

  if (schoolLoading) return <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#374151' }}>Loading…</div>;
  if (notFound || !school) return <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#374151' }}>School not found.</div>;

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
    setSelectedLevels(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    );

  const submitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) return;
    setSending(true);
    try {
      const payload: Record<string, unknown> = {
        school_id:    school.id,
        parent_name:  form.name,
        parent_phone: form.phone,
        parent_email: form.email,
        message:      form.message || null,
        source:       'schoolnet',
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

  // ── Facilities — real photos from DB, fallback to static CDN pools ────────────
  const fallbackImages = deriveFacilityImages(school.features);
  const facilityList: FacilityCard[] = school.features.map(label => {
    const { emoji, color } = featureEmoji(label);
    const dbPhotos = photosByCategory[label] ?? [];
    const fallback = fallbackImages[label] ?? [];
    const urls = dbPhotos.length > 0 ? dbPhotos.map(p => p.url) : fallback;
    return { label, emoji, color, photoCount: urls.length, urls };
  });

  // ── Awards — platform auto-badges + DB achievements ───────────────────────────
  const platformBadges = [
    school.verified && { icon: '✅', label: 'SchoolOS Verified',        sub: 'Identity & facilities verified by SchoolOS',          color: '#1A3D2C', bg: '#E3EDE6' },
    school.ktPlan === 'Premium' && { icon: '⭐', label: 'SchoolOS Premium', sub: 'Full platform — GPS, fees, CBT, analytics',        color: '#B87D20', bg: '#F5EDD0' },
    school.rating >= 4.7 && { icon: '🏆', label: 'Top Rated',           sub: `${school.rating}/5 by ${school.reviews} parents`,     color: '#7A4A00', bg: '#FEF3C7' },
    school.scholarships > 2 && { icon: '🎓', label: 'Scholarship Excellence', sub: `${school.scholarships} scholarship programmes`, color: '#5B21B6', bg: '#EDE9FE' },
    school.features.length >= 5 && { icon: '🌟', label: 'Well-Equipped Campus', sub: `${school.features.length} verified facilities`, color: '#065F46', bg: '#D1FAE5' },
    school.established <= 2005 && { icon: '🏛️', label: 'Established Institution', sub: `${2026 - school.established}+ years of excellence`, color: '#1E3A5F', bg: '#DBEAFE' },
  ].filter(Boolean) as { icon: string; label: string; sub: string; color: string; bg: string }[];

  const dbBadges = achievements.map(a => {
    const { icon, color, bg } = achievementStyle(a.type);
    const parts = [a.description, a.issuedAt ? new Date(a.issuedAt).getFullYear().toString() : null].filter(Boolean);
    return { icon, label: a.title, sub: parts.join(' · '), color, bg };
  });

  const allBadges = [...platformBadges, ...dbBadges];

  // ── Rating distribution from loaded reviews ───────────────────────────────────
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  const ratingDistTotal = ratingDist.reduce((s, r) => s + r.count, 0);

  const tabs: [string, string][] = [
    ['overview', 'Overview'],
    ['jobs', `Vacancies (${school.vacancies})`],
    ['scholarships', `Scholarships (${school.scholarships})`],
    ['map', 'Map'],
  ];

  // ── Shared facility grid (single campus + inside campus accordion) ────────────
  const FacilityGrid = ({ compact = false }: { compact?: boolean }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: compact ? 12 : 16 }}>
      {(facilityList.length > 0
        ? facilityList
        : school.features.map(f => ({ label: f, ...featureEmoji(f), photoCount: 0, urls: [] }))
      ).map(f => (
        <div
          key={f.label}
          onClick={() => setFM(f)}
          style={{
            background: f.color + '10', borderRadius: T.cardR,
            padding: compact ? '16px 14px' : '22px 18px',
            textAlign: 'center', cursor: 'pointer',
            border: `1.5px solid ${f.color}22`,
            transition: 'all .2s', boxShadow: '0 2px 8px rgba(0,0,0,.05)',
          }}
          onMouseEnter={e => {
            const d = e.currentTarget as HTMLDivElement;
            d.style.transform = 'translateY(-3px)';
            d.style.background = f.color + '1E';
            d.style.boxShadow = `0 8px 24px ${f.color}30`;
          }}
          onMouseLeave={e => {
            const d = e.currentTarget as HTMLDivElement;
            d.style.transform = 'none';
            d.style.background = f.color + '10';
            d.style.boxShadow = '0 2px 8px rgba(0,0,0,.05)';
          }}
        >
          <div style={{ fontSize: compact ? 30 : 36, marginBottom: compact ? 8 : 10 }}>{f.emoji}</div>
          <div style={{ fontSize: compact ? 13 : 14, fontWeight: 800, color: T.ink, marginBottom: 6 }}>{f.label}</div>
          {f.photoCount > 0
            ? <div style={{ fontSize: 12, fontWeight: 800, color: f.color, background: f.color + '15', borderRadius: T.btnR, padding: '3px 10px', display: 'inline-block' }}>
                📷 {f.photoCount} {f.photoCount === 1 ? 'photo' : 'photos'}
              </div>
            : <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600 }}>No photos yet</div>
          }
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font }}>
      <SCNav
        onBack={() => router.push('/')}
        backLabel="← Back to directory"
        rightSlot={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: school.name, text: (school.tagline || school.name) + ' · ' + school.city, url });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(url).then(() => toast('Link copied!'));
                }
              }}
              style={{ border: `1.5px solid ${T.navInk}25`, background: 'transparent', color: T.navInk, borderRadius: T.btnR, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >↗ Share</button>
            <button
              onClick={() => isFav ? toggleFav() : setSaveOpen(true)}
              style={{ border: `1.5px solid ${T.navInk}25`, background: isFav ? `${T.accent}15` : 'transparent', color: isFav ? T.accent : T.navInk, borderRadius: T.btnR, padding: '7px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}
            >{isFav ? '♥ Saved' : '♡ Save'}</button>
            <button
              onClick={() => setEnqOpen(true)}
              style={{ border: 'none', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '9px 20px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
            >Enquire now</button>
          </div>
        }
      />

      {/* ── Hero banner ────────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg,${school.color} 0%,${school.color}cc 60%,${school.color}77 100%)`, position: 'relative', overflow: 'hidden', minHeight: 300 }}>
        {school.bannerUrl && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${school.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 50px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: school.bannerUrl ? 'linear-gradient(to bottom,rgba(0,0,0,.25) 0%,rgba(0,0,0,.72) 100%)' : 'linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.55) 100%)' }} />
        <div style={{ position: 'relative', padding: '32px 40px', display: 'flex', alignItems: 'flex-end', minHeight: 260 }}>
          <div style={{ paddingBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 72, height: 72, borderRadius: T.cardR, background: 'rgba(255,255,255,.18)', border: '3px solid rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', flexShrink: 0, overflow: 'hidden' }}>
                {school.imageUrl
                  ? <img src={school.imageUrl} alt={school.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#fff', fontSize: 30, fontWeight: 900 }}>{school.name[0]}</span>
                }
              </div>
              <div>
                <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.3)', lineHeight: 1.1 }}>{school.name}</h1>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {school.verified && (
                    <span style={{ background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.4)', borderRadius: T.btnR, fontSize: 11, fontWeight: 800, color: '#fff', padding: '3px 10px' }}>✓ Verified</span>
                  )}
                  {school.ktPlan === 'Premium' && (
                    <span style={{ background: 'rgba(184,125,32,.85)', border: '1px solid rgba(255,255,255,.3)', borderRadius: T.btnR, fontSize: 11, fontWeight: 800, color: '#fff', padding: '3px 10px' }}>⭐ Premium</span>
                  )}
                  {school.rating >= 4.7 && (
                    <span style={{ background: 'rgba(245,158,11,.85)', border: '1px solid rgba(255,255,255,.3)', borderRadius: T.btnR, fontSize: 11, fontWeight: 800, color: '#fff', padding: '3px 10px' }}>🏆 Top Rated</span>
                  )}
                </div>
              </div>
            </div>
            {school.tagline && (
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,.85)', fontWeight: 400, marginBottom: 8 }}>{school.tagline}</div>
            )}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>📍 {school.city}</span>
              {school.established > 0 && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>Est. {school.established}</span>}
              {school.students && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>👥 {school.students} students</span>}
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>🎓 {school.levels}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tags + rating strip ─────────────────────────────────────────────── */}
      <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.line}`, padding: '10px 40px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {[school.type, school.gender, school.orientation, school.transport ? 'Transport available' : null, school.boarding ? 'Boarding available' : null]
          .filter(Boolean).map(t => (
            <span key={t as string} style={{ fontSize: 12.5, fontWeight: 700, color: T.ink2, background: T.bg, borderRadius: T.btnR, padding: '4px 10px', border: `1px solid ${T.line}` }}>{t}</span>
          ))}
        {school.special && (school.specialFocus ?? []).map(sf => (
          <span key={sf} style={{ fontSize: 12.5, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', borderRadius: T.btnR, padding: '4px 10px', border: '1px solid #C4B5FD' }}>{sf}</span>
        ))}
        <div style={{ flex: 1 }} />
        <Stars rating={school.rating} />
        <button
          onClick={() => setRO(true)}
          style={{ border: 'none', background: 'none', color: T.accent, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
        >{school.reviews} reviews</button>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.line}`, paddingLeft: 36, display: 'flex' }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ border: 'none', borderBottom: tab === id ? `3px solid ${school.color}` : '3px solid transparent', background: 'transparent', padding: '12px 18px', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === id ? 800 : 600, color: tab === id ? school.color : T.ink3, cursor: 'pointer', transition: 'all .15s', marginBottom: -1 }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 40px' }}>

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            {/* About + Quick info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 28, alignItems: 'stretch' }}>
              <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '24px 28px', boxShadow: `0 2px 12px ${T.shadowColor}` }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 800, color: T.ink }}>About {school.name}</h3>
                <p style={{ margin: '0 0 16px', fontSize: 15, color: T.ink2, fontWeight: 400, lineHeight: 1.75 }}>
                  {school.name} is a verified {school.type.toLowerCase()} school in {school.city}, offering {school.levels} education for {school.gender.toLowerCase()} students.
                  {school.established > 0 ? ` Since ${school.established}, the school has been committed to academic excellence and holistic development.` : ''}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[school.type, school.gender, school.orientation, school.transport ? 'Transport' : null, school.boarding ? 'Boarding' : null]
                    .filter(Boolean).map(t => (
                      <span key={t as string} style={{ fontSize: 12.5, fontWeight: 700, color: T.ink2, background: T.bg, borderRadius: T.btnR, padding: '5px 12px', border: `1px solid ${T.line}` }}>{t}</span>
                    ))}
                </div>
              </div>
              <div style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${T.cardBorder}`, padding: '22px 20px', boxShadow: `0 2px 12px ${T.shadowColor}`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.ink3, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>Quick info</div>
                {(([
                  ['📍', school.address || school.city],
                  school.phone ? ['📞', school.phone] : null,
                  school.email ? ['✉️', school.email] : null,
                  (school.feeFrom > 0 || school.feeTo > 0) ? ['💰', `₦${(school.feeFrom / 1000).toFixed(0)}k – ₦${(school.feeTo / 1000).toFixed(0)}k per term`] : null,
                ] as ([string, string] | null)[]).filter(Boolean) as [string, string][]).map(([e, v]) => (
                  <div key={v} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 13.5, color: T.ink2, fontWeight: 500, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, fontSize: 15 }}>{e}</span>
                    <span style={{ lineHeight: 1.45 }}>{v}</span>
                  </div>
                ))}
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => setEnqOpen(true)}
                  style={{ width: '100%', marginTop: 12, border: 'none', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '12px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                >Send enquiry →</button>
              </div>
            </div>

            {/* Campus & Facilities */}
            {school.campuses && school.campuses.length > 1 ? (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: T.ink }}>Campuses &amp; Facilities</h3>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: T.ink3 }}>Select a campus to view its facilities</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {school.campuses.map((c, i) => {
                    const isOpen = expandedCampus === c.name;
                    return (
                      <div key={i} style={{ background: T.cardBg, borderRadius: T.cardR, border: `1.5px solid ${isOpen ? school.color : T.cardBorder}`, boxShadow: isOpen ? `0 4px 20px ${school.color}20` : `0 2px 8px ${T.shadowColor}`, overflow: 'hidden', transition: 'border-color .2s, box-shadow .2s' }}>
                        <button onClick={() => setExpandedCampus(isOpen ? null : c.name)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: school.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📍</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: T.ink, marginBottom: 3 }}>{c.name}</div>
                            <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 500 }}>{c.address}</div>
                            {c.phone && <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600, marginTop: 4 }}>{c.phone}</div>}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isOpen ? school.color : T.ink3, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {isOpen ? 'Hide' : 'Facilities'}
                            <span style={{ fontSize: 16, lineHeight: 1, display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>›</span>
                          </div>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${T.line}` }}>
                            <p style={{ margin: '14px 0 12px', fontSize: 13, color: T.ink3 }}>Click any facility to view photos</p>
                            <FacilityGrid compact />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: T.ink }}>Campus &amp; Facilities</h3>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: T.ink3 }}>Click any facility to view photos</p>
                {facilityList.length === 0 && school.features.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: T.ink3, fontSize: 14, fontWeight: 600 }}>No facilities listed yet.</div>
                ) : (
                  <FacilityGrid />
                )}
              </div>
            )}

            {/* Awards & Recognition */}
            {allBadges.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: T.ink }}>Awards &amp; Recognition</h3>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: T.ink3 }}>Verified achievements, accreditations and badges</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {allBadges.map((a, i) => (
                    <div key={i} style={{ background: a.bg, borderRadius: T.cardR, padding: '16px', border: `1.5px solid ${a.color}22`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{a.icon}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: a.color, marginBottom: 3, lineHeight: 1.2 }}>{a.label}</div>
                        {a.sub && <div style={{ fontSize: 12, color: a.color + 'AA', fontWeight: 500, lineHeight: 1.4 }}>{a.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Vacancies ────────────────────────────────────────────────────── */}
        {tab === 'jobs' && (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            {school.vacancies === 0 ? (
              <>
                <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink3 }}>No open vacancies at this time.</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, marginBottom: 8 }}>{school.vacancies} open {school.vacancies === 1 ? 'vacancy' : 'vacancies'}</div>
                <div style={{ fontSize: 14, color: T.ink3, fontWeight: 500, marginBottom: 20 }}>Enquire directly for details on available positions and how to apply.</div>
                <button onClick={() => setEnqOpen(true)} style={{ border: 'none', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '11px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Enquire about vacancies →</button>
              </>
            )}
          </div>
        )}

        {/* ── Scholarships ─────────────────────────────────────────────────── */}
        {tab === 'scholarships' && (
          <div>
            {school.scholarships === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: T.ink3, fontSize: 15, fontWeight: 600 }}>No scholarship programmes listed at this time.</div>
            ) : (
              <>
                <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: T.cardR, padding: '16px 20px', fontSize: 14, color: '#92400E', fontWeight: 600, marginBottom: 20 }}>
                  🎓 {school.name} offers {school.scholarships} scholarship programme{school.scholarships !== 1 ? 's' : ''}. Enquire directly to learn about eligibility and how to apply.
                </div>
                <div style={{ textAlign: 'center', padding: '24px 48px' }}>
                  <button onClick={() => setEnqOpen(true)} style={{ border: 'none', background: '#D97706', color: '#fff', borderRadius: T.btnR, padding: '12px 28px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Enquire about scholarships →</button>
                </div>
              </>
            )}
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
                  <div style={{ fontSize: 13, color: T.ink3, fontWeight: 600 }}>{[school.phone, school.email].filter(Boolean).join(' · ')}</div>
                )}
              </div>
            </div>
            <div style={{ borderRadius: T.cardR, overflow: 'hidden', border: `1.5px solid ${T.cardBorder}`, height: 420 }}>
              <iframe title="School map" src="https://www.openstreetmap.org/export/embed.html?bbox=7.37%2C9.09%2C7.43%2C9.13&layer=mapnik&marker=9.1092%2C7.3911" width="100%" height="420" style={{ border: 'none', display: 'block' }} loading="lazy" />
            </div>
          </div>
        )}
      </div>

      {/* ── Facility modal ──────────────────────────────────────────────────── */}
      {facilityModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: '1px solid #E5E9EC', flexShrink: 0 }}>
              <span style={{ fontSize: 24 }}>{facilityModal.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>{facilityModal.label}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{facilityModal.photoCount > 0 ? `${facilityModal.photoCount} photo${facilityModal.photoCount !== 1 ? 's' : ''}` : 'No photos uploaded yet'}</div>
              </div>
              <button onClick={() => { setFM(null); setLightbox(null); }} style={{ border: 'none', background: '#F3F4F6', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {facilityModal.photoCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{facilityModal.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>No photos uploaded for this facility yet.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {facilityModal.urls.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightbox(idx)}
                      style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: facilityModal.color + '18', transition: 'transform .15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}
                    >
                      <img src={url} alt={facilityModal.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Full-screen lightbox ─────────────────────────────────────────────── */}
      {facilityModal && lightbox !== null && facilityModal.photoCount > 0 && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, backdropFilter: 'blur(4px)' }}>
          <button onClick={e => { e.stopPropagation(); setLightbox(null); }} style={{ position: 'absolute', top: 24, right: 28, border: 'none', background: 'rgba(255,255,255,.14)', borderRadius: '50%', width: 48, height: 48, cursor: 'pointer', fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>✕</button>
          <button onClick={e => { e.stopPropagation(); setLightbox(p => ((p ?? 0) - 1 + facilityModal.photoCount) % facilityModal.photoCount); }} style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,.14)', borderRadius: '50%', width: 54, height: 54, cursor: 'pointer', fontSize: 26, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>‹</button>
          <div onClick={e => e.stopPropagation()} style={{ width: 'min(900px,90vw)', maxHeight: '82vh', aspectRatio: '4/3', borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.6)', position: 'relative' }}>
            <img src={facilityModal.urls[lightbox % facilityModal.urls.length]} alt={facilityModal.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{facilityModal.label}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>Photo {lightbox + 1} of {facilityModal.photoCount}</div>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); setLightbox(p => ((p ?? 0) + 1) % facilityModal.photoCount); }} style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,.14)', borderRadius: '50%', width: 54, height: 54, cursor: 'pointer', fontSize: 26, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>›</button>
          <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            {facilityModal.urls.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightbox(i); }} style={{ width: i === lightbox ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === lightbox ? '#fff' : 'rgba(255,255,255,.4)', cursor: 'pointer', padding: 0, transition: 'all .25s' }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Reviews modal ────────────────────────────────────────────────────── */}
      {reviewsOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.62)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 600, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.35)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E9EC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>Parent reviews</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>Submitted via the SchoolOS Parent App</div>
              </div>
              <button onClick={() => setRO(false)} style={{ border: 'none', background: '#F3F4F6', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {/* Rating breakdown */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E9EC', display: 'flex', gap: 24, alignItems: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#111827', lineHeight: 1 }}>{school.rating.toFixed(1)}</div>
                <Stars rating={school.rating} />
                <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, marginTop: 3 }}>{school.reviews} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {ratingDist.map(({ star, count }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 700, width: 8 }}>{star}</span>
                    <span style={{ fontSize: 13, color: '#F59E0B' }}>★</span>
                    <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: ratingDistTotal > 0 ? `${(count / ratingDistTotal) * 100}%` : '0%', background: '#F59E0B', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, width: 18, textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Review cards */}
            <div style={{ flex: 1, overflow: 'auto', padding: '12px 24px' }}>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>No reviews yet for this school.</div>
              ) : reviews.map((r, i) => (
                <div key={r.id} style={{ padding: '16px 0', borderBottom: i < reviews.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: school.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: school.color, fontSize: 13, flexShrink: 0 }}>
                      {r.author.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{r.author}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                        <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {r.tag && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: school.color, background: school.color + '15', borderRadius: T.btnR, padding: '2px 8px' }}>{r.tag}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ fontSize: 14, color: s <= r.rating ? '#F59E0B' : '#E5E7EB' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: '#374151', fontWeight: 500, lineHeight: 1.65, paddingLeft: 48 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Enquiry modal ────────────────────────────────────────────────────── */}
      {enquireOpen && !sent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E9EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>Enquire about {school.name}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>We reply via phone and email within 24h</div>
              </div>
              <button onClick={() => setEnqOpen(false)} style={{ border: 'none', background: '#F3F4F6', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 5 }}>Full name *</label>
                  <input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Mrs Adaeze Obi" style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 5 }}>Phone *</label>
                  <input value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+234 800 000 0000" style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 5 }}>Email *</label>
                <input value={form.email} onChange={e => setF('email', e.target.value)} placeholder="you@gmail.com" style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 8 }}>Which level? <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(optional)</span></label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {LEVELS.map(l => {
                    const active = selectedLevels.includes(l);
                    return (
                      <button key={l} onClick={() => toggleLevel(l)} style={{ border: `1.5px solid ${active ? school.color : '#E5E9EC'}`, background: active ? school.color + '15' : '#fff', color: active ? school.color : '#6B7280', borderRadius: T.btnR, padding: '6px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>{l}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 5 }}>Message</label>
                <textarea value={form.message} onChange={e => setF('message', e.target.value)} placeholder="Questions about admission, fees or facilities…" rows={3} style={{ width: '100%', border: '1.5px solid #E5E9EC', borderRadius: 8, padding: '9px 12px', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button
                onClick={submitEnquiry}
                disabled={sending || !form.name || !form.phone || !form.email}
                style={{ border: 'none', background: (!form.name || !form.phone || !form.email) ? '#D1D5DB' : school.color, color: '#fff', borderRadius: 10, padding: '13px', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: (!form.name || !form.phone || !form.email) ? 'not-allowed' : 'pointer', transition: 'background .2s' }}
              >{sending ? 'Sending…' : 'Send enquiry →'}</button>
            </div>
          </div>
        </div>
      )}
      {sent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '48px', textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Enquiry sent!</div>
            <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 500, marginBottom: 20 }}>{school.name} will be in touch within 24 hours.</div>
            <button onClick={() => { setSent(false); setEnqOpen(false); setForm({ name: '', phone: '', email: '', message: '' }); setSelectedLevels([]); }} style={{ border: 'none', background: school.color, color: '#fff', borderRadius: 10, padding: '10px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Done</button>
          </div>
        </div>
      )}

      {/* ── Save school modal ────────────────────────────────────────────────── */}
      {saveOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.3)' }}>
            <div style={{ padding: '32px 28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>❤️</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 6 }}>Save {school.name}</div>
              <div style={{ fontSize: 13.5, color: T.ink3, fontWeight: 500, lineHeight: 1.5 }}>Sign in to save schools, compare options and track your applications across devices.</div>
            </div>
            <div style={{ padding: '4px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => toast('Google sign-in coming soon!')}
                style={{ width: '100%', border: '1.5px solid #E5E9EC', background: '#fff', borderRadius: 10, padding: '11px 16px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#374151' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <div style={{ textAlign: 'center', fontSize: 12, color: T.ink3, fontWeight: 600 }}>— or —</div>
              <button
                onClick={() => { toggleFav(); setSaveOpen(false); }}
                style={{ width: '100%', border: 'none', background: T.accent, color: T.accentText, borderRadius: 10, padding: '11px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
              >Save to this device ♥</button>
              <button onClick={() => setSaveOpen(false)} style={{ width: '100%', border: 'none', background: 'none', padding: '8px', fontFamily: 'inherit', fontSize: 13.5, color: T.ink3, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
