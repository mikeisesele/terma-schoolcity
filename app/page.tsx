'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SN_SCHOOLS, CAROUSEL, HIGHLY_RATED, SN_PARENT_FEATURES } from '@/lib/data';
import { T } from '@/lib/tokens';
import { SNNav, SNCard, SNCompareBar, SNCompareModal, SNAuthModal } from '@/components/ui';
import type { School } from '@/lib/data';

export default function SNHome() {
  const router = useRouter();
  const [slide, setSlide]   = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [state,  setState]  = useState('All States');
  const [favs,   setFavs]   = useState<string[]>([]);
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
    const t = setInterval(() => setSlide(s => (s+1) % CAROUSEL.length), 3500);
    return () => clearInterval(t);
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
    if (prev.includes(id)) return prev.filter(x=>x!==id);
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

  const filters = ['All','Nursery','Primary','Secondary','Boarding','With Scholarships','Special Needs'];
  const shown = SN_SCHOOLS.filter(s => {
    const q = search.toLowerCase();
    const ms = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
    const mf = filter==='All' || (filter==='Nursery'&&s.levels.includes('Nursery')) || (filter==='Primary'&&s.levels.includes('Primary')) || (filter==='Secondary'&&(s.levels.includes('JSS')||s.levels.includes('SSS'))) || (filter==='Boarding'&&s.boarding) || (filter==='With Scholarships'&&s.scholarships>0) || (filter==='Special Needs'&&s.special);
    const mst = state==='All States' || s.state===state || s.city.toLowerCase().includes(state.toLowerCase());
    return ms && mf && mst;
  });

  const userSlot = user
    ? <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <button onClick={() => router.push('/favourites')} style={{ border:'1.5px solid rgba(255,255,255,.3)', background:favs.length>0?'rgba(239,68,68,.25)':'transparent', color:'#fff', borderRadius:8, padding:'6px 13px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <span>♥</span> Saved{favs.length>0&&<span style={{ background:'#EF4444', color:'#fff', borderRadius:999, fontSize:10, fontWeight:800, padding:'1px 6px', marginLeft:2 }}>{favs.length}</span>}
        </button>
        <div style={{ width:30, height:30, borderRadius:'50%', background:'#B87D20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>{user.avatar||user.name[0]}</div>
        <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{user.name.split(' ')[0]}</span>
        <button onClick={signOut} style={{ border:'1px solid rgba(255,255,255,.3)', background:'transparent', color:'rgba(255,255,255,.65)', borderRadius:6, padding:'4px 9px', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>Sign out</button>
      </div>
    : <button onClick={()=>{ setAuthReason('signin'); setShowAuth(true); }} style={{ border:'1.5px solid rgba(255,255,255,.4)', background:'transparent', color:'#fff', borderRadius:8, padding:'7px 16px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>Sign in</button>;

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SNNav onNav={onNav}
        rightSlot={
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.12)', borderRadius:9, padding:'8px 14px', width:300 }}>
              <span style={{ color:'rgba(255,255,255,.6)', fontSize:16 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search schools by name, area…"
                style={{ flex:1, background:'none', border:'none', outline:'none', color:'#fff', fontFamily:'inherit', fontSize:14, fontWeight:500 }} />
            </div>
            {userSlot}
          </div>
        }
      />

      {/* Hero carousel */}
      <div style={{ position:'relative', height:420, overflow:'hidden', margin:T.heroRadius>0?`0 ${T.heroPad}px`:'0', borderRadius:T.heroRadius }}>
        {CAROUSEL.map((school, i) => (
          <div key={school.id} style={{ position:'absolute', inset:0, transition:'opacity 1.4s cubic-bezier(.4,0,.2,1)', opacity:i===slide?1:0, pointerEvents:i===slide?'auto':'none', background:`linear-gradient(135deg,${school.color} 0%,${school.color}dd 40%,${school.color}88 100%)` }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 50px)' }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 60px' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.65)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>Featured school · {school.city}</div>
                <h2 style={{ margin:'0 0 6px', fontSize:36, fontWeight:900, color:'#fff', lineHeight:1.1 }}>{school.name}</h2>
                <p style={{ margin:'0 0 14px', fontSize:17, color:'rgba(255,255,255,.8)', fontWeight:500 }}>{school.tagline}</p>
                <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                  {[school.levels, school.type, school.orientation, school.transport?'Transport':null].filter(Boolean).map(t=>(
                    <span key={t as string} style={{ fontSize:13, fontWeight:700, color:'#fff', background:'rgba(255,255,255,.2)', borderRadius:7, padding:'5px 12px', border:'1px solid rgba(255,255,255,.3)' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:22 }}>
                  <span style={{ fontSize:13, color:'#F59E0B', fontWeight:700 }}>{'★'.repeat(Math.floor(school.rating))}{'☆'.repeat(5-Math.floor(school.rating))} <span style={{ color:'rgba(255,255,255,.65)', fontSize:12 }}>{school.rating}</span></span>
                  <span style={{ color:'rgba(255,255,255,.65)', fontSize:13, fontWeight:600 }}>{school.reviews} reviews</span>
                  <span style={{ color:'rgba(255,255,255,.65)', fontSize:13, fontWeight:600 }}>{school.students} students</span>
                </div>
                <div style={{ display:'flex', gap:12 }}>
                  <button onClick={() => onSelect(school)} style={{ border:'none', background:'#fff', color:school.color, borderRadius:T.btnR, padding:'12px 28px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>View profile →</button>
                  <button onClick={() => onSelect(school)} style={{ border:'2px solid rgba(255,255,255,.5)', background:'transparent', color:'#fff', borderRadius:T.btnR, padding:'12px 24px', fontFamily:'inherit', fontSize:15, fontWeight:700, cursor:'pointer' }}>Enquire</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)', display:'flex', gap:7 }}>
          {CAROUSEL.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?22:7, height:7, borderRadius:4, border:'none', background:i===slide?'#fff':'rgba(255,255,255,.4)', cursor:'pointer', padding:0, transition:'all .3s' }} />
          ))}
        </div>
        <button onClick={()=>setSlide(s=>(s-1+CAROUSEL.length)%CAROUSEL.length)} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', border:'none', background:'rgba(255,255,255,.2)', color:'#fff', width:40, height:40, borderRadius:'50%', fontSize:18, cursor:'pointer' }}>‹</button>
        <button onClick={()=>setSlide(s=>(s+1)%CAROUSEL.length)} style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', border:'none', background:'rgba(255,255,255,.2)', color:'#fff', width:40, height:40, borderRadius:'50%', fontSize:18, cursor:'pointer' }}>›</button>
      </div>

      {/* Highly rated strip */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E9EC', padding:'16px 40px 20px' }}>
        <div style={{ fontSize:12, fontWeight:800, color:'#9CA3AF', letterSpacing:0.8, textTransform:'uppercase', marginBottom:12 }}>Highly rated schools</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {HIGHLY_RATED.map(school=>(
            <div key={school.id} onClick={()=>onSelect(school)} style={{ borderRadius:14, overflow:'hidden', border:'1.5px solid #E5E9EC', background:'#fff', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow=`0 6px 20px ${school.color}30`;(e.currentTarget as HTMLDivElement).style.borderColor=school.color;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none';(e.currentTarget as HTMLDivElement).style.borderColor='#E5E9EC';}}>
              <div style={{ height:52, background:`linear-gradient(135deg,${school.color} 0%,${school.color}bb 100%)`, display:'flex', alignItems:'center', padding:'0 14px', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{school.name[0]}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:800, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{school.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', fontWeight:600 }}>{school.city}</div>
                </div>
                {school.verified && <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(255,255,255,.25)', borderRadius:4, padding:'2px 6px', flexShrink:0 }}>✓</span>}
              </div>
              <div style={{ padding:'10px 14px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:13, color:'#F59E0B', fontWeight:700 }}>{'★'.repeat(Math.floor(school.rating))}{'☆'.repeat(5-Math.floor(school.rating))} <span style={{ color:'#9CA3AF', fontSize:12 }}>{school.rating}</span></span>
                  <span style={{ fontSize:11.5, color:'#9CA3AF', fontWeight:600 }}>{school.reviews} reviews</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:11.5, color:'#374151', fontWeight:600 }}>{school.levels}</div>
                  <div style={{ fontSize:11.5, color:'#6B7280', fontWeight:500 }}>{school.students}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 40px' }}>
        {/* Filter row */}
        <div style={{ display:'flex', gap:8, marginBottom:28, alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ fontSize:13.5, fontWeight:700, color:'#374151', marginRight:4 }}>Filter:</span>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ border:'none', borderRadius:8, padding:'7px 14px', fontFamily:'inherit', fontSize:13, fontWeight:filter===f?800:600, color:filter===f?'#fff':'#374151', background:filter===f?'#1A3D2C':'#E5E9EC', cursor:'pointer', transition:'all .15s' }}>{f}</button>
          ))}
          <div style={{ flex:1 }} />
          <select value={state} onChange={e=>setState(e.target.value)} style={{ border:'1.5px solid #E5E9EC', borderRadius:8, padding:'7px 12px', fontFamily:'inherit', fontSize:13, fontWeight:600, color:'#374151', background:'#fff', cursor:'pointer', outline:'none' }}>
            {['All States','FCT','Lagos','Rivers','Oyo','Kano','Plateau'].map(s=><option key={s}>{s}</option>)}
          </select>
          <span style={{ fontSize:13, color:'#9CA3AF', fontWeight:600 }}>{shown.length} school{shown.length!==1?'s':''} found</span>
        </div>

        {/* All schools */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:'#111827' }}>{search?`Results for "${search}"`:filter!=='All'?filter+' Schools':'All Schools'}</h3>
            <button onClick={()=>toast('Loading more schools…')} style={{ border:'none', background:'none', color:'#1A3D2C', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer', textDecoration:'underline' }}>See more →</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {shown.slice(0,8).map(s=><SNCard key={s.id} school={s} onSelect={onSelect} isFav={favs.includes(s.id)} onToggleFav={toggleFav} inCompare={compare.includes(s.id)} onToggleCompare={toggleCompare}/>)}
            {shown.length===0&&<div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px', color:'#9CA3AF', fontSize:15, fontWeight:600 }}>No schools match your search.</div>}
          </div>
          {shown.length>8&&<div style={{ textAlign:'center', marginTop:20 }}><button onClick={()=>toast('Loading more schools…')} style={{ border:'2px solid #1A3D2C', background:'#fff', color:'#1A3D2C', borderRadius:10, padding:'11px 32px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>See more schools →</button></div>}
        </div>

        {/* Scholarships */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:'#111827' }}>🎓 Schools offering scholarships</h3>
            <button onClick={()=>toast('Loading more scholarship schools…')} style={{ border:'none', background:'none', color:'#1A3D2C', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer', textDecoration:'underline' }}>See more →</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {SN_SCHOOLS.filter(s=>s.scholarships>0).slice(0,4).map(s=><SNCard key={s.id} school={s} onSelect={onSelect} isFav={favs.includes(s.id)} onToggleFav={toggleFav} inCompare={compare.includes(s.id)} onToggleCompare={toggleCompare}/>)}
          </div>
        </div>

        {/* Hiring */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4 }}>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:'#111827' }}>📋 Schools hiring now</h3>
            <button onClick={()=>toast('Loading more hiring schools…')} style={{ border:'none', background:'none', color:'#1A3D2C', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer', textDecoration:'underline' }}>See more →</button>
          </div>
          <p style={{ margin:'0 0 16px', fontSize:14, color:'#6B7280', fontWeight:500 }}>Teaching and non-teaching positions at verified schools near you.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {SN_SCHOOLS.filter(s=>s.vacancies>0).slice(0,4).map(s=><SNCard key={s.id} school={s} onSelect={onSelect} isFav={favs.includes(s.id)} onToggleFav={toggleFav} inCompare={compare.includes(s.id)} onToggleCompare={toggleCompare}/>)}
          </div>
        </div>

        {/* Special needs */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4 }}>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:'#111827' }}>♿ Special needs schools</h3>
            <button onClick={()=>setFilter('Special Needs')} style={{ border:'none', background:'none', color:'#1A3D2C', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer', textDecoration:'underline' }}>See all →</button>
          </div>
          <p style={{ margin:'0 0 16px', fontSize:14, color:'#6B7280', fontWeight:500 }}>Schools for children with visual impairment, hearing impairment, dyslexia, autism, ADHD and more.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {SN_SCHOOLS.filter(s=>s.special).map(s=><SNCard key={s.id} school={s} onSelect={onSelect} isFav={favs.includes(s.id)} onToggleFav={toggleFav} inCompare={compare.includes(s.id)} onToggleCompare={toggleCompare}/>)}
          </div>
        </div>
      </div>

      {/* KidTrack marketing section */}
      <div style={{ background:'#1A3D2C', padding:'56px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:'#B87D20', letterSpacing:1.2, textTransform:'uppercase', marginBottom:12 }}>For parents</div>
              <h2 style={{ margin:'0 0 16px', fontSize:32, fontWeight:900, color:'#fff', lineHeight:1.15 }}>Stay connected with your child — every day</h2>
              <p style={{ margin:'0 0 24px', fontSize:16, color:'rgba(255,255,255,.75)', fontWeight:500, lineHeight:1.7 }}>
                Once your child is enrolled, ask their school to join Kidtrack. You get a dedicated parent app that keeps you informed and in control — whether your child is on the bus, in class, or at home.
              </p>
              <div style={{ display:'flex', gap:12 }}>
                <button style={{ border:'none', background:'#B87D20', color:'#fff', borderRadius:10, padding:'12px 24px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Tell your school about Kidtrack →</button>
                <button style={{ border:'1.5px solid rgba(255,255,255,.4)', background:'transparent', color:'#fff', borderRadius:10, padding:'12px 20px', fontFamily:'inherit', fontSize:14, fontWeight:700, cursor:'pointer' }}>Learn more</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {SN_PARENT_FEATURES.map(f=>(
                <div key={f.title} style={{ background:'rgba(255,255,255,.08)', borderRadius:14, padding:'16px 14px', border:'1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{f.emoji}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:5 }}>{f.title}</div>
                  <div style={{ fontSize:12.5, color:'rgba(255,255,255,.65)', fontWeight:500, lineHeight:1.5 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nudge widget */}
      <div style={{ background:'#fff', borderTop:'1px solid rgba(26,21,16,.06)', padding:'18px 48px', display:'flex', alignItems:'center', gap:24, justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:T.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L20 6v6c0 5-4 8.5-9 9.5C7 20.5 2 17 2 12V6Z" fill="white" opacity=".9"/><polyline points="7,11 9.5,13.5 15,8.5" stroke="#FFD080" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:'#1A1510' }}>Is your school on KidTrack?</div>
            <div style={{ fontSize:13, color:'rgba(26,21,16,.5)', marginTop:2 }}>Ask your child&apos;s school to join. Hundreds of Nigerian families get live bus tracking, fees &amp; results all in one app.</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F5F3EE', borderRadius:100, padding:'8px 16px', border:'1px solid rgba(26,21,16,.1)' }}>
            <input placeholder="Your school's name…" style={{ border:'none', outline:'none', fontSize:13, fontFamily:"'DM Sans',sans-serif", background:'transparent', width:180, color:'#1A1510' }} />
          </div>
          <button onClick={() => toast("✅ Request sent! We'll reach out to that school directly.")} style={{ background:T.accent, color:T.accentText, border:'none', borderRadius:100, padding:'9px 22px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }}>Ask them to join →</button>
        </div>
      </div>

      {/* For Parents section */}
      <div style={{ background:T.accent, padding:'64px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:`${T.accentText}80`, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:14 }}>For parents</div>
              <h2 style={{ fontFamily:T.headFont, fontSize:44, fontWeight:700, color:T.accentText, lineHeight:1.05, fontStyle:'italic', marginBottom:16 }}>Stay connected with your child — every day</h2>
              <p style={{ fontSize:16, color:`${T.accentText}80`, lineHeight:1.75, marginBottom:28, fontWeight:300, maxWidth:440 }}>Once your child is enrolled, ask their school to join Kidtrack. You get a dedicated parent app that keeps you informed and in control.</p>
              <div style={{ display:'flex', gap:12 }}>
                <button style={{ border:'none', background:`${T.accentText}18`, color:T.accentText, borderRadius:T.btnR, padding:'13px 26px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer', backdropFilter:'blur(8px)' }}>Tell your school about Kidtrack →</button>
                <button style={{ border:`1.5px solid ${T.accentText}35`, background:'transparent', color:`${T.accentText}80`, borderRadius:T.btnR, padding:'12px 22px', fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Learn more</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {SN_PARENT_FEATURES.map(f=>(
                <div key={f.title} style={{ background:`${T.accentText}10`, borderRadius:16, padding:'18px 16px', border:`1px solid ${T.accentText}18` }}>
                  <div style={{ fontSize:24, marginBottom:10 }}>{f.emoji}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:T.accentText, marginBottom:5 }}>{f.title}</div>
                  <div style={{ fontSize:12.5, color:`${T.accentText}65`, fontWeight:400, lineHeight:1.55 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:T.footerBg, padding:'22px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:T.font }}>
        <div style={{ fontFamily:T.headFont, fontSize:18, color:'rgba(255,255,255,.3)' }}>School Net <span style={{ fontStyle:'italic' }}>by KidTrack</span></div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,.2)', fontWeight:500 }}>© 2026 KidTrack Technologies Ltd. All rights reserved</div>
      </div>

      {compare.length > 0 && <SNCompareBar compareIds={compare} onOpen={()=>setCompareOpen(true)} onRemove={id=>{const n=compare.filter(x=>x!==id);setCompare(n);try{localStorage.setItem('sn_compare',JSON.stringify(n));}catch{}}} onClear={()=>{setCompare([]);try{localStorage.removeItem('sn_compare');}catch{}}} />}
      {compareOpen && <SNCompareModal compareIds={compare} onClose={()=>setCompareOpen(false)} onRemove={id=>{const n=compare.filter(x=>x!==id);setCompare(n);}} onSelect={s=>{setCompareOpen(false);onSelect(s);}} />}
      {showAuth && <SNAuthModal onClose={()=>setShowAuth(false)} onSuccess={signIn} reason={authReason} />}
    </div>
  );
}
