'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { SN_SCHOOLS, MOCK_REVIEWS } from '@/lib/data';
import type { School } from '@/lib/data';
import { T } from '@/lib/tokens';
import { SCNav, Stars } from '@/components/ui';
import { supabase } from '@/lib/supabase';

type Facility = { label: string; emoji: string; color: string; photos: number; detail: string; images?: string[] };

export default function SNDetail() {
  const router = useRouter();
  const params = useParams();
  const rawId = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');

  // First try the static list (short IDs like 'gf', 'hc')
  const staticSchool = SN_SCHOOLS.find(s => s.id === rawId) ?? null;
  const [school, setSchool] = useState<School | null>(staticSchool);
  const [schoolLoading, setSchoolLoading] = useState(!staticSchool);

  // If not found in static list, attempt a live DB lookup (UUID from /find)
  useEffect(() => {
    if (staticSchool) return;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
    if (!isUuid) { setSchoolLoading(false); return; }
    setSchoolLoading(true);
    supabase
      .from('schools')
      .select('id, name, logo_url, address, phone, email, motto, plan, primary_colour, status')
      .eq('id', rawId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSchool({
            id: data.id,
            name: data.name,
            ktPlan: data.plan === 'premium' ? 'Premium' : data.plan === 'standard' ? 'Standard' : undefined,
            city: data.address ?? 'Nigeria',
            state: 'NG',
            type: 'Day',
            gender: 'Mixed',
            levels: 'Nursery–SSS',
            orientation: 'Non-denominational',
            transport: false,
            boarding: false,
            rating: 4.5,
            reviews: 0,
            verified: data.status === 'active',
            feeFrom: 0,
            feeTo: 0,
            color: data.primary_colour ?? '#1A3D2C',
            tagline: data.motto ?? '',
            features: [],
            scholarships: 0,
            vacancies: 0,
            students: '',
            established: 2000,
            address: data.address ?? '',
            phone: data.phone ?? '',
            email: data.email ?? '',
          });
        }
        setSchoolLoading(false);
      });
  }, [rawId, staticSchool]);

  const [tab, setTab]           = useState('overview');
  const [enquireOpen, setEnqOpen] = useState(false);
  const [sent, setSent]         = useState(false);
  const [form, setForm]         = useState({ name:'', phone:'', email:'', message:'' });
  const [facilityModal, setFM]  = useState<Facility|null>(null);
  const [lightbox, setLightbox] = useState<number|null>(null);
  const [reviewsOpen, setRO]    = useState(false);
  const [isFav, setIsFav]       = useState(false);
  const [expandedCampus, setExpandedCampus] = useState<string|null>(null);

  useEffect(() => {
    try { const f = JSON.parse(localStorage.getItem('sc_favs')||'[]'); setIsFav(f.includes(rawId)); } catch {}
  }, [rawId]);

  useEffect(() => {
    if (lightbox === null || !facilityModal) return;
    const n = facilityModal.photos;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') setLightbox(p => ((p ?? 0) - 1 + n) % n);
      if (e.key === 'ArrowRight') setLightbox(p => ((p ?? 0) + 1) % n);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, facilityModal]);

  if (schoolLoading) return <div style={{ padding:40, fontFamily:'sans-serif', color:'#374151' }}>Loading…</div>;
  if (!school) return <div style={{ padding:40, fontFamily:'sans-serif', color:'#374151' }}>School not found.</div>;

  const setF = (k: string, v: string) => setForm(p=>({...p,[k]:v}));
  const toggleFav = () => {
    try {
      const f: string[] = JSON.parse(localStorage.getItem('sc_favs')||'[]');
      const next = f.includes(school.id) ? f.filter(x=>x!==school.id) : [...f, school.id];
      localStorage.setItem('sc_favs', JSON.stringify(next));
      setIsFav(next.includes(school.id));
      toast(next.includes(school.id) ? 'School saved ♥' : 'Removed from saved');
    } catch {}
  };

  const tabs: [string,string][] = [['overview','Overview'],['jobs','Vacancies ('+school.vacancies+')'],['scholarships','Scholarships ('+school.scholarships+')'],['map','Map']];

  const hasNurseryPrimary = /nursery|primary/i.test(school.levels ?? '');

  const fi = school.facilityImages ?? {};
  const facilityList: Facility[] = [
    { label:'Science Lab',    emoji:'🔬', color:'#1A3D2C', photos: fi['Science Lab']?.length    ?? 5,  detail:'Fully equipped for WAEC/NECO Biology, Chemistry & Physics practicals', images: fi['Science Lab'] },
    { label:'Computer Lab',   emoji:'💻', color:'#15294B', photos: fi['Computer Lab']?.length   ?? 4,  detail:'40 workstations, broadband internet, coding curriculum',              images: fi['Computer Lab'] },
    { label:'Library',        emoji:'📚', color:'#B87D20', photos: fi['Library']?.length        ?? 3,  detail:'3,000+ books, quiet reading room, digital catalogue',                images: fi['Library'] },
    { label:'Sports Ground',  emoji:'⚽', color:'#1F8A5B', photos: fi['Sports Ground']?.length  ?? 6,  detail:'Football pitch, basketball court, athletics track',                  images: fi['Sports Ground'] },
    { label:'Transport',      emoji:'🚌', color:'#E2922B', photos: fi['Transport']?.length      ?? 3,  detail:'GPS-tracked buses covering major routes',                            images: fi['Transport'] },
    { label:'Swimming Pool',  emoji:'🏊', color:'#0284C7', photos: fi['Swimming Pool']?.length  ?? 2,  detail:'Olympic-standard pool, trained lifeguards on duty',                  images: fi['Swimming Pool'] },
    { label:'Boarding House', emoji:'🏠', color:'#4B5563', photos: fi['Boarding House']?.length ?? 3,  detail:'Safe, supervised residential quarters with house parents',            images: fi['Boarding House'] },
    { label:'Music Room',     emoji:'🎵', color:'#7C3AED', photos: fi['Music Room']?.length     ?? 2,  detail:'Instruments, recording space, choir and band practice area',         images: fi['Music Room'] },
    { label:'Dining Hall',    emoji:'🍽️', color:'#D4591A', photos: fi['Cafeteria']?.length      ?? 2,  detail:'Hot meals, dietary options available',                               images: fi['Cafeteria'] },
    { label:'Security',       emoji:'🔐', color:'#2A6FDB', photos: 2,  detail:'CCTV surveillance, gated compound, security personnel' },
    { label:'Assembly Hall',  emoji:'🏛️', color:'#7C3AED', photos: 3,  detail:'Capacity 500+, air-conditioned, AV system' },
    { label:'Sick Bay',       emoji:'🩺', color:'#C41E3A', photos: fi['Sick Bay']?.length       ?? 2,  detail:'First aid, rest beds, nurse on duty',                               images: fi['Sick Bay'] },
    ...(hasNurseryPrimary ? [{ label:'Nursery & Primary Facilities', emoji:'🧒', color:'#C2692A', photos: fi['Nursery & Primary Facilities']?.length ?? 4, detail:'Classrooms, play areas, sensory rooms and outdoor learning spaces for Nursery and Primary pupils', images: fi['Nursery & Primary Facilities'] ?? fi['Playground'] } as Facility] : []),
  ].filter(f => f.label === 'Nursery & Primary Facilities'
    ? true
    : school.features.some(sf => sf.toLowerCase().includes(f.label.toLowerCase().split(' ')[0].toLowerCase())));

  const mockScholarships = [
    { title:'Academic Excellence Bursary', provider:'School Alumni Foundation', category:'Bursary', value:'₦250,000/term', slots:3, remaining:2, deadline:'31 Jul 2026', covers:['Tuition (partial)','Books & materials'], eligibility:['Top 5% of class in previous term','Financial need demonstrated','Parent income declaration required'], steps:['Download application form','Attach last term result','Submit to school admin'], applyEmail:'bursary@school.edu.ng' },
    { title:'Sports Scholarship', provider:'School Sports Committee', category:'Scholarship', value:'50% tuition', slots:5, remaining:3, deadline:'15 Aug 2026', covers:['Tuition (50%)','Sports kit','Coaching sessions'], eligibility:['Varsity-level athlete','Maintains 60%+ academic average'], steps:['Sports trial with coach','Academic assessment','Letter of recommendation'], applyEmail:'sports@school.edu.ng' },
    { title:'Girls in STEM Scholarship', provider:'TechBridge Nigeria', category:'Scholarship', value:'100% tuition', slots:4, remaining:1, deadline:'20 Aug 2026', covers:['Full tuition','STEM textbooks','Lab coat & equipment','Mentorship sessions'], eligibility:['Female student','Mathematics above 75%','Science above 75%','SSS entry only'], steps:['Online application','STEM aptitude test','Panel interview'], applyEmail:'stem@techbridge.ng' },
    { title:'Alumni Bursary', provider:'Old Students Association', category:'Bursary', value:'₦150,000/term', slots:6, remaining:4, deadline:'1 Sep 2026', covers:['Tuition (partial)','Examination fees'], eligibility:['Financial need demonstrated','Good conduct record'], steps:['Submit income declaration','Two references','Panel interview'], applyEmail:'alumni@school.edu.ng' },
  ].slice(0, Math.max(school.scholarships||1, 1));

  const ratingBreakdown: [number,number][] = [[5,68],[4,31],[3,14],[2,8],[1,6]];
  const totalReviews = ratingBreakdown.reduce((s,[,n])=>s+n,0);

  const autoAwards = [
    school.verified && { icon:'✅', label:'SchoolOS Verified', sub:'Identity & facilities verified by SchoolOS', color:'#1A3D2C', bg:'#E3EDE6' },
    school.ktPlan==='Premium' && { icon:'⭐', label:'SchoolOS Premium School', sub:'Full platform — GPS, fees, CBT, analytics', color:'#B87D20', bg:'#F5EDD0' },
    school.rating >= 4.7 && { icon:'🏆', label:'Top Rated School', sub:'Rated '+school.rating+'/5 by '+school.reviews+' parents', color:'#7A4A00', bg:'#FEF3C7' },
    school.scholarships > 2 && { icon:'🎓', label:'Scholarship Excellence', sub:school.scholarships+' scholarship programmes available', color:'#5B21B6', bg:'#EDE9FE' },
    school.established <= 2005 && { icon:'🏛️', label:'Established Institution', sub:'Over '+(2026-school.established)+' years of academic excellence', color:'#1E3A5F', bg:'#DBEAFE' },
    school.features.length >= 5 && { icon:'🌟', label:'Well-Equipped Campus', sub:school.features.length+' verified facilities', color:'#065F46', bg:'#D1FAE5' },
  ].filter(Boolean) as { icon:string; label:string; sub:string; color:string; bg:string }[];

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SCNav onBack={() => router.push('/')} backLabel="← Back to directory"
        rightSlot={
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>{ const url = window.location.href; if(navigator.share){navigator.share({title:school.name,text:school.tagline+' · '+school.city,url});}else{navigator.clipboard&&navigator.clipboard.writeText(url).then(()=>toast('Link copied!'));} }} style={{ border:`1.5px solid ${T.navInk}25`, background:'transparent', color:T.navInk, borderRadius:T.btnR, padding:'7px 14px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>↗ Share</button>
            <button onClick={toggleFav} style={{ border:`1.5px solid ${T.navInk}25`, background:isFav?`${T.accent}15`:'transparent', color:isFav?T.accent:T.navInk, borderRadius:T.btnR, padding:'7px 14px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .2s' }}>
              {isFav ? '♥ Saved' : '♡ Save'}
            </button>
            <button onClick={()=>setEnqOpen(true)} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'9px 20px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Enquire now</button>
          </div>
        } />

      {/* Banner */}
      <div style={{ background:'linear-gradient(135deg,'+school.color+' 0%,'+school.color+'cc 60%,'+school.color+'77 100%)', position:'relative', overflow:'hidden', minHeight:300 }}>
        {school.bannerUrl && <div style={{ position:'absolute', inset:0, backgroundImage:`url(${school.bannerUrl})`, backgroundSize:'cover', backgroundPosition:'center' }}/>}
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 50px)' }}/>
        <div style={{ position:'absolute', inset:0, background: school.bannerUrl ? 'linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,.72) 100%)' : 'linear-gradient(to bottom, rgba(0,0,0,.05) 0%, rgba(0,0,0,.55) 100%)' }}/>
        <div style={{ position:'relative', padding:'32px 40px', display:'flex', alignItems:'flex-end', minHeight:260 }}>
          <div style={{ paddingBottom:4 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:68, height:68, borderRadius:T.cardR, background:'rgba(255,255,255,.18)', border:'3px solid rgba(255,255,255,.6)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
                <span style={{ color:'#fff', fontSize:28, fontWeight:900 }}>{school.name[0]}</span>
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:'#fff', textShadow:'0 2px 8px rgba(0,0,0,.3)', lineHeight:1.1 }}>{school.name}</h1>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {school.verified&&<span style={{ background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.4)', borderRadius:T.btnR, fontSize:11, fontWeight:800, color:'#fff', padding:'2px 8px' }}>✓ Verified</span>}
                  {school.ktPlan==='Premium'&&<span style={{ background:'rgba(184,125,32,.85)', border:'1px solid rgba(255,255,255,.3)', borderRadius:T.btnR, fontSize:11, fontWeight:800, color:'#fff', padding:'2px 8px' }}>⭐ SchoolOS Premium</span>}
                </div>
              </div>
            </div>
            <div style={{ fontSize:16, color:'rgba(255,255,255,.8)', fontWeight:400, marginBottom:6 }}>{school.tagline}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.65)', fontWeight:600 }}>📍 {school.city} · Est. {school.established} · {school.students} students · {school.levels}</div>
          </div>
        </div>
      </div>

      {/* Tags + rating strip */}
      <div style={{ background:T.cardBg, borderBottom:`1px solid ${T.line}`, padding:'10px 40px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        {[school.type, school.gender, school.orientation, school.transport?'Transport available':null, school.boarding?'Boarding available':null].filter(Boolean).map(t=>(
          <span key={t as string} style={{ fontSize:12.5, fontWeight:700, color:T.ink2, background:T.bg, borderRadius:T.btnR, padding:'4px 10px', border:`1px solid ${T.line}` }}>{t}</span>
        ))}
        {school.special&&(school.specialFocus||[]).map(sf=>(
          <span key={sf} style={{ fontSize:12.5, fontWeight:700, color:'#7C3AED', background:'#EDE9FE', borderRadius:T.btnR, padding:'4px 10px', border:'1px solid #C4B5FD' }}>{sf}</span>
        ))}
        <div style={{ flex:1 }} />
        <Stars rating={school.rating} />
        <button onClick={()=>setRO(true)} style={{ border:'none', background:'none', color:T.accent, fontFamily:'inherit', fontSize:12.5, fontWeight:700, cursor:'pointer', textDecoration:'underline', padding:0 }}>{school.reviews} reviews</button>
      </div>

      {/* Tabs */}
      <div style={{ background:T.cardBg, borderBottom:`1px solid ${T.line}`, paddingLeft:36, display:'flex' }}>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ border:'none', borderBottom:tab===id?`3px solid ${school.color}`:'3px solid transparent', background:'transparent', padding:'12px 18px', fontFamily:'inherit', fontSize:14, fontWeight:tab===id?800:600, color:tab===id?school.color:T.ink3, cursor:'pointer', transition:'all .15s', marginBottom:-1 }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 40px' }}>
        {tab==='overview'&&(
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, marginBottom:28, alignItems:'stretch' }}>
              <div style={{ background:T.cardBg, borderRadius:T.cardR, border:'1.5px solid '+T.cardBorder, padding:'24px 28px', boxShadow:'0 2px 12px '+T.shadowColor }}>
                <h3 style={{ margin:'0 0 12px', fontSize:17, fontWeight:800, color:T.ink }}>About {school.name}</h3>
                <p style={{ margin:'0 0 16px', fontSize:15, color:T.ink2, fontWeight:400, lineHeight:1.75 }}>{school.name} is a verified {school.type.toLowerCase()} school in {school.city}, offering {school.levels} education for {school.gender.toLowerCase()} students. Since {school.established}, the school has been committed to academic excellence and holistic development — producing graduates who are confident, capable and ready for the world.</p>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {[school.type, school.gender, school.orientation, school.transport?'Transport available':null, school.boarding?'Boarding available':null].filter(Boolean).map(t=>(
                    <span key={t as string} style={{ fontSize:12.5, fontWeight:700, color:T.ink2, background:T.bg, borderRadius:T.btnR, padding:'5px 12px', border:'1px solid '+T.line }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ background:T.cardBg, borderRadius:T.cardR, border:'1.5px solid '+T.cardBorder, padding:'22px 20px', boxShadow:'0 2px 12px '+T.shadowColor, display:'flex', flexDirection:'column' }}>
                <div style={{ fontSize:11, fontWeight:800, color:T.ink3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>Quick info</div>
                {[['📍',school.address],['📞',school.phone],['✉️',school.email],['💰','₦'+(school.feeFrom/1000).toFixed(0)+'k – ₦'+(school.feeTo/1000).toFixed(0)+'k per term']].map(([e,v])=>(
                  <div key={v} style={{ display:'flex', gap:10, marginBottom:12, fontSize:13.5, color:T.ink2, fontWeight:500, alignItems:'flex-start' }}>
                    <span style={{ flexShrink:0, fontSize:15 }}>{e}</span><span style={{ lineHeight:1.45 }}>{v}</span>
                  </div>
                ))}
                <div style={{ flex:1 }}/>
                <button onClick={()=>setEnqOpen(true)} style={{ width:'100%', marginTop:12, border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'12px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Send enquiry →</button>
              </div>
            </div>

            {school.campuses && school.campuses.length > 1 ? (
              <div style={{ marginBottom:28 }}>
                <h3 style={{ margin:'0 0 4px', fontSize:17, fontWeight:800, color:T.ink }}>Our campuses</h3>
                <p style={{ margin:'0 0 16px', fontSize:14, color:T.ink3 }}>Select a campus to view its facilities</p>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {school.campuses.map((c, i) => {
                    const isOpen = expandedCampus === c.name;
                    return (
                      <div key={i} style={{ background:T.cardBg, borderRadius:T.cardR, border:'1.5px solid '+(isOpen ? school.color : T.cardBorder), boxShadow: isOpen ? '0 4px 20px '+school.color+'20' : '0 2px 8px '+T.shadowColor, overflow:'hidden', transition:'border-color .2s, box-shadow .2s' }}>
                        {/* Campus header — always visible, click to toggle */}
                        <button
                          onClick={() => setExpandedCampus(isOpen ? null : c.name)}
                          style={{ width:'100%', background:'none', border:'none', padding:'18px 20px', display:'flex', gap:14, alignItems:'center', cursor:'pointer', textAlign:'left' }}
                        >
                          <div style={{ width:40, height:40, borderRadius:10, background:school.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>📍</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:3 }}>{c.name}</div>
                            <div style={{ fontSize:12.5, color:T.ink2, fontWeight:500 }}>{c.address}</div>
                            {c.phone && <div style={{ fontSize:12, color:T.ink3, fontWeight:600, marginTop:4 }}>{c.phone}</div>}
                          </div>
                          <div style={{ fontSize:13, fontWeight:700, color: isOpen ? school.color : T.ink3, flexShrink:0, display:'flex', alignItems:'center', gap:4 }}>
                            {isOpen ? 'Hide' : 'Facilities'} <span style={{ fontSize:16, lineHeight:1, display:'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>›</span>
                          </div>
                        </button>

                        {/* Facilities grid — shown when expanded */}
                        {isOpen && (
                          <div style={{ padding:'0 20px 20px', borderTop:'1px solid '+T.line }}>
                            <p style={{ margin:'14px 0 12px', fontSize:13, color:T.ink3 }}>Click any facility to view photos</p>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                              {(facilityList.length>0 ? facilityList : school.features.map(f=>({ label:f, emoji:'🏫', color:school.color, photos:3, detail:'' }))).map(f=>(
                                <div key={f.label} onClick={()=>setFM(f)}
                                  style={{ background:f.color+'10', borderRadius:T.cardR, padding:'20px 16px', textAlign:'center', cursor:'pointer', border:'1.5px solid '+f.color+'22', transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}
                                  onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.background=f.color+'1E'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 8px 24px '+f.color+'30'; }}
                                  onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform='none'; (e.currentTarget as HTMLDivElement).style.background=f.color+'10'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 8px rgba(0,0,0,.05)'; }}>
                                  <div style={{ fontSize:34, marginBottom:10 }}>{f.emoji}</div>
                                  <div style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:5 }}>{f.label}</div>
                                  <div style={{ fontSize:12, color:T.ink3, fontWeight:400, lineHeight:1.4, marginBottom:8 }}>{f.detail}</div>
                                  <div style={{ fontSize:12, fontWeight:800, color:f.color, background:f.color+'15', borderRadius:T.btnR, padding:'3px 10px', display:'inline-block' }}>📷 {f.photos} photos</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom:4 }}>
                <h3 style={{ margin:'0 0 4px', fontSize:17, fontWeight:800, color:T.ink }}>Campus &amp; Facilities</h3>
                <p style={{ margin:'0 0 16px', fontSize:14, color:T.ink3 }}>Click any facility to view photos</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                  {(facilityList.length>0?facilityList:school.features.map(f=>({ label:f, emoji:'🏫', color:school.color, photos:3, detail:'' }))).map(f=>(
                    <div key={f.label} onClick={()=>setFM(f)}
                      style={{ background:f.color+'10', borderRadius:T.cardR, padding:'24px 20px', textAlign:'center', cursor:'pointer', border:'1.5px solid '+f.color+'22', transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,.05)' }}
                      onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.background=f.color+'1E'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 8px 24px '+f.color+'30'; }}
                      onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform='none'; (e.currentTarget as HTMLDivElement).style.background=f.color+'10'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 8px rgba(0,0,0,.05)'; }}>
                      <div style={{ fontSize:40, marginBottom:12 }}>{f.emoji}</div>
                      <div style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:6 }}>{f.label}</div>
                      <div style={{ fontSize:12.5, color:T.ink3, fontWeight:400, lineHeight:1.4, marginBottom:10 }}>{f.detail}</div>
                      <div style={{ fontSize:12.5, fontWeight:800, color:f.color, background:f.color+'15', borderRadius:T.btnR, padding:'4px 12px', display:'inline-block' }}>📷 {f.photos} photos</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {autoAwards.length > 0 && (
              <div style={{ marginTop:28 }}>
                <h3 style={{ margin:'0 0 4px', fontSize:17, fontWeight:800, color:T.ink }}>Awards &amp; Recognition</h3>
                <p style={{ margin:'0 0 16px', fontSize:14, color:T.ink3 }}>Verified achievements, accreditations and badges</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                  {autoAwards.map((a,i) => (
                    <div key={i} style={{ background:a.bg, borderRadius:T.cardR, padding:'16px 16px', border:'1.5px solid '+a.color+'22', display:'flex', gap:12, alignItems:'flex-start' }}>
                      <div style={{ fontSize:28, flexShrink:0, lineHeight:1 }}>{a.icon}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:800, color:a.color, marginBottom:3, lineHeight:1.2 }}>{a.label}</div>
                        <div style={{ fontSize:12, color:a.color+'99', fontWeight:500, lineHeight:1.4 }}>{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==='jobs'&&(
          <div>
            {school.vacancies===0
              ? <div style={{ textAlign:'center', padding:'48px', color:T.ink3, fontSize:15, fontWeight:600 }}>No open vacancies at this time.</div>
              : [{ title:'Mathematics Teacher', dept:'Secondary · Full-time', deadline:'30 Jul 2026', summary:'TRCN registered, 3+ years experience, SSS 1–3.' }, { title:'Basic Science Teacher', dept:'Secondary · Full-time', deadline:'25 Jul 2026', summary:'JSS 1–3, lab supervision experience required.' }, { title:'School Accountant', dept:'Administration · Full-time', deadline:'20 Jul 2026', summary:'B.Sc. Accounting, 3+ years, proficient in Excel.' }, { title:'ICT Coordinator', dept:'Administration · Full-time', deadline:'10 Aug 2026', summary:'Oversee computer lab and ICT infrastructure.' }, { title:'School Nurse', dept:'Non-academic · Full-time', deadline:'15 Jul 2026', summary:'Registered Nurse with valid NMCN licence.' }].slice(0,school.vacancies).map((v,i)=>(
                <div key={i} style={{ background:T.cardBg, border:`1.5px solid ${T.cardBorder}`, borderRadius:T.cardR, padding:'16px 18px', marginBottom:12, display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:11, background:school.color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>💼</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:T.ink, marginBottom:3, fontFamily:T.headFont }}>{v.title}</div>
                    <div style={{ fontSize:13, color:T.ink3, fontWeight:600, marginBottom:5 }}>{v.dept} · Deadline: {v.deadline}</div>
                    <div style={{ fontSize:13.5, color:T.ink2, fontWeight:500 }}>{v.summary}</div>
                  </div>
                  <button style={{ border:`2px solid ${school.color}`, background:T.cardBg, color:school.color, borderRadius:T.btnR, padding:'8px 18px', fontFamily:'inherit', fontSize:13, fontWeight:800, cursor:'pointer', flexShrink:0 }}>Apply</button>
                </div>
              ))
            }
          </div>
        )}

        {tab==='scholarships'&&(
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:T.cardR, padding:'12px 16px', fontSize:13.5, color:'#92400E', fontWeight:600 }}>
              🎓 {school.name} offers {school.scholarships} scholarship{school.scholarships!==1?'s':''} — apply directly through the school.
            </div>
            {mockScholarships.map((s,i)=>(
              <div key={i} style={{ background:T.cardBg, border:`1.5px solid ${T.cardBorder}`, borderRadius:T.cardR, overflow:'hidden' }}>
                <div style={{ background:'linear-gradient(90deg,#FFFBEB,#FEF3C7)', padding:'16px 20px', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid #FDE68A' }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'#FEF3C7', border:'2px solid #FCD34D', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>🎓</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:17, fontWeight:900, color:'#111827', marginBottom:2, fontFamily:T.headFont }}>{s.title}</div>
                    <div style={{ fontSize:13, color:'#6B7280', fontWeight:600 }}>By {s.provider}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:20, fontWeight:900, color:'#D97706' }}>{s.value}</div>
                    <div style={{ fontSize:12, color:'#6B7280', fontWeight:600 }}>{s.remaining} of {s.slots} slots left</div>
                  </div>
                </div>
                <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:T.ink2, textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>What it covers</div>
                    {s.covers.map(c=><div key={c} style={{ fontSize:13.5, color:T.ink2, fontWeight:500, marginBottom:5 }}>✓ {c}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:T.ink2, textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>Eligibility</div>
                    {s.eligibility.map(e=><div key={e} style={{ fontSize:12.5, color:T.ink2, fontWeight:500, marginBottom:5, display:'flex', gap:6 }}><span style={{ color:'#D97706', flexShrink:0 }}>•</span>{e}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:T.ink2, textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>How to apply</div>
                    {s.steps.map((step,si)=><div key={si} style={{ fontSize:12.5, color:T.ink2, fontWeight:500, marginBottom:5, display:'flex', gap:8 }}><span style={{ width:18, height:18, borderRadius:'50%', background:'#FEF3C7', color:'#D97706', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{si+1}</span>{step}</div>)}
                  </div>
                </div>
                <div style={{ padding:'12px 20px', borderTop:`1px solid ${T.line}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:T.cardFooterBg }}>
                  <div style={{ fontSize:13, color:T.ink3, fontWeight:600 }}>Deadline: <strong style={{ color:T.ink }}>{s.deadline}</strong> · {s.applyEmail}</div>
                  <button onClick={()=>setEnqOpen(true)} style={{ border:'none', background:'#D97706', color:'#fff', borderRadius:T.btnR, padding:'9px 20px', fontFamily:'inherit', fontSize:13, fontWeight:800, cursor:'pointer' }}>Enquire to apply →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='map'&&(
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:T.cardBg, borderRadius:T.cardR, padding:'12px 16px', border:`1.5px solid ${T.cardBorder}`, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>📍</span>
              <div><div style={{ fontSize:14.5, fontWeight:700, color:T.ink }}>{school.address}</div><div style={{ fontSize:13, color:T.ink3, fontWeight:600 }}>{school.phone} · {school.email}</div></div>
            </div>
            <div style={{ borderRadius:T.cardR, overflow:'hidden', border:`1.5px solid ${T.cardBorder}`, height:420 }}>
              <iframe title="School map" src="https://www.openstreetmap.org/export/embed.html?bbox=7.37%2C9.09%2C7.43%2C9.13&layer=mapnik&marker=9.1092%2C7.3911" width="100%" height="420" style={{ border:'none', display:'block' }} loading="lazy" />
            </div>
          </div>
        )}
      </div>

      {/* Facility modal */}
      {facilityModal&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.72)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:680, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.4)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'18px 20px', borderBottom:'1px solid #E5E9EC', flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{facilityModal.emoji}</span>
              <div style={{ flex:1 }}><div style={{ fontSize:16, fontWeight:800, color:'#111827' }}>{facilityModal.label}</div><div style={{ fontSize:13, color:'#6B7280' }}>{facilityModal.detail}</div></div>
              <button onClick={()=>{setFM(null);setLightbox(null);}} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {Array.from({ length:facilityModal.photos }, (_,idx)=>{
                  const imgSrc = facilityModal.images?.[idx % facilityModal.images.length];
                  return (
                    <div key={idx} onClick={()=>setLightbox(idx)}
                      style={{ aspectRatio:'4/3', borderRadius:12, background:`linear-gradient(135deg,${facilityModal.color} 0%,${facilityModal.color}99 100%)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', transition:'transform .15s', overflow:'hidden', position:'relative' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.transform='scale(1.03)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.transform='none'}>
                      {imgSrc
                        ? <img src={imgSrc} alt={facilityModal.label} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                        : <><span style={{ fontSize:40 }}>{facilityModal.emoji}</span><span style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:700 }}>Photo {idx+1}</span></>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen photo lightbox */}
      {facilityModal && lightbox!==null && (
        <div onClick={()=>setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.9)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:48, backdropFilter:'blur(4px)' }}>
          {/* Close */}
          <button onClick={(e)=>{e.stopPropagation();setLightbox(null);}} style={{ position:'absolute', top:24, right:28, border:'none', background:'rgba(255,255,255,.14)', borderRadius:'50%', width:48, height:48, cursor:'pointer', fontSize:22, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>✕</button>
          {/* Prev */}
          <button onClick={(e)=>{e.stopPropagation();setLightbox(p=>((p??0)-1+facilityModal.photos)%facilityModal.photos);}} style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-50%)', border:'none', background:'rgba(255,255,255,.14)', borderRadius:'50%', width:54, height:54, cursor:'pointer', fontSize:26, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>‹</button>
          {/* Photo */}
          {(() => {
            const imgSrc = facilityModal.images?.[lightbox % (facilityModal.images?.length ?? 1)];
            return (
              <div onClick={e=>e.stopPropagation()} style={{ width:'min(900px,90vw)', maxHeight:'82vh', aspectRatio:'4/3', borderRadius:28, overflow:'hidden', boxShadow:'0 40px 120px rgba(0,0,0,.6)', background:`linear-gradient(135deg,${facilityModal.color} 0%,${facilityModal.color}99 100%)`, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18 }}>
                {imgSrc
                  ? <img src={imgSrc} alt={facilityModal.label} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 1px,transparent 40px)' }} />
                }
                <div style={{ textAlign:'center', zIndex:1, position:'relative' }}>
                  {!imgSrc && <span style={{ fontSize:128, lineHeight:1, filter:'drop-shadow(0 8px 24px rgba(0,0,0,.3))' }}>{facilityModal.emoji}</span>}
                  <div style={{ marginTop: imgSrc ? 0 : 0, background: imgSrc ? 'rgba(0,0,0,.45)' : 'transparent', borderRadius:12, padding: imgSrc ? '8px 16px' : 0 }}>
                    <div style={{ fontSize:22, fontWeight:900, color:'#fff', textShadow:'0 2px 8px rgba(0,0,0,.35)' }}>{facilityModal.label}</div>
                    <div style={{ fontSize:14, color:'rgba(255,255,255,.85)', fontWeight:600, marginTop:4 }}>Photo {lightbox+1} of {facilityModal.photos}</div>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Next */}
          <button onClick={(e)=>{e.stopPropagation();setLightbox(p=>((p??0)+1)%facilityModal.photos);}} style={{ position:'absolute', right:28, top:'50%', transform:'translateY(-50%)', border:'none', background:'rgba(255,255,255,.14)', borderRadius:'50%', width:54, height:54, cursor:'pointer', fontSize:26, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>›</button>
          {/* Dots */}
          <div style={{ position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8 }}>
            {Array.from({ length:facilityModal.photos }, (_,i)=>(
              <button key={i} onClick={(e)=>{e.stopPropagation();setLightbox(i);}} style={{ width:i===lightbox?24:8, height:8, borderRadius:4, border:'none', background:i===lightbox?'#fff':'rgba(255,255,255,.4)', cursor:'pointer', padding:0, transition:'all .25s' }} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews modal */}
      {reviewsOpen&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.62)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:600, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.35)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div><div style={{ fontSize:17, fontWeight:800, color:'#111827' }}>Parent reviews — {school.name}</div><div style={{ fontSize:13, color:'#6B7280' }}>Submitted via the SchoolOS Parent App</div></div>
              <button onClick={()=>setRO(false)} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', gap:24, alignItems:'center', flexShrink:0 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:48, fontWeight:900, color:'#111827', lineHeight:1 }}>{school.rating}</div>
                <Stars rating={school.rating} />
                <div style={{ fontSize:12, color:'#9CA3AF', fontWeight:600, marginTop:3 }}>{school.reviews} reviews</div>
              </div>
              <div style={{ flex:1 }}>
                {ratingBreakdown.map(([star,count])=>(
                  <div key={star} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:12, color:'#6B7280', fontWeight:600, width:8 }}>{star}</span>
                    <span style={{ fontSize:13, color:'#F59E0B' }}>★</span>
                    <div style={{ flex:1, height:6, background:'#F3F4F6', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(count/totalReviews)*100}%`, background:'#F59E0B', borderRadius:3 }} />
                    </div>
                    <span style={{ fontSize:12, color:'#9CA3AF', fontWeight:600, width:18, textAlign:'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:'12px 24px' }}>
              {MOCK_REVIEWS.map((r,i)=>(
                <div key={i} style={{ padding:'14px 0', borderBottom:i<MOCK_REVIEWS.length-1?'1px solid #F3F4F6':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:school.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:school.color, fontSize:13, flexShrink:0 }}>{r.name.replace(/[^A-Z]/g,'').slice(0,2)}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{r.name}</div>
                      <div style={{ fontSize:12, color:'#9CA3AF', fontWeight:600 }}>{r.date} · {r.tag}</div>
                    </div>
                    <span style={{ fontSize:14, color:'#F59E0B', fontWeight:700 }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p style={{ margin:0, fontSize:14, color:'#374151', fontWeight:500, lineHeight:1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enquire modal */}
      {enquireOpen&&!sent&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:520, boxShadow:'0 24px 64px rgba(0,0,0,.3)', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div><div style={{ fontSize:17, fontWeight:800, color:'#111827' }}>Enquire about {school.name}</div><div style={{ fontSize:13, color:'#9CA3AF' }}>We reply via phone and email within 24h</div></div>
              <button onClick={()=>setEnqOpen(false)} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ flex:1 }}><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Full name</label><input value={form.name} onChange={e=>setF('name',e.target.value)} placeholder="e.g. Mrs Adaeze Obi" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
                <div style={{ flex:1 }}><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Phone</label><input value={form.phone} onChange={e=>setF('phone',e.target.value)} placeholder="+234 800 000 0000" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
              </div>
              <div><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Email</label><input value={form.email} onChange={e=>setF('email',e.target.value)} placeholder="you@gmail.com" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
              <div><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Message</label><textarea value={form.message} onChange={e=>setF('message',e.target.value)} placeholder="Questions about admission, fees or facilities..." rows={3} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, resize:'vertical', outline:'none', boxSizing:'border-box' }}/></div>
              <button onClick={()=>{if(form.name&&form.phone&&form.email)setSent(true);}} style={{ border:'none', background:school.color, color:'#fff', borderRadius:10, padding:'13px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>Send enquiry →</button>
            </div>
          </div>
        </div>
      )}
      {sent&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:18, padding:'48px', textAlign:'center', maxWidth:380 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:18, fontWeight:800, color:'#111827', marginBottom:6 }}>Enquiry sent!</div>
            <div style={{ fontSize:14, color:'#6B7280', fontWeight:500, marginBottom:20 }}>{school.name} will reply within 24 hours.</div>
            <button onClick={()=>{setSent(false);setEnqOpen(false);}} style={{ border:'none', background:school.color, color:'#fff', borderRadius:10, padding:'10px 24px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
