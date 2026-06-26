'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { SNNav, SNCard } from '@/components/ui';
import { useSchools } from '@/lib/useSchools';
import type { School } from '@/lib/data';

function Chip({ id, label, val, setVal, opts, openF, setOpenF }: {
  id: string; label: string; val: string; setVal: (v: string) => void; opts: string[];
  openF: string|null; setOpenF: (v: string|null) => void;
}) {
  return (
    <div style={{ position:'relative' }}>
      <button onClick={e=>{e.stopPropagation();setOpenF(openF===id?null:id);}} style={{ display:'flex', alignItems:'center', gap:6, border:'1.5px solid '+(val!=='All'?T.accent:T.line), borderRadius:T.btnR, padding:'9px 16px', background:val!=='All'?T.accentLight:T.cardBg, color:val!=='All'?T.accent:T.ink2, fontFamily:T.font, fontSize:13.5, fontWeight:val!=='All'?700:600, cursor:'pointer', whiteSpace:'nowrap', outline:'none', transition:'all .15s' }}>
        {val==='All'?label:val}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform:openF===id?'rotate(180deg)':'none', transition:'transform .2s', flexShrink:0 }}><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {openF===id&&(
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, background:T.cardBg, border:'1px solid '+T.line, borderRadius:T.cardR, boxShadow:'0 8px 28px rgba(0,0,0,.12)', zIndex:300, minWidth:180, padding:'6px 0' }} onClick={e=>e.stopPropagation()}>
          {(val!=='All'?['All',...opts]:opts).map(o=>(
            <button key={o} onClick={()=>{setVal(o);setOpenF(null);}} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', textAlign:'left', border:'none', background:'transparent', color:val===o?T.accent:o==='All'?T.ink3:T.ink, padding:'10px 16px', fontFamily:T.font, fontSize:13.5, fontWeight:val===o?700:o==='All'?500:400, cursor:'pointer', transition:'background .1s', borderBottom:o==='All'?'1px solid '+T.line:'none' }}
              onMouseEnter={e=>e.currentTarget.style.background=T.accentLight} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ width:16, color:T.accent, fontSize:12 }}>{val===o&&o!=='All'?'✓':''}</span>{o==='All'?'Clear filter':o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SNFindSchool() {
  const router = useRouter();
  const { schools } = useSchools();
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All');
  const [type, setType] = useState('All');
  const [gender, setGender] = useState('All');
  const [orient, setOrient] = useState('All');
  const [extra, setExtra] = useState('All');
  const [maxFee, setMaxFee] = useState(2000);
  const [openF, setOpenF] = useState<string|null>(null);

  const results = schools.filter(s => {
    const mq = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.city.toLowerCase().includes(q.toLowerCase());
    const ml = level==='All'||(level==='Nursery'&&s.levels.includes('Nursery'))||(level==='Primary'&&s.levels.includes('Primary'))||(level==='Secondary'&&(s.levels.includes('JSS')||s.levels.includes('SSS')))||(level==='Special Needs'&&!!s.special);
    const mt = type==='All'||(type==='Day'&&!s.boarding)||(type==='Boarding'&&s.boarding&&!s.type.includes('Day'))||(type==='Hybrid'&&s.boarding&&s.type.includes('Day'));
    const mg = gender==='All'||(gender==='Boys'&&s.gender==='Boys')||(gender==='Girls'&&s.gender==='Girls')||(gender==='Mixed'&&s.gender==='Mixed');
    const mo = orient==='All'||(orient==='Christian'&&s.orientation==='Christian')||(orient==='Islamic'&&s.orientation.toLowerCase().includes('islam'))||(orient==='Non-denominational'&&(s.orientation==='Non-denominational'||s.orientation==='Multi-faith'));
    const me = extra==='All'||(extra==='Scholarships'&&s.scholarships>0)||(extra==='Transport'&&s.transport)||(extra==='Hiring'&&s.vacancies>0);
    const mf = s.feeFrom/1000 <= maxFee;
    return mq && ml && mt && mg && mo && me && mf;
  });
  const anyActive = level!=='All'||type!=='All'||gender!=='All'||orient!=='All'||extra!=='All'||maxFee<2000||!!q;

  const onSelect = (s: School) => router.push('/schools/' + s.id);

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }} onClick={()=>setOpenF(null)}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />

      <div style={{ background:'linear-gradient(135deg,'+T.accent+' 0%,'+T.accent+'ee 100%)', padding:'40px 48px 32px' }}>
        <h1 style={{ margin:'0 0 6px', fontSize:30, fontWeight:900, color:T.accentText, textAlign:'center', fontFamily:T.headFont }}>Find the right school for your child</h1>
        <p style={{ margin:'0 0 24px', fontSize:15, color:T.accentText+'80', textAlign:'center', fontFamily:T.font }}>Search across 1,247 verified schools in Nigeria</p>
        <div style={{ maxWidth:680, margin:'0 auto', display:'flex', alignItems:'stretch', background:'#fff', borderRadius:T.btnR, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.15)', height:54 }}>
          <span style={{ padding:'0 18px', color:T.ink3, fontSize:20, display:'flex', alignItems:'center' }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="School name, area or city…" style={{ flex:1, border:'none', outline:'none', fontFamily:T.font, fontSize:16, fontWeight:500, color:T.ink }} />
          <button style={{ border:'none', background:T.accent, color:T.accentText, padding:'0 32px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:T.font }}>Search</button>
        </div>
      </div>

      <div style={{ background:T.cardBg, borderBottom:'1px solid '+T.line, padding:'14px 48px', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', position:'sticky', top:72, zIndex:80 }} onClick={e=>{e.stopPropagation();setOpenF(null);}}>
        <Chip id="level"  label="Level"       val={level}  setVal={setLevel}  opts={['Nursery','Primary','Secondary','Special Needs']} openF={openF} setOpenF={setOpenF}/>
        <Chip id="type"   label="School type" val={type}   setVal={setType}   opts={['Day','Boarding','Hybrid']} openF={openF} setOpenF={setOpenF}/>
        <Chip id="gender" label="Gender"      val={gender} setVal={setGender} opts={['Boys','Girls','Mixed']} openF={openF} setOpenF={setOpenF}/>
        <Chip id="orient" label="Orientation" val={orient} setVal={setOrient} opts={['Christian','Islamic','Non-denominational']} openF={openF} setOpenF={setOpenF}/>
        <Chip id="extra"  label="More"        val={extra}  setVal={setExtra}  opts={['Scholarships','Transport','Hiring']} openF={openF} setOpenF={setOpenF}/>
        <div style={{ display:'flex', alignItems:'center', gap:8, borderLeft:'1.5px solid '+T.line, paddingLeft:14, marginLeft:4 }}>
          <span style={{ fontSize:13, color:T.ink3, fontWeight:600, whiteSpace:'nowrap' }}>₦{maxFee===2000?'Any fee':'≤₦'+maxFee+'k'}</span>
          <input type="range" min={100} max={2000} step={50} value={maxFee} onChange={e=>setMaxFee(+e.target.value)} style={{ width:90, accentColor:T.accent, cursor:'pointer' }}/>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:14 }}>
          {anyActive&&<button onClick={()=>{setLevel('All');setType('All');setGender('All');setOrient('All');setExtra('All');setMaxFee(2000);setQ('');}} style={{ border:'none', background:'transparent', color:T.ink3, fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', textDecoration:'underline' }}>Clear all</button>}
          <span style={{ fontSize:13, color:T.ink3, fontWeight:600 }}>{results.length} school{results.length!==1?'s':''} found</span>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'28px 48px 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {results.map(s=><SNCard key={s.id} school={s} onSelect={onSelect} />)}
          {results.length===0&&<div style={{ gridColumn:'1/-1', textAlign:'center', padding:'64px', color:T.ink3, fontSize:15, fontWeight:600 }}>No schools match your filters.</div>}
        </div>
      </div>
    </div>
  );
}
