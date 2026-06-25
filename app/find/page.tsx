'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SN_SCHOOLS } from '@/lib/data';
import { SNNav, SNCard } from '@/components/ui';
import type { School } from '@/lib/data';

export default function SNFindSchool() {
  const router = useRouter();
  const [q, setQ]           = useState('');
  const [level, setLevel]   = useState('All');
  const [type, setType]     = useState('All');
  const [maxFee, setMaxFee] = useState(2000);

  const results = SN_SCHOOLS.filter(s => {
    const mq = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.city.toLowerCase().includes(q.toLowerCase());
    const ml = level==='All'||(level==='Nursery'&&s.levels.includes('Nursery'))||(level==='Primary'&&s.levels.includes('Primary'))||(level==='Secondary'&&(s.levels.includes('JSS')||s.levels.includes('SSS')))||(level==='Special Needs'&&!!s.special);
    const mt = type==='All'||(type==='Day'&&s.type==='Day')||(type==='Boarding'&&s.boarding);
    const mf = s.feeFrom/1000 <= maxFee;
    return mq && ml && mt && mf;
  });

  const onSelect = (s: School) => router.push('/schools/' + s.id);

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ background:'linear-gradient(135deg,#1A3D2C 0%,#0A4B48 100%)', padding:'48px 40px 36px' }}>
        <h1 style={{ margin:'0 0 8px', fontSize:32, fontWeight:900, color:'#fff', textAlign:'center' }}>Find the right school for your child</h1>
        <p style={{ margin:'0 0 28px', fontSize:16, color:'rgba(255,255,255,.75)', textAlign:'center' }}>Search across 1,247 verified schools in Nigeria</p>
        <div style={{ maxWidth:680, margin:'0 auto', display:'flex', alignItems:'center', gap:12, background:'#fff', borderRadius:14, padding:'12px 18px', boxShadow:'0 8px 32px rgba(0,0,0,.15)' }}>
          <span style={{ fontSize:22 }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="School name, area or city…" style={{ flex:1, border:'none', outline:'none', fontFamily:'inherit', fontSize:17, fontWeight:500, color:'#111827' }} />
          <button style={{ border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'10px 24px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Search</button>
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:'32px auto', padding:'0 40px', display:'grid', gridTemplateColumns:'260px 1fr', gap:28 }}>
        <div style={{ background:'#fff', borderRadius:14, border:'1.5px solid #E5E9EC', padding:'20px 18px', alignSelf:'start' }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#111827', marginBottom:16 }}>Filters</div>
          {([['Level',['All','Nursery','Primary','Secondary','Special Needs'],level,setLevel],['Type',['All','Day','Boarding'],type,setType]] as [string,string[],string,(v:string)=>void][]).map(([label,opts,val,setVal])=>(
            <div key={label} style={{ marginBottom:20 }}>
              <div style={{ fontSize:12.5, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>{label}</div>
              {opts.map(o=><button key={o} onClick={()=>setVal(o)} style={{ display:'block', width:'100%', textAlign:'left', border:'none', borderRadius:8, padding:'8px 10px', fontFamily:'inherit', fontSize:13.5, fontWeight:val===o?800:500, color:val===o?'#fff':'#374151', background:val===o?'#1A3D2C':'transparent', cursor:'pointer', marginBottom:2 }}>{o}</button>)}
            </div>
          ))}
          <div>
            <div style={{ fontSize:12.5, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>Max fee per term (₦{maxFee}k)</div>
            <input type="range" min={100} max={2000} step={50} value={maxFee} onChange={e=>setMaxFee(+e.target.value)} style={{ width:'100%', accentColor:'#1A3D2C' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#9CA3AF', fontWeight:600 }}><span>₦100k</span><span>₦2M+</span></div>
          </div>
        </div>
        <div>
          <div style={{ fontSize:14, color:'#6B7280', fontWeight:600, marginBottom:16 }}>{results.length} school{results.length!==1?'s':''} found</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {results.map(s=><SNCard key={s.id} school={s} onSelect={onSelect} />)}
            {results.length===0&&<div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px', color:'#9CA3AF', fontSize:15, fontWeight:600 }}>No schools match your filters. Try broadening your search.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
