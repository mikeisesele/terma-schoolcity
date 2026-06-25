'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, SN_SCHOOLS } from '@/lib/data';
import { T } from '@/lib/tokens';
import toast from 'react-hot-toast';

export function Stars({ rating }: { rating: number }) {
  return <span style={{ fontSize:13, color:'#F59E0B', fontWeight:700 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5-Math.floor(rating))} <span style={{ color:'#9CA3AF', fontSize:12 }}>{rating}</span></span>;
}

export function SNNav({ onBack, backLabel, rightSlot, onNav }: {
  onBack?: () => void;
  backLabel?: string;
  rightSlot?: React.ReactNode;
  onNav?: (v: string) => void;
}) {
  const router = useRouter();
  const nav = onNav || ((v: string) => {
    if (v === 'find') router.push('/find');
    else if (v === 'find-vacancy') router.push('/vacancies');
    else if (v === 'favorites') router.push('/favourites');
    else if (v === 'list-school') router.push('/list');
    else if (v === 'post-vacancy') router.push('/vacancies/post');
    else router.push('/');
  });
  return (
    <div style={{ background:T.navBg, backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderBottom:`1px solid ${T.navBorder}`, padding:'0 48px', display:'flex', alignItems:'center', gap:16, height:68, position:'sticky', top:0, zIndex:100, fontFamily:T.font }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:34, height:34, borderRadius:'50%', background:T.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:T.accentText, fontSize:15, fontWeight:900 }}>S</span>
        </div>
        <div>
          <div style={{ fontFamily:T.font, fontSize:15, fontWeight:800, color:T.navInk, letterSpacing:'-.02em', lineHeight:1 }}>School Net</div>
          <div style={{ fontSize:9, fontWeight:500, color:`${T.navInk}45`, letterSpacing:'.14em', textTransform:'uppercase', marginTop:3 }}>by KidTrack</div>
        </div>
      </div>
      {onBack && <button onClick={onBack} style={{ border:`1.5px solid ${T.navInk}25`, background:'transparent', color:`${T.navInk}80`, borderRadius:T.btnR, padding:'6px 16px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', marginLeft:8 }}>{backLabel || '← Back'}</button>}
      <div style={{ flex:1 }} />
      {!onBack && [['Browse schools','find'],['Vacancies','find-vacancy'],['Scholarships','find']].map(([t,v]) => (
        <button key={t} onClick={() => nav(v)} style={{ border:'none', background:'transparent', color:`${T.navInk}55`, fontFamily:'inherit', fontSize:13.5, fontWeight:600, cursor:'pointer', padding:'4px 8px' }}
          onMouseEnter={e=>(e.currentTarget.style.color=T.navInk)} onMouseLeave={e=>(e.currentTarget.style.color=`${T.navInk}55`)}>{t}</button>
      ))}
      {rightSlot}
      {!onBack && <button onClick={() => nav('list-school')} style={{ background:T.accent, color:T.accentText, border:'none', borderRadius:T.btnR, padding:'10px 22px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', marginLeft:8 }}>List Your School</button>}
    </div>
  );
}

