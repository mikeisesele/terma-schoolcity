'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { SNNav } from '@/components/ui';

export default function SNPostVacancy() {
  const router = useRouter();
  const [form, setForm] = useState({ school:'', email:'', title:'', dept:'Secondary – Academic', type:'Full-time', deadline:'', summary:'', requirements:'' });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm(p=>({...p,[k]:v}));
  const r9 = T.btnR==='100px' ? 9 : T.btnR;

  if (sent) return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ maxWidth:520, margin:'80px auto', textAlign:'center', padding:'48px', background:T.cardBg, borderRadius:T.cardR, boxShadow:`0 4px 24px ${T.shadowColor}`, border:`1.5px solid ${T.cardBorder}` }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:8, fontFamily:T.headFont }}>Vacancy posted!</div>
        <div style={{ fontSize:15, color:T.ink3, fontWeight:500, marginBottom:24 }}>Your vacancy has been submitted for review. It will appear on School Net within 24 hours.</div>
        <button onClick={() => router.push('/')} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'12px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Back to School Net</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ background:`linear-gradient(135deg,${T.accent},${T.accent}ee)`, padding:'36px 40px' }}>
        <h1 style={{ margin:'0 0 6px', fontSize:28, fontWeight:900, color:T.accentText, textAlign:'center', fontFamily:T.headFont }}>Post a vacancy on School Net</h1>
        <p style={{ margin:0, fontSize:15, color:`${T.accentText}75`, textAlign:'center', fontFamily:T.font }}>Reach thousands of qualified educators searching for opportunities.</p>
      </div>
      <div style={{ maxWidth:720, margin:'40px auto', padding:'0 24px' }}>
        <div style={{ background:T.cardBg, borderRadius:T.cardR, border:`1.5px solid ${T.cardBorder}`, padding:'32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            {([['School name','school','e.g. Greenfield International School'],['Contact email','email','hr@school.edu.ng']] as [string,string,string][]).map(([l,k,p])=>(
              <div key={k}><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>{l}</label><input value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:r9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box', background:T.bg, color:T.ink }}/></div>
            ))}
          </div>
          <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>Job title</label><input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Mathematics Teacher (SSS)" style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:r9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box', background:T.bg, color:T.ink }}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
            {([['Department','dept',['Secondary – Academic','Primary – Academic','Non-academic','Administration','Support Staff']],['Type','type',['Full-time','Part-time','Contract']],['Deadline','deadline',null]] as [string,string,string[]|null][]).map(([l,k,opts])=>(
              <div key={k}><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>{l}</label>
                {opts ? <select value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:r9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', background:T.bg, color:T.ink, boxSizing:'border-box' }}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                : <input type="date" value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:r9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', background:T.bg, color:T.ink, boxSizing:'border-box' }}/>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>Brief summary</label><textarea value={form.summary} onChange={e=>set('summary',e.target.value)} placeholder="Key responsibilities and role overview…" rows={3} style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:r9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, resize:'vertical', outline:'none', boxSizing:'border-box', background:T.bg, color:T.ink }}/></div>
          <div style={{ marginBottom:20 }}><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>Requirements</label><textarea value={form.requirements} onChange={e=>set('requirements',e.target.value)} placeholder="e.g. TRCN registered, 3+ years experience, B.Ed or equivalent…" rows={3} style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:r9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, resize:'vertical', outline:'none', boxSizing:'border-box', background:T.bg, color:T.ink }}/></div>
          <button onClick={()=>{if(form.school&&form.email&&form.title)setSent(true);}} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'13px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Post vacancy →</button>
        </div>
      </div>
    </div>
  );
}
