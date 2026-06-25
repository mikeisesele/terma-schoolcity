'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SNNav } from '@/components/ui';

export default function SNPostVacancy() {
  const router = useRouter();
  const [form, setForm] = useState({ school:'', email:'', title:'', dept:'Secondary – Academic', type:'Full-time', deadline:'', summary:'', requirements:'' });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm(p=>({...p,[k]:v}));

  if (sent) return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ maxWidth:520, margin:'80px auto', textAlign:'center', padding:'48px', background:'#fff', borderRadius:20, boxShadow:'0 4px 24px rgba(0,0,0,.08)', border:'1.5px solid #E5E9EC' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#111827', marginBottom:8 }}>Vacancy submitted!</div>
        <div style={{ fontSize:15, color:'#6B7280', fontWeight:500, marginBottom:24 }}>Your job posting will be reviewed and published within 24 hours. Applicants can apply directly via email.</div>
        <button onClick={() => router.push('/')} style={{ border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'12px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Back to School Net</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ maxWidth:720, margin:'40px auto', padding:'0 24px' }}>
        <h1 style={{ margin:'0 0 6px', fontSize:28, fontWeight:900, color:'#111827' }}>Post a vacancy</h1>
        <p style={{ margin:'0 0 32px', fontSize:15, color:'#6B7280', fontWeight:500 }}>Reach thousands of qualified teachers and school staff across Nigeria.</p>
        <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E5E9EC', padding:'32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            {([['School name','school','e.g. Greenfield International School'],['Contact email','email','admin@yourschool.edu.ng']] as [string,string,string][]).map(([l,k,p])=>(
              <div key={k}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>{l}</label><input value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
            ))}
          </div>
          <div style={{ marginBottom:16 }}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Job title</label><input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Mathematics Teacher (SSS)" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:16 }}>
            {([['Department','dept',['Secondary – Academic','Primary – Academic','Nursery – Academic','Administration','Non-academic / Support']],['Type','type',['Full-time','Part-time','Contract','Supply']],['Deadline','deadline',null]] as [string,string,string[]|null][]).map(([l,k,opts])=>(
              <div key={k}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>{l}</label>
                {opts?<select value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', background:'#fff', boxSizing:'border-box' }}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                :<input value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} placeholder="e.g. 30 Jul 2026" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/>}
              </div>
            ))}
          </div>
          {([['Role overview / Job description','summary','Describe the responsibilities and day-to-day duties…',100],['Requirements','requirements','• B.Sc. Mathematics\n• TRCN registered\n• 3+ years experience',80]] as [string,string,string,number][]).map(([l,k,p,h])=>(
            <div key={k} style={{ marginBottom:16 }}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>{l}</label><textarea value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, resize:'vertical', outline:'none', boxSizing:'border-box', minHeight:h }}/></div>
          ))}
          <div style={{ display:'flex', gap:12, marginTop:8 }}>
            <button onClick={()=>{if(form.school&&form.email&&form.title)setSent(true);}} style={{ flex:1, border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'13px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>Submit vacancy →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
