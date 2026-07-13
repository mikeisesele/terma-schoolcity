'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School } from '@/lib/data';
import { T } from '@/lib/tokens';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export function Stars({ rating }: { rating: number }) {
  return <span style={{ fontSize:13, color:'#F59E0B', fontWeight:700, letterSpacing:1 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5-Math.floor(rating))} <span style={{ color:T.ink3, fontSize:12, letterSpacing:0 }}>{rating}</span></span>;
}

export function SHead({ title, sub, link, onLink }: { title: React.ReactNode; sub?: string; link?: string; onLink?: () => void }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: sub ? 10 : 16, gap:16 }}>
      <div>
        <h3 style={{ margin:0, fontSize:T.sectionHeadSize, fontWeight:T.sectionHeadWeight, fontFamily:T.sectionHeadFont, color:T.ink, letterSpacing:T.sectionHeadSpacing, lineHeight:1.15 }}>{title}</h3>
        {sub && <p style={{ margin:'5px 0 12px', fontSize:13.5, color:T.ink3, fontWeight:400, lineHeight:1.55, fontFamily:T.font }}>{sub}</p>}
      </div>
      {link && <button onClick={onLink} style={{ border:'none', background:'none', color:T.accent, fontFamily:T.font, fontSize:13.5, fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:16, whiteSpace:'nowrap' }}>{link}</button>}
    </div>
  );
}