export function SNCard({ school, onSelect, isFav, onToggleFav, inCompare, onToggleCompare }: {
  school: School;
  onSelect: (s: School) => void;
  isFav?: boolean;
  onToggleFav?: (id: string) => void;
  inCompare?: boolean;
  onToggleCompare?: (id: string) => void;
}) {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.origin + '/schools/' + school.id;
    if (navigator.share) { navigator.share({ title: school.name, text: school.tagline + ' · ' + school.city, url }); }
    else { navigator.clipboard && navigator.clipboard.writeText(url).then(() => toast('Link copied to clipboard!')); }
  };
  return (
    <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,.07)', cursor:'pointer', transition:'all .2s', border:'1.5px solid #E5E9EC' }}
      onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 10px 28px rgba(0,0,0,.12)'; }}
      onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform='none'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 10px rgba(0,0,0,.07)'; }}>
      <div onClick={()=>onSelect(school)} style={{ height:88, background:`linear-gradient(135deg,${school.color} 0%,${school.color}cc 60%,${school.color}88 100%)`, position:'relative', display:'flex', alignItems:'flex-end', padding:'0 14px 12px' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 30px)' }} />
        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,.25)', border:'2px solid rgba(255,255,255,.6)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <span style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{school.name[0]}</span>
        </div>
        {school.ktPlan==='Premium' && <span style={{ position:'absolute', top:9, right:8, fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(184,125,32,.85)', borderRadius:6, padding:'3px 8px', border:'1px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', gap:4 }}>⭐ KidTrack Premium</span>}
        {school.verified && school.ktPlan!=='Premium' && <span style={{ position:'absolute', top:10, left:60, fontSize:10, fontWeight:800, color:'#fff', background:'rgba(255,255,255,.22)', borderRadius:5, padding:'2px 7px', border:'1px solid rgba(255,255,255,.35)' }}>✓ Verified</span>}
        {school.special && <span style={{ position:'absolute', bottom:10, left:14, fontSize:10, fontWeight:800, color:'#fff', background:'rgba(0,0,0,.25)', borderRadius:5, padding:'2px 7px' }}>Special Needs</span>}
        <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:4 }} onClick={e=>e.stopPropagation()}>
          <button onClick={handleShare} title="Share school"
            style={{ width:26, height:26, borderRadius:'50%', border:'none', background:'rgba(0,0,0,.35)', color:'rgba(255,255,255,.9)', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>↗</button>
          <button onClick={e=>{e.stopPropagation();onToggleFav&&onToggleFav(school.id);}} title={isFav?'Remove from saved':'Save school'}
            style={{ width:26, height:26, borderRadius:'50%', border:'none', background:'rgba(0,0,0,.35)', color:isFav?'#EF4444':'rgba(255,255,255,.9)', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)', transition:'color .15s' }}>
            {isFav ? '♥' : '♡'}
          </button>
        </div>
      </div>
      <div onClick={()=>onSelect(school)} style={{ padding:'12px 14px 10px' }}>
        <div style={{ fontSize:14.5, fontWeight:800, color:'#111827', lineHeight:1.2, marginBottom:3 }}>{school.name}</div>
        <div style={{ fontSize:12.5, color:'#6B7280', fontWeight:600, marginBottom:8 }}>📍 {school.city}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Stars rating={school.rating} />
          <span style={{ fontSize:11.5, color:'#9CA3AF', fontWeight:600 }}>{school.reviews} reviews</span>
        </div>
        <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:12.5, fontWeight:700, color:'#6B7280' }}>{school.levels}</div>
          <div style={{ fontSize:12, fontWeight:500, color:'#9CA3AF' }}>{school.students}</div>
        </div>
      </div>
      <button onClick={e=>{e.stopPropagation();onToggleCompare&&onToggleCompare(school.id);}}
        style={{ display:'block', width:'100%', border:'none', borderTop:'1px solid #F3F4F6', background:inCompare?'#1A3D2C':'#FAFAFA', color:inCompare?'#fff':'#6B7280', padding:'7px', fontFamily:'inherit', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .15s', borderRadius:'0 0 16px 16px' }}>
        {inCompare ? '✓ In comparison' : '+ Compare'}
      </button>
    </div>
  );
}

export function SNCompareBar({ compareIds, onOpen, onRemove, onClear }: {
  compareIds: string[];
  onOpen: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const schools = compareIds.map(id => SN_SCHOOLS.find(s => s.id === id)).filter((s): s is School => Boolean(s));
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

export function SNCompareModal({ compareIds, onClose, onRemove, onSelect }: {
  compareIds: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelect: (s: School) => void;
}) {
  const schools = compareIds.map(id => SN_SCHOOLS.find(s => s.id === id)).filter((s): s is School => Boolean(s));
  const ink = '#1A3828'; const ink2 = '#3A5040'; const ink3 = '#7A9280';
  const line = '#D8E8D5'; const bg = '#FDFAF5'; const cardBg = '#FFFFFF';
  const accent = '#3D7058'; const accentLight = '#DDE8D8';

  const rows: Array<{label:string;key:string;render:(s:School)=>React.ReactNode;compare?:(s:School)=>number}> = [
    { label:'Rating',         key:'rating',       render: s => <span><span style={{ color:'#F59E0B', fontSize:15 }}>{'★'.repeat(Math.floor(s.rating))}</span><span style={{ color:ink3, fontSize:13, fontWeight:700, marginLeft:5 }}>{s.rating}</span></span>, compare: s => s.rating },
    { label:'Fees per term',  key:'fee',          render: s => <span style={{ fontWeight:700 }}>₦{(s.feeFrom/1000).toFixed(0)}k – ₦{(s.feeTo/1000).toFixed(0)}k</span>, compare: s => s.feeFrom },
    { label:'Levels',         key:'levels',       render: s => s.levels },
    { label:'School type',    key:'type',         render: s => s.type },
    { label:'Gender',         key:'gender',       render: s => s.gender },
    { label:'Students',       key:'students',     render: s => s.students },
    { label:'Orientation',    key:'orient',       render: s => s.orientation },
    { label:'Transport',      key:'transport',    render: s => s.transport ? <span style={{ color:'#1F8A5B', fontWeight:800 }}>✓ Yes</span> : <span style={{ color:ink3 }}>—</span>, compare: s => s.transport?1:0 },
    { label:'Boarding',       key:'boarding',     render: s => s.boarding  ? <span style={{ color:'#1F8A5B', fontWeight:800 }}>✓ Yes</span> : <span style={{ color:ink3 }}>—</span>, compare: s => s.boarding?1:0 },
    { label:'Scholarships',   key:'scholarships', render: s => s.scholarships > 0 ? <span style={{ color:'#7C3AED', fontWeight:700 }}>{s.scholarships} available</span> : <span style={{ color:ink3 }}>None</span>, compare: s => s.scholarships },
    { label:'Vacancies',      key:'vacancies',    render: s => s.vacancies > 0 ? <span style={{ color:accent, fontWeight:700 }}>{s.vacancies} open</span> : <span style={{ color:ink3 }}>None</span> },
    { label:'Special needs',  key:'special',      render: s => s.special ? <span style={{ color:'#0369A1', fontWeight:700 }}>✓ Yes</span> : <span style={{ color:ink3 }}>—</span> },
    { label:'KidTrack plan',  key:'plan',         render: s => <span style={{ fontSize:12, fontWeight:800, color: s.ktPlan==='Premium'?'#B87D20':s.ktPlan==='Standard'?accent:ink3, background: s.ktPlan==='Premium'?'#FEF3C7':s.ktPlan==='Standard'?accentLight:'#F3F4F6', borderRadius:4, padding:'2px 8px' }}>{s.ktPlan||'—'}</span> },
  ];

  const isDiff = (row: typeof rows[0]) => {
    if (schools.length < 2 || !row.compare) return false;
    const vals = schools.map(s => row.compare!(s));
    return vals.some(v => v !== vals[0]);
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
                  <th style={{ padding:'16px 12px', background:bg, borderBottom:'2px solid '+line, borderLeft:'1px solid '+line, position:'sticky', top:0, zIndex:2 }}>
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

export function SNAuthModal({ onClose, onSuccess, reason }: {
  onClose: () => void;
  onSuccess: (account: {name:string;email:string;avatar:string;color:string}) => void;
  reason?: string;
}) {
  const MOCK_ACCOUNTS = [
    { name:'Adaeze Obi',     email:'adaeze.obi@gmail.com',  avatar:'AO', color:'#1A3D2C' },
    { name:'Tunde Fashola',  email:'t.fashola@gmail.com',   avatar:'TF', color:'#2A6FDB' },
    { name:'Ngozi Williams', email:'ngozi.w@gmail.com',     avatar:'NW', color:'#7C3AED' },
  ];
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const signIn = (account: typeof MOCK_ACCOUNTS[0]) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => { onSuccess(account); }, 900);
    }, 1400);
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
        ) : (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#B87D20', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#fff', fontSize:18, fontWeight:900 }}>K</span>
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:'#1A3D2C' }}>School Net</div>
            </div>
            <div style={{ fontSize:21, fontWeight:800, color:'#111827', marginBottom:6 }}>
              {reason === 'save' ? 'Save this school' : 'Sign in to continue'}
            </div>
            <div style={{ fontSize:14.5, color:'#6B7280', fontWeight:500, marginBottom:28, lineHeight:1.65 }}>
              {reason === 'save'
                ? 'Create a free account to save schools, compare side-by-side, and access them from any device.'
                : 'Sign in to access your saved schools and comparisons.'}
            </div>
            {loading ? (
              <div style={{ padding:'24px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, border:'3px solid #E5E9EC', borderTopColor:'#1A3D2C', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                <div style={{ fontSize:14, color:'#6B7280', fontWeight:600 }}>Signing you in…</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : (
              <>
                <button onClick={() => signIn(MOCK_ACCOUNTS[0])}
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
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{ flex:1, height:1, background:'#E5E9EC' }} />
                  <span style={{ fontSize:12.5, color:'#9CA3AF', fontWeight:600 }}>or choose an account</span>
                  <div style={{ flex:1, height:1, background:'#E5E9EC' }} />
                </div>
                {MOCK_ACCOUNTS.slice(1).map(acc => (
                  <button key={acc.email} onClick={() => signIn(acc)}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:12, border:'1.5px solid #F3F4F6', background:'#FAFAFA', borderRadius:10, padding:'10px 14px', fontFamily:'inherit', fontSize:14, fontWeight:600, color:'#374151', cursor:'pointer', marginBottom:8, textAlign:'left', transition:'all .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F3F4F6'}
                    onMouseLeave={e=>e.currentTarget.style.background='#FAFAFA'}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:acc.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:800, flexShrink:0 }}>{acc.avatar}</div>
                    <div style={{ textAlign:'left' }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{acc.name}</div>
                      <div style={{ fontSize:12, color:'#9CA3AF', fontWeight:500 }}>{acc.email}</div>
                    </div>
                  </button>
                ))}
              </>
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
