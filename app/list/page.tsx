'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SNNav } from '@/components/ui';

export default function SNListSchool() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', address:'', state:'FCT', email:'', phone:'', website:'', type:'Day', levels:'Nursery–SSS', orientation:'Non-denominational', students:'', established:'' });
  const set = (k: string, v: string) => setForm(p=>({...p,[k]:v}));

  if (step===3) return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ maxWidth:520, margin:'80px auto', textAlign:'center', padding:'48px', background:'#fff', borderRadius:20, boxShadow:'0 4px 24px rgba(0,0,0,.08)', border:'1.5px solid #E5E9EC' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#111827', marginBottom:8 }}>Application submitted!</div>
        <div style={{ fontSize:15, color:'#6B7280', fontWeight:500, marginBottom:24 }}>Our team will review your application and contact you within 2–3 business days to complete your School Net verification and profile setup.</div>
        <button onClick={() => router.push('/')} style={{ border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'12px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Back to School Net</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to home" />
      <div style={{ background:'linear-gradient(135deg,#1A3D2C,#0A4B48)', padding:'36px 40px' }}>
        <h1 style={{ margin:'0 0 6px', fontSize:28, fontWeight:900, color:'#fff', textAlign:'center' }}>List your school on School Net</h1>
        <p style={{ margin:'0 0 24px', fontSize:15, color:'rgba(255,255,255,.75)', textAlign:'center' }}>Join 1,247 verified schools and reach thousands of parents searching for the right school.</p>
        <div style={{ maxWidth:480, margin:'0 auto', display:'flex', gap:0 }}>
          {['School details','Contact & profile','Review & submit'].map((l,i)=>(
            <div key={l} style={{ flex:1, textAlign:'center', padding:'10px 0', borderBottom:`3px solid ${i<step?'#B87D20':'rgba(255,255,255,.3)'}`, color:i<step?'#B87D20':'rgba(255,255,255,.5)', fontSize:12.5, fontWeight:i<step?800:600 }}>{i+1}. {l}</div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:720, margin:'40px auto', padding:'0 24px' }}>
        <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E5E9EC', padding:'32px' }}>
          {step===1&&<>
            <div style={{ fontSize:17, fontWeight:800, color:'#111827', marginBottom:20 }}>School details</div>
            <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Official school name</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Greenfield International School" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
            <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Full address</label><input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Plot 12, Gwarinpa Estate, Abuja" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
              {([['Type','type',['Day','Boarding','Day & Boarding']],['Levels','levels',['Nursery only','Nursery–Primary','Primary–SSS','Nursery–SSS','JSS–SSS']],['State','state',['FCT','Lagos','Rivers','Oyo','Kano','Plateau','Others']]] as [string,string,string[]][]).map(([l,k,opts])=>(
                <div key={k}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>{l}</label><select value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', background:'#fff', boxSizing:'border-box' }}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
              ))}
            </div>
            <div style={{ display:'flex', gap:14, marginBottom:14 }}>
              {([['No. of students','students','e.g. 500'],['Year established','established','e.g. 2007']] as [string,string,string][]).map(([l,k,p])=>(
                <div key={k} style={{ flex:1 }}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>{l}</label><input value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
              ))}
            </div>
            <button onClick={()=>{if(form.name&&form.address)setStep(2);}} style={{ border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'13px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Continue →</button>
          </>}
          {step===2&&<>
            <div style={{ fontSize:17, fontWeight:800, color:'#111827', marginBottom:20 }}>Contact &amp; profile</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              {([['Official email','email','admin@school.edu.ng'],['Phone number','phone','+234 800 000 0000'],['Website','website','www.school.edu.ng (optional)']] as [string,string,string][]).map(([l,k,p])=>(
                <div key={k}><label style={{ fontSize:13, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>{l}</label><input value={(form as Record<string,string>)[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:9, padding:'10px 13px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
              ))}
            </div>
            <div style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:10, padding:'14px 16px', marginBottom:20, fontSize:13.5, color:'#166534', fontWeight:600 }}>
              ✓ After submission, our team contacts you to verify ownership, add your school logo, photos, and fee structure before publishing your profile.
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>setStep(1)} style={{ border:'1.5px solid #E5E9EC', background:'#fff', color:'#374151', borderRadius:10, padding:'12px 20px', fontFamily:'inherit', fontSize:14, fontWeight:700, cursor:'pointer' }}>← Back</button>
              <button onClick={()=>{if(form.email&&form.phone)setStep(3);}} style={{ flex:1, border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'13px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>Submit application →</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