export function SCNav({ onBack, backHref, rightSlot, onNav }: {
  onBack?: () => void;
  backLabel?: string;
  backHref?: string;
  rightSlot?: React.ReactNode;
  onNav?: (v: string) => void;
}) {
  const router = useRouter();
  const nav = onNav || ((v: string) => {
    if (v === 'find') router.push('/find');
    else if (v === 'find-vacancy') router.push('/vacancies');
    else if (v === 'favorites') router.push('/favourites');
    else if (v === 'list-school') router.push('/list');
    else if (v === 'compare') router.push('/compare');
    else if (v === 'post-vacancy') router.push('/vacancies/post');
    else router.push('/');
  });
  return (
    <div style={{ background:T.navBg, backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderBottom:'1px solid '+T.navBorder, padding:'0 48px', display:'flex', alignItems:'center', gap:16, height:72, position:'sticky', top:0, zIndex:100, fontFamily:T.font }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>nav('home')}>
        <div style={{ width:34, height:34, borderRadius:10, background:T.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4v4c0 3.5-2.5 6-6 7C3.5 14 2 11.5 2 8V4Z" fill="white" opacity=".9"/><polyline points="5,8 7.2,10.2 11,6.5" stroke="#D4A04A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:T.navInk, letterSpacing:'-.01em', lineHeight:1 }}>SchoolCity</div>
          <div style={{ fontSize:11, fontWeight:500, color:T.ink3, marginTop:3, lineHeight:1 }}>Find the perfect school for your child</div>
        </div>
      </div>
      {(onBack || backHref) && <>
        <div style={{ width:1, height:28, background:T.navBorder, marginLeft:4, marginRight:4 }}/>
        {backHref
          ? <a href={backHref} style={{ border:'none', background:'transparent', color:T.ink3, cursor:'pointer', padding:'6px 8px', borderRadius:8, display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, fontFamily:'inherit', textDecoration:'none' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Home
            </a>
          : <button onClick={onBack} title="Back to home" style={{ border:'none', background:'transparent', color:T.ink3, cursor:'pointer', padding:'6px 8px', borderRadius:8, display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, fontFamily:'inherit', transition:'color .15s' }}
              onMouseEnter={e=>(e.currentTarget.style.color=T.navInk)} onMouseLeave={e=>(e.currentTarget.style.color=T.ink3)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Home
            </button>
        }
      </>}
      <div style={{ flex:1 }}/>
      {!onBack && ([['Browse schools','find'],['Vacancies','find-vacancy'],['Compare','compare']] as [string,string][]).map(([lbl,v])=>(
        <button key={lbl} onClick={()=>nav(v)} style={{ border:'none', background:'transparent', color:T.ink3, fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer', padding:'4px 8px', transition:'color .15s' }}
          onMouseEnter={e=>(e.currentTarget.style.color=T.navInk)} onMouseLeave={e=>(e.currentTarget.style.color=T.ink3)}>{lbl}</button>
      ))}
      {rightSlot}
      {!onBack && <button onClick={()=>nav('list-school')} style={{ background:T.accent, color:T.accentText, border:'none', borderRadius:T.btnR, padding:'10px 22px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>List your school</button>}
    </div>
  );
}

// Dark forest nav used by Find-a-vacancy & Favorites (from schoolcity-extras.jsx `_ExtrasNav`).
export function ExtrasNav({ onBack, backLabel, rightSlot }: { onBack?: () => void; backLabel?: string; rightSlot?: React.ReactNode }) {
  return (
    <div style={{ background:'#1A3D2C', padding:'0 40px', display:'flex', alignItems:'center', gap:16, height:60, position:'sticky', top:0, zIndex:100, fontFamily:"'Source Sans 3','Segoe UI',sans-serif", flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:'#B87D20', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontSize:16, fontWeight:900 }}>K</span>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:900, color:'#fff', lineHeight:1 }}>SchoolCity</div>
          <div style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,.5)', lineHeight:1 }}>by Terma</div>
        </div>
      </div>
      {onBack && (
        <button onClick={onBack} style={{ border:'1.5px solid rgba(255,255,255,.3)', background:'transparent', color:'rgba(255,255,255,.8)', borderRadius:8, padding:'6px 14px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', marginLeft:8 }}>
          {backLabel || '← Back'}
        </button>
      )}
      <div style={{ flex:1 }} />
      {rightSlot}
    </div>
  );
}

export function SCCard({ school, onSelect, isFav, onToggleFav, inCompare, onToggleCompare }: {
  school: School;
  onSelect: (s: School) => void;
  isFav?: boolean;
  onToggleFav?: (id: string) => void;
  inCompare?: boolean;
  onToggleCompare?: (id: string) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ background:T.cardBg, borderRadius:T.cardR, overflow:'hidden', cursor:'pointer', transition:'transform .22s, box-shadow .22s', transform:hov?'translateY(-4px)':'none', boxShadow:hov?'0 16px 40px rgba(40,80,55,.14)':'0 2px 8px rgba(40,80,55,.07)', marginBottom:16, breakInside:'avoid', border:'1.5px solid '+T.cardBorder }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div onClick={()=>onSelect(school)} style={{ height:140, background:'linear-gradient(160deg,'+school.color+' 0%,'+school.color+'cc 60%,'+school.color+'99 100%)', position:'relative', overflow:'hidden' }}>
        {school.imageUrl && <div style={{ position:'absolute', inset:0, backgroundImage:`url(${school.imageUrl})`, backgroundSize:'cover', backgroundPosition:'center' }}/>}
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 36px)' }}/>
        <div style={{ position:'absolute', inset:0, background: school.imageUrl ? 'linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.15) 60%)' : 'linear-gradient(to top, rgba(0,0,0,.68) 0%, rgba(0,0,0,0) 50%)' }}/>
        <div style={{ position:'absolute', top:12, left:12, width:40, height:40, borderRadius:T.avatarR, background:'rgba(255,255,255,.22)', border:'2px solid rgba(255,255,255,.5)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
          <span style={{ fontSize:18, fontWeight:800, color:'#fff', lineHeight:1 }}>{school.name[0]}</span>
        </div>
        {school.ktPlan==='Pro'&&<span style={{ position:'absolute', top:10, right:10, fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(184,125,32,.88)', borderRadius:T.badgeR, padding:'3px 10px' }}>⭐ Pro</span>}
        {school.verified&&school.ktPlan!=='Pro'&&<span style={{ position:'absolute', top:10, right:10, fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(255,255,255,.2)', borderRadius:T.badgeR, padding:'2px 8px', border:'1px solid rgba(255,255,255,.35)' }}>✓ Verified</span>}
        <div style={{ position:'absolute', bottom:10, left:12, right:44 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#fff', lineHeight:1.2, textShadow:'0 1px 6px rgba(0,0,0,.45)' }}>{school.name}</div>
          <div style={{ fontSize:11.5, color:'rgba(255,255,255,.8)', fontWeight:600 }}>📍 {school.city}</div>
        </div>
        <div style={{ position:'absolute', bottom:10, right:10, display:'flex', gap:4 }} onClick={e=>e.stopPropagation()}>
          <button onClick={e=>{e.stopPropagation();onToggleFav&&onToggleFav(school.id);}} style={{ width:28, height:28, borderRadius:'50%', border:'none', background:'rgba(0,0,0,.32)', color:isFav?'#FCA5A5':'rgba(255,255,255,.9)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>{isFav?'♥':'♡'}</button>
        </div>
      </div>
      <div onClick={()=>onSelect(school)} style={{ padding:'12px 14px 10px' }}>
        <div style={{ fontSize:12, color:T.ink3, lineHeight:1.4, marginBottom:8 }}>{school.tagline}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}><Stars rating={school.rating}/><span style={{ fontSize:11.5, color:T.ink3 }}>{school.reviews}</span></div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'1px solid '+T.line }}>
          <span style={{ fontSize:12.5, fontWeight:700, color:T.ink2 }}>{school.levels}</span>
          <span style={{ fontSize:12, color:T.ink3 }}>{school.students}</span>
        </div>
      </div>
      <button onClick={e=>{e.stopPropagation();onToggleCompare&&onToggleCompare(school.id);}} style={{ display:'block', width:'100%', border:'none', borderTop:'1px solid '+T.line, background:inCompare?T.accent:T.cardFooterBg, color:inCompare?T.accentText:T.ink3, padding:'7px', fontFamily:'inherit', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .15s', borderRadius:'0 0 '+T.cardR+'px '+T.cardR+'px' }}>{inCompare?'✓ In comparison':'+ Compare'}</button>
    </div>
  );
}

export function SCCompareBar({ compareIds, allSchools, onOpen, onRemove, onClear }: {
  compareIds: string[];
  allSchools: School[];
  onOpen: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const schools = compareIds.map(id => allSchools.find(s => s.id === id)).filter((s): s is School => Boolean(s));
  if (schools.length === 0) return null;
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#1A3D2C', padding:'10px 32px', display:'flex', alignItems:'center', gap:14, zIndex:200, boxShadow:'0 -4px 24px rgba(0,0,0,.25)', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <span style={{ fontSize:13.5, fontWeight:800, color:'#fff', flexShrink:0 }}>Comparing {schools.length}/3:</span>
      <div style={{ display:'flex', gap:8 }}>
        {schools.map(s => (
          <div key={s.id} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.12)', borderRadius:9, padding:'5px 10px 5px 8px', border:'1px solid rgba(255,255,255,.2)' }}>
            <div style={{ width:24, height:24, borderRadius:6, background:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:'#fff', fontSize:10, fontWeight:900 }}>{s.name[0]}</span>
            </div>
            <span style={{ fontSize:12.5, fontWeight:700, color:'#fff', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name.split(' ').slice(0,2).join(' ')}</span>
            <button onClick={() => onRemove(s.id)} style={{ border:'none', background:'none', color:'rgba(255,255,255,.55)', cursor:'pointer', fontSize:15, padding:'0 2px', lineHeight:1 }}>×</button>
          </div>
        ))}
        {schools.length < 3 && (
          <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,.07)', borderRadius:9, padding:'5px 14px', border:'1px dashed rgba(255,255,255,.22)', color:'rgba(255,255,255,.45)', fontSize:12.5, fontWeight:600 }}>+ add school</div>
        )}
      </div>
      <div style={{ flex:1 }} />
      <button onClick={onClear} style={{ border:'1.5px solid rgba(255,255,255,.3)', background:'transparent', color:'rgba(255,255,255,.7)', borderRadius:8, padding:'7px 15px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>Clear</button>
      <button onClick={onOpen} disabled={schools.length < 2}
        style={{ border:'none', background: schools.length < 2 ? 'rgba(255,255,255,.2)' : '#B87D20', color:'#fff', borderRadius:9, padding:'10px 22px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor: schools.length < 2 ? 'default' : 'pointer', opacity: schools.length < 2 ? 0.6 : 1 }}>
        {schools.length < 2 ? 'Compare (add 1 more)' : 'Compare →'}
      </button>
    </div>
  );
}

export function SCCompareModal({ compareIds, allSchools, onClose, onRemove, onSelect }: {
  compareIds: string[];
  allSchools: School[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelect: (s: School) => void;
}) {
  const schools = compareIds.map(id => allSchools.find(s => s.id === id)).filter((s): s is School => Boolean(s));
  const ink = '#1A3828'; const ink2 = '#3A5040'; const ink3 = '#7A9280';
  const line = '#D8E8D5'; const bg = '#FDFAF5'; const cardBg = '#FFFFFF';
  const accent = '#3D7058'; const accentLight = '#DDE8D8';

  const rows: Array<{label:string;key:string;render:(s:School)=>React.ReactNode;compare?:(s:School)=>number;val?:(s:School)=>string}> = [
    { label:'Rating',         key:'rating',       render: s => <span><span style={{ color:'#F59E0B', fontSize:15 }}>{'★'.repeat(Math.floor(s.rating))}</span><span style={{ color:ink3, fontSize:13, fontWeight:700, marginLeft:5 }}>{s.rating}</span></span>, compare: s => s.rating },
    { label:'Fees per term',  key:'fee',          render: s => <span style={{ fontWeight:700, fontFamily:"'Arial', system-ui, sans-serif" }}>₦{(s.feeFrom/1000).toFixed(0)}k – ₦{(s.feeTo/1000).toFixed(0)}k</span>, compare: s => -s.feeFrom },
    { label:'Levels',         key:'levels',       render: s => s.levels,      val: s => s.levels },
    { label:'School type',    key:'type',         render: s => s.type,        val: s => s.type },
    { label:'Gender',         key:'gender',       render: s => s.gender,      val: s => s.gender },
    { label:'Students',       key:'students',     render: s => s.students,    val: s => String(s.students) },
    { label:'Orientation',    key:'orient',       render: s => s.orientation, val: s => s.orientation },
    { label:'Transport',      key:'transport',    render: s => s.transport ? <span style={{ color:'#1F8A5B', fontWeight:800 }}>✓ Yes</span> : <span style={{ color:ink3 }}>—</span>, compare: s => s.transport?1:0 },
    { label:'Boarding',       key:'boarding',     render: s => s.boarding  ? <span style={{ color:'#1F8A5B', fontWeight:800 }}>✓ Yes</span> : <span style={{ color:ink3 }}>—</span>, compare: s => s.boarding?1:0 },
    { label:'Scholarships',   key:'scholarships', render: s => s.scholarships > 0 ? <span style={{ color:'#7C3AED', fontWeight:700 }}>{s.scholarships} available</span> : <span style={{ color:ink3 }}>None</span>, compare: s => s.scholarships },
    { label:'Vacancies',      key:'vacancies',    render: s => s.vacancies > 0 ? <span style={{ color:accent, fontWeight:700 }}>{s.vacancies} open</span> : <span style={{ color:ink3 }}>None</span>, val: s => String(s.vacancies) },
    { label:'Special needs',  key:'special',      render: s => s.special ? <span style={{ color:'#0369A1', fontWeight:700 }}>✓ Yes</span> : <span style={{ color:ink3 }}>—</span>, val: s => String(s.special ?? false) },
    { label:'Term plan',      key:'plan',         render: s => <span style={{ fontSize:12, fontWeight:800, color: s.ktPlan==='Pro'?'#B87D20':s.ktPlan==='Standard'?accent:ink3, background: s.ktPlan==='Pro'?'#FEF3C7':s.ktPlan==='Standard'?accentLight:'#F3F4F6', borderRadius:4, padding:'2px 8px' }}>{s.ktPlan||'—'}</span>, val: s => s.ktPlan ?? '' },
  ];

  const isDiff = (row: typeof rows[0]) => {
    if (schools.length < 2) return false;
    if (row.compare) {
      const vals = schools.map(s => row.compare!(s));
      return vals.some(v => v !== vals[0]);
    }
    if (row.val) {
      const vals = schools.map(s => row.val!(s));
      return vals.some(v => v !== vals[0]);
    }
    return false;
  };
  const isBest = (row: typeof rows[0], school: School) => {
    if (schools.length < 2 || !row.compare) return false;
    const vals = schools.map(s => row.compare!(s));
    const myVal = row.compare(school);
    return myVal === Math.max(...vals) && vals.filter(v => v === myVal).length === 1;
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(26,56,40,.75)', backdropFilter:'blur(6px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ background:cardBg, borderRadius:20, width:'100%', maxWidth:960, maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,.35)', border:'1px solid '+line }}>
        <div style={{ padding:'20px 28px', borderBottom:'1px solid '+line, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:bg }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:ink, letterSpacing:'-.01em' }}>Compare schools</div>
            <div style={{ fontSize:13, color:ink3, marginTop:2 }}>{schools.length} of 3 selected · rows highlighted in green differ between schools</div>
          </div>
          <button onClick={onClose} style={{ border:'1px solid '+line, background:cardBg, borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:16, color:ink3, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ flex:1, overflow:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
            <thead>
              <tr>
                <th style={{ width:140, padding:'20px 20px', textAlign:'left', fontSize:11, fontWeight:800, color:ink3, textTransform:'uppercase', letterSpacing:'.09em', background:bg, borderBottom:'2px solid '+line, position:'sticky', top:0, zIndex:2 }}>Feature</th>
                {schools.map(s => (
                  <th key={s.id} style={{ padding:'16px 12px', textAlign:'center', background:bg, borderBottom:'2px solid '+line, position:'sticky', top:0, zIndex:2, borderLeft:'1px solid '+line }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                      <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${s.color} 0%,${s.color}cc 100%)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px '+s.color+'44' }}>
                        <span style={{ color:'#fff', fontSize:22, fontWeight:900 }}>{s.name[0]}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:800, color:ink, lineHeight:1.2, textAlign:'center' }}>{s.name}</div>
                      <div style={{ fontSize:12, color:ink3, fontWeight:600 }}>📍 {s.city}</div>
                      <div style={{ display:'flex', gap:6, marginTop:2 }}>
                        <button onClick={() => { onClose(); onSelect(s); }} style={{ border:`1.5px solid ${s.color}`, background:'#fff', color:s.color, borderRadius:7, padding:'5px 14px', fontFamily:'inherit', fontSize:12.5, fontWeight:800, cursor:'pointer' }}>View →</button>
                        <button onClick={() => onRemove(s.id)} style={{ border:'1.5px solid #FCA5A5', background:'#fff', color:'#EF4444', borderRadius:7, padding:'5px 10px', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>✕</button>
                      </div>
                    </div>
                  </th>
                ))}
                {schools.length < 3 && (
                  <th onClick={onClose} style={{ padding:'16px 12px', background:bg, borderBottom:'2px solid '+line, borderLeft:'1px solid '+line, position:'sticky', top:0, zIndex:2, cursor:'pointer' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                      <div style={{ width:52, height:52, borderRadius:14, border:'2px dashed '+line, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:line }}>+</div>
                      <div style={{ fontSize:12, color:ink3, fontWeight:600, textAlign:'center', lineHeight:1.4 }}>Add a school<br/>to compare</div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const diff = isDiff(row);
                return (
                  <tr key={row.label} style={{ background: diff ? '#F0F9F4' : ri%2===0 ? cardBg : bg, transition:'background .15s' }}>
                    <td style={{ padding:'12px 20px', fontSize:13, fontWeight:700, color: diff ? accent : ink2, borderBottom:'1px solid '+line, display:'flex', alignItems:'center', gap:6 }}>
                      {diff && <span style={{ width:5, height:5, borderRadius:'50%', background:accent, display:'inline-block', flexShrink:0 }}/>}
                      {row.label}
                    </td>
                    {schools.map(s => {
                      const best = isBest(row, s);
                      return (
                        <td key={s.id} style={{ padding:'12px 16px', fontSize:13.5, fontWeight:600, color:ink, textAlign:'center', borderBottom:'1px solid '+line, borderLeft:'1px solid '+line, background: best?'#E8F5EE':undefined, position:'relative' }}>
                          {best && <span style={{ position:'absolute', top:6, right:8, fontSize:9, fontWeight:800, color:'#1F8A5B', letterSpacing:'.05em', textTransform:'uppercase' }}>best</span>}
                          {row.render(s)}
                        </td>
                      );
                    })}
                    {schools.length < 3 && <td style={{ borderBottom:'1px solid '+line, borderLeft:'1px solid '+line, background:'#FAFAFA' }}/>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'14px 28px', borderTop:'1px solid '+line, background:bg, display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:accent }}/>
          <span style={{ fontSize:12.5, color:ink3, fontWeight:500 }}>Green rows highlight where schools differ. &quot;Best&quot; label marks the leading school per metric.</span>
          <div style={{ flex:1 }}/>
          <button onClick={onClose} style={{ border:'1px solid '+line, background:cardBg, color:ink2, borderRadius:8, padding:'8px 20px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function SCAuthModal({ onClose, onSuccess: _onSuccess, reason, applyEmail }: {
  onClose: () => void;
  onSuccess: (account: {name:string;email:string;avatar:string;color:string}) => void;
  reason?: string;
  applyEmail?: string;
}) {
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      // Pre-check: hit Supabase's public /auth/v1/settings endpoint to see if Google
      // OAuth is enabled before redirecting. This avoids landing on a raw 400 JSON page
      // when the provider is not yet configured in the Supabase dashboard.
      const ctrl = new AbortController();
      const settingsTimeout = setTimeout(() => ctrl.abort(), 5000);
      const settingsRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
        { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' }, signal: ctrl.signal }
      ).finally(() => clearTimeout(settingsTimeout));

      const settings = await settingsRes.json() as { external?: Record<string, boolean> };
      if (!settings.external?.google) {
        throw new Error('Google sign-in is not available in this environment.');
      }

      // Provider is enabled — redirect to Google OAuth (standard flow).
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
      // Browser redirects to Google — no further action needed here.
    } catch (err: unknown) {
      setLoading(false);
      const raw = err instanceof Error ? err.message : 'Google sign-in failed';
      const msg = (raw.toLowerCase().includes('not available') || raw.toLowerCase().includes('not enabled') || raw.toLowerCase().includes('provider') || raw.includes('abort'))
        ? 'Google sign-in is not available in this environment.'
        : raw;
      setAuthError(msg);
      console.error('[google-oauth]', err);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <div style={{ background:'#fff', borderRadius:22, width:'100%', maxWidth:420, padding:'36px 32px', boxShadow:'0 32px 80px rgba(0,0,0,.35)', textAlign:'center' }}>
        {done ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:52, lineHeight:1 }}>✅</div>
            <div style={{ fontSize:20, fontWeight:900, color:'#111827' }}>Signed in!</div>
            <div style={{ fontSize:14, color:'#6B7280', fontWeight:500 }}>Loading your saved schools…</div>
          </div>
        ) : authError ? (
          /* Error state */
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>⚠️</div>
            <div style={{ fontSize:18, fontWeight:800, color:'#111827' }}>Sign-in unavailable</div>
            <div style={{ fontSize:14, color:'#6B7280', fontWeight:500, lineHeight:1.65 }}>{authError}</div>
            {applyEmail && (
              <div style={{ width:'100%', background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:12, padding:'16px 18px', textAlign:'left' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#166534', marginBottom:6 }}>Apply directly via email</div>
                <div style={{ fontSize:13.5, color:'#374151', fontWeight:500, lineHeight:1.6 }}>
                  Send your CV and a short cover note to:
                </div>
                <a href={`mailto:${applyEmail}`} style={{ fontSize:14.5, fontWeight:800, color:'#1A3D2C', display:'block', marginTop:6, textDecoration:'none' }}>
                  {applyEmail}
                </a>
              </div>
            )}
            <div style={{ display:'flex', gap:10, width:'100%' }}>
              <button onClick={() => setAuthError(null)}
                style={{ flex:1, border:'1.5px solid #E5E9EC', background:'#fff', color:'#374151', borderRadius:10, padding:'11px', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>
                Try again
              </button>
              <button onClick={onClose}
                style={{ flex:1, border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'11px', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#B87D20', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#fff', fontSize:18, fontWeight:900 }}>K</span>
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:'#1A3D2C' }}>SchoolCity</div>
            </div>
            <div style={{ fontSize:21, fontWeight:800, color:'#111827', marginBottom:6 }}>
              {reason === 'save' ? 'Save this school' : 'Sign in to apply'}
            </div>
            <div style={{ fontSize:14.5, color:'#6B7280', fontWeight:500, marginBottom:28, lineHeight:1.65 }}>
              {reason === 'save'
                ? 'Create a free account to save schools, compare side-by-side, and access them from any device.'
                : 'Sign in with your Google account to submit your application. Your details are pre-filled from your profile.'}
            </div>
            {loading ? (
              <div style={{ padding:'24px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, border:'3px solid #E5E9EC', borderTopColor:'#1A3D2C', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                <div style={{ fontSize:14, color:'#6B7280', fontWeight:600 }}>Signing you in…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : (
              <button onClick={signInWithGoogle}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12, border:'1.5px solid #E5E9EC', background:'#fff', borderRadius:12, padding:'13px 20px', fontFamily:'inherit', fontSize:15, fontWeight:700, color:'#111827', cursor:'pointer', marginBottom:14, boxShadow:'0 1px 6px rgba(0,0,0,.06)', transition:'all .15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#F8FAFB'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,.1)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow='0 1px 6px rgba(0,0,0,.06)'; }}>
                  <svg width="20" height="20" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </button>
            )}
            <button onClick={onClose} style={{ marginTop:10, border:'none', background:'none', color:'#9CA3AF', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
