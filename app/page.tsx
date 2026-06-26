'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CAROUSEL, SN_PARENT_FEATURES } from '@/lib/data';
import { T } from '@/lib/tokens';
import { SNNav, SNCard, SNCompareBar, SNCompareModal, SNAuthModal } from '@/components/ui';
import { useSchools } from '@/lib/useSchools';
import type { School } from '@/lib/data';

export default function SNHome() {
  const router = useRouter();
  const { schools } = useSchools();
  // Carousel uses static CAROUSEL for ordering until live data has ordering support
  const carousel = schools.filter(s => !s.special).slice(0, CAROUSEL.length);
  const [q, setQ]         = useState('');
  const [catF, setCatF]   = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [slide, setSlide] = useState(0);
  const [favs, setFavs]   = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [user, setUser] = useState<{name:string;email:string;avatar:string;color:string}|null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authReason, setAuthReason] = useState('save');
  const [pendingFavId, setPendingFavId] = useState<string|null>(null);

  useEffect(() => {
    try { const u = localStorage.getItem('sn_user'); if (u) setUser(JSON.parse(u)); } catch {}
    try { const f = localStorage.getItem('sn_favs'); if (f) setFavs(JSON.parse(f)); } catch {}
    try { const c = localStorage.getItem('sn_compare'); if (c) setCompare(JSON.parse(c)); } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s+1) % (carousel.length || 1)), 4500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setSlide(s => (s - 1 + carousel.length) % (carousel.length || 1));
      if (e.key === 'ArrowRight') setSlide(s => (s + 1) % (carousel.length || 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const signIn = (account: {name:string;email:string;avatar:string;color:string}) => {
    setUser(account);
    try { localStorage.setItem('sn_user', JSON.stringify(account)); } catch {}
    setShowAuth(false);
    if (pendingFavId) { doToggleFav(pendingFavId, account); setPendingFavId(null); }
    toast('Welcome, ' + account.name.split(' ')[0] + '!');
  };
  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem('sn_user'); } catch {}
    toast('Signed out');
  };
  const doToggleFav = (id: string, u?: typeof user) => {
    const who = u || user;
    if (!who) return;
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id];
      try { localStorage.setItem('sn_favs', JSON.stringify(next)); } catch {}
      toast(next.includes(id) ? 'School saved ♥' : 'Removed from saved');
      return next;
    });
  };
  const toggleFav = (id: string) => {
    if (!user) { setPendingFavId(id); setAuthReason('save'); setShowAuth(true); return; }
    doToggleFav(id);
  };
  const toggleCompare = (id: string) => setCompare(prev => {
    if (prev.includes(id)) { const n = prev.filter(x=>x!==id); try { localStorage.setItem('sn_compare', JSON.stringify(n)); } catch {} return n; }
    if (prev.length >= 3) { toast('You can compare up to 3 schools'); return prev; }
    const next = [...prev, id];
    try { localStorage.setItem('sn_compare', JSON.stringify(next)); } catch {}
    return next;
  });

  const onSelect = (s: School) => router.push('/schools/' + s.id);
  const onNav = (v: string) => {
    if (v === 'find') router.push('/find');
    else if (v === 'find-vacancy') router.push('/vacancies');
    else if (v === 'favorites') router.push('/favourites');
    else if (v === 'list-school') router.push('/list');
  };

  const shown = schools.filter(s => {
    const ms = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.city.toLowerCase().includes(q.toLowerCase());
    const mc = catF==='All'||(catF==='Nursery'&&s.levels.includes('Nursery'))||(catF==='Primary'&&s.levels.includes('Primary'))||(catF==='Secondary'&&(s.levels.includes('JSS')||s.levels.includes('SSS')))||(catF==='Boarding'&&s.boarding)||(catF==='Scholarships'&&s.scholarships>0)||(catF==='Special Needs'&&!!s.special);
    return ms && mc;
  });
  const shown9 = showAll ? shown : shown.slice(0, 9);
  const C = (s: School) => <SNCard key={s.id} school={s} onSelect={onSelect} isFav={favs.includes(s.id)} onToggleFav={toggleFav} inCompare={compare.includes(s.id)} onToggleCompare={toggleCompare}/>;

  const userSlot = user
    ? <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <button onClick={() => router.push('/favourites')} style={{ border:`1.5px solid ${T.navInk}25`, background:favs.length>0?`${T.accent}15`:'transparent', color:T.navInk, borderRadius:T.btnR, padding:'6px 13px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ color:favs.length>0?'#EF4444':T.navInk }}>♥</span> Saved{favs.length>0&&<span style={{ background:'#EF4444', color:'#fff', borderRadius:999, fontSize:10, fontWeight:800, padding:'1px 6px', marginLeft:2 }}>{favs.length}</span>}
        </button>
        <div style={{ width:30, height:30, borderRadius:'50%', background:T.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>{user.avatar||user.name[0]}</div>
        <span style={{ fontSize:13, fontWeight:700, color:T.navInk }}>{user.name.split(' ')[0]}</span>
        <button onClick={signOut} style={{ border:`1px solid ${T.navInk}22`, background:'transparent', color:`${T.navInk}60`, borderRadius:T.btnR, padding:'4px 9px', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>Sign out</button>
      </div>
    : <button onClick={()=>{ setAuthReason('signin'); setShowAuth(true); }} style={{ border:`1.5px solid ${T.navInk}28`, background:'transparent', color:T.navInk, borderRadius:T.btnR, padding:'7px 16px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>Sign in</button>;

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SNNav onNav={onNav} rightSlot={userSlot}/>

      {/* Featured school carousel — padded, rounded */}
      <div style={{ padding:'28px 40px 0' }}>
        <div style={{ position:'relative', borderRadius:28, overflow:'hidden', height:420 }}>
          {carousel.map((s, i) => (
            <div key={s.id} style={{ position:'absolute', inset:0, transition:'opacity 1.2s cubic-bezier(.4,0,.2,1)', opacity:i===slide?1:0, pointerEvents:i===slide?'auto':'none', background:'linear-gradient(135deg,'+s.color+' 0%,'+s.color+'dd 45%,'+s.color+'99 100%)' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 50px)' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,0,0,.62) 0%, rgba(0,0,0,.38) 40%, rgba(0,0,0,.05) 70%, rgba(0,0,0,0) 100%)' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.3) 0%, rgba(0,0,0,0) 50%)' }}/>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 60px' }}>
                <div style={{ flex:1, maxWidth:540 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.62)', letterSpacing:1.8, textTransform:'uppercase', marginBottom:12 }}>Featured school · {s.city}</div>
                  <h2 style={{ margin:'0 0 8px', fontSize:44, fontWeight:800, color:'#fff', lineHeight:1.05, letterSpacing:'-.02em' }}>{s.name}</h2>
                  <p style={{ margin:'0 0 18px', fontSize:17, color:'rgba(255,255,255,.78)', fontWeight:400 }}>{s.tagline}</p>
                  <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                    {[s.levels, s.type, s.transport?'Transport':null].filter(Boolean).map(t=><span key={t as string} style={{ fontSize:13, fontWeight:700, color:'#fff', background:'rgba(255,255,255,.18)', borderRadius:T.btnR, padding:'5px 14px', border:'1px solid rgba(255,255,255,.28)', backdropFilter:'blur(4px)' }}>{t}</span>)}
                  </div>
                  <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:24 }}>
                    <span style={{ fontSize:14, color:'#F59E0B', fontWeight:700 }}>{'★'.repeat(Math.floor(s.rating))}{'☆'.repeat(5-Math.floor(s.rating))}</span>
                    <span style={{ color:'rgba(255,255,255,.65)', fontSize:13 }}>{s.rating} · {s.reviews} reviews · {s.students} students</span>
                  </div>
                  <div style={{ display:'flex', gap:12 }}>
                    <button onClick={()=>onSelect(s)} style={{ border:'none', background:'#fff', color:s.color, borderRadius:T.btnR, padding:'13px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>View profile →</button>
                    <button onClick={()=>onSelect(s)} style={{ border:'2px solid rgba(255,255,255,.5)', background:'transparent', color:'#fff', borderRadius:T.btnR, padding:'12px 24px', fontFamily:'inherit', fontSize:14, fontWeight:700, cursor:'pointer' }}>Enquire</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)', display:'flex', gap:7 }}>
            {carousel.map((_,i)=><button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?22:7, height:7, borderRadius:4, border:'none', background:i===slide?'rgba(255,255,255,.95)':'rgba(255,255,255,.38)', cursor:'pointer', padding:0, transition:'all .3s' }}/>)}
          </div>
          <div style={{ position:'absolute', bottom:18, right:20, display:'flex', gap:0 }}>
            <button onClick={e=>{e.stopPropagation();setSlide(s=>(s-1+carousel.length)%carousel.length);}} style={{ border:'none', background:'rgba(0,0,0,.28)', backdropFilter:'blur(8px)', color:'#fff', width:40, height:36, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px 0 0 6px', borderRight:'1px solid rgba(255,255,255,.15)' }}>‹</button>
            <button onClick={e=>{e.stopPropagation();setSlide(s=>(s+1)%(carousel.length||1));}} style={{ border:'none', background:'rgba(0,0,0,.28)', backdropFilter:'blur(8px)', color:'#fff', width:40, height:36, fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0 6px 6px 0' }}>›</button>
          </div>
        </div>
      </div>

      {/* Search + category pills */}
      <div style={{ background:'linear-gradient(180deg,'+T.bg+' 0%,'+T.bg+' 100%)', padding:'36px 48px 28px', textAlign:'center' }}>
        <div style={{ maxWidth:640, margin:'0 auto', display:'flex', alignItems:'stretch', gap:0, background:T.cardBg, borderRadius:T.btnR, boxShadow:'0 4px 24px rgba(40,80,55,.12)', border:'1.5px solid '+T.cardBorder, overflow:'hidden', height:58 }}>
          <span style={{ padding:'0 18px', fontSize:20, color:T.ink3, display:'flex', alignItems:'center' }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="School name, area, or city…" style={{ flex:1, border:'none', outline:'none', fontSize:16, fontWeight:500, color:T.ink, fontFamily:T.font, background:'transparent' }}/>
          <button style={{ border:'none', background:T.accent, color:T.accentText, padding:'0 36px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:T.font, borderRadius:'0 100px 100px 0' }}>Search</button>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:20, flexWrap:'wrap' }}>
          {['All','Nursery','Primary','Secondary','Boarding','Scholarships','Special Needs'].map(f => (
            <button key={f} onClick={()=>setCatF(f)} style={{ border:'none', borderRadius:T.btnR, padding:'8px 18px', fontFamily:'inherit', fontSize:13, fontWeight:catF===f?800:600, color:catF===f?T.filterActiveText:T.filterInactiveText, background:catF===f?T.filterActiveBg:T.filterInactiveBg, cursor:'pointer', transition:'all .15s' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Masonry results */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'20px 48px 48px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          {(q || catF!=='All') ? <span style={{ fontSize:13.5, color:T.ink3, fontWeight:600 }}>{shown.length} school{shown.length!==1?'s':''} found</span> : <span/>}
          <button onClick={()=>onNav('find')} style={{ border:'1.5px solid '+T.cardBorder, background:T.cardBg, color:T.accent, borderRadius:T.btnR, padding:'8px 20px', fontFamily:'inherit', fontSize:13, fontWeight:800, cursor:'pointer' }}>See all {schools.length.toLocaleString()} schools →</button>
        </div>
        <div style={{ columnCount:3, columnGap:16 }}>{shown9.map(s=>C(s))}{shown.length===0&&<div style={{ columnSpan:'all', padding:'64px', textAlign:'center', color:T.ink3, fontSize:15 }}>No schools match your search.</div>}</div>
        {shown.length > 9 && !showAll && <div style={{ textAlign:'center', marginTop:8 }}><button onClick={()=>setShowAll(true)} style={{ border:'1.5px solid '+T.cardBorder, background:T.cardBg, color:T.accent, borderRadius:T.btnR, padding:'10px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Show all</button></div>}
      </div>

      {/* For parents */}
      <div style={{ background:T.accent, padding:'36px 48px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'340px 1fr', gap:56, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.accentText+'70', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>For parents</div>
            <h2 style={{ fontSize:34, fontWeight:800, color:T.accentText, lineHeight:1.1, margin:'0 0 12px', letterSpacing:'-.01em' }}>Be part of your child&apos;s school day.<br/>From anywhere.</h2>
            <p style={{ fontSize:14, color:T.accentText+'78', lineHeight:1.65, margin:'0 0 22px' }}>KidTrack keeps you connected to everything that matters — attendance, fees, safety, and more — live on your phone.</p>
            <a href="https://kidtrack.ng" style={{ display:'inline-flex', flexDirection:'column', alignItems:'flex-start', border:'1.5px solid '+T.accentText+'55', background:'transparent', color:T.accentText, borderRadius:'10px', padding:'13px 24px', fontFamily:T.font, cursor:'pointer', textDecoration:'none' }}>
              <span style={{ fontSize:14, fontWeight:800, lineHeight:1.2 }}>Visit KidTrack to learn more →</span>
              <span style={{ fontSize:11.5, color:T.accentText+'70', marginTop:4, fontWeight:500 }}>then share it with your child&apos;s school.</span>
            </a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>{SN_PARENT_FEATURES.map(f=><div key={f.title} style={{ background:T.accentText+'0D', borderRadius:12, padding:'22px 18px', border:'1px solid '+T.accentText+'15', minHeight:160 }}><div style={{ fontSize:24, marginBottom:10 }}>{f.emoji}</div><div style={{ fontSize:13.5, fontWeight:800, color:T.accentText, marginBottom:6, lineHeight:1.25 }}>{f.title}</div><div style={{ fontSize:12.5, color:T.accentText+'62', lineHeight:1.55 }}>{f.text}</div></div>)}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:T.footerBg, padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:16, fontWeight:700, color:T.footerText }}>School Net <span style={{ fontStyle:'italic', opacity:.6 }}>by KidTrack</span></span>
        <span style={{ fontSize:11, color:T.footerText, opacity:.5 }}>© 2026 KidTrack Technologies Ltd.</span>
      </div>

      {compare.length > 0 && <SNCompareBar compareIds={compare} onOpen={()=>setCompareOpen(true)} onRemove={id=>{const n=compare.filter(x=>x!==id);setCompare(n);try{localStorage.setItem('sn_compare',JSON.stringify(n));}catch{}}} onClear={()=>{setCompare([]);try{localStorage.removeItem('sn_compare');}catch{}}} />}
      {compareOpen && <SNCompareModal compareIds={compare} onClose={()=>setCompareOpen(false)} onRemove={id=>{const n=compare.filter(x=>x!==id);setCompare(n);try{localStorage.setItem('sn_compare',JSON.stringify(n));}catch{}}} onSelect={s=>{setCompareOpen(false);onSelect(s);}} />}
      {showAuth && <SNAuthModal onClose={()=>setShowAuth(false)} onSuccess={signIn} reason={authReason} />}
    </div>
  );
}
