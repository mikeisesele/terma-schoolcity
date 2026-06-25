'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { T } from '@/lib/tokens';
import { SNNav } from '@/components/ui';

export default function SNListSchool() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', phone:'', email:'', city:'' });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm(p=>({...p,[k]:v}));
  const inp: React.CSSProperties = { width:'100%', border:`1.5px solid ${T.line}`, borderRadius:9, padding:'11px 14px', fontFamily:'inherit', fontSize:14, outline:'none', background:T.bg, color:T.ink, boxSizing:'border-box' };

  if (sent) return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to School Net" />
      <div style={{ maxWidth:520, margin:'80px auto', textAlign:'center', padding:'48px', background:T.cardBg, borderRadius:T.cardR*2, boxShadow:`0 4px 24px ${T.shadowColor}`, border:`1.5px solid ${T.cardBorder}` }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:8 }}>We&apos;ll be in touch.</div>
        <div style={{ fontSize:15, color:T.ink3, fontWeight:500, lineHeight:1.6, marginBottom:28 }}>Our team will contact you within one business day to set up your school on KidTrack and get your School Net profile live.</div>
        <button onClick={() => router.push('/')} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'12px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Back to School Net</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to School Net" />

      <div style={{ background:`linear-gradient(135deg,${T.accent},${T.accent}ee)`, padding:'40px 40px 36px' }}>
        <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.accentText+'60', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:12 }}>School Net listing is a KidTrack benefit</div>
          <h1 style={{ margin:'0 0 10px', fontSize:34, fontWeight:900, color:T.accentText, lineHeight:1.1 }}>Get your school on KidTrack — and on School Net.</h1>
          <p style={{ margin:0, fontSize:15, color:T.accentText+'78', lineHeight:1.7 }}>School Net listings are available to schools on KidTrack Standard or Premium. Register below and our team will set up your full platform in 48 hours.</p>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 40px 0', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {([['📋','School Net profile','A verified public listing that parents find when searching — with photos, fees, facilities and ratings.'],
          ['👨‍👩‍👧','Parent app','Every parent gets live bus tracking, instant results, fee payments and school communication on their phone.'],
          ['🏆','KidTrack Verified badge','Schools on Standard+ display the KidTrack Verified badge — a trust signal parents recognise.']] as [string,string,string][]).map(([e,t,d])=>(
          <div key={t} style={{ background:T.cardBg, borderRadius:T.cardR, border:`1.5px solid ${T.cardBorder}`, padding:'20px 18px' }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{e}</div>
            <div style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:6 }}>{t}</div>
            <div style={{ fontSize:13, color:T.ink3, lineHeight:1.5 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth:560, margin:'32px auto 48px', padding:'0 40px' }}>
        <div style={{ background:T.cardBg, borderRadius:T.cardR*2, border:`1.5px solid ${T.cardBorder}`, padding:'32px', boxShadow:`0 4px 20px ${T.shadowColor}` }}>
          <div style={{ fontSize:17, fontWeight:800, color:T.ink, marginBottom:4 }}>Register your school</div>
          <div style={{ fontSize:13, color:T.ink3, marginBottom:20, lineHeight:1.5 }}>Our team will contact you within one business day to complete setup and get you live in 48 hours.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>School name</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Greenfield International School" style={inp}/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>City / state</label><input value={form.city} onChange={e=>set('city',e.target.value)} placeholder="e.g. Maitama, Abuja" style={inp}/></div>
              <div><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>Phone number</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234 800 000 0000" style={inp}/></div>
            </div>
            <div><label style={{ fontSize:13, fontWeight:700, color:T.ink, display:'block', marginBottom:5 }}>School email</label><input value={form.email} onChange={e=>set('email',e.target.value)} placeholder="admin@yourschool.edu.ng" style={inp}/></div>
            <button onClick={()=>{ if(!form.name.trim()||!form.phone.trim()){toast('Please fill in school name and phone');return;} setSent(true); toast('Enquiry sent — we will call you within 24 hours'); }} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'13px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer', marginTop:4 }}>Send enquiry →</button>
          </div>
          <div style={{ marginTop:14, fontSize:12, color:T.ink3, textAlign:'center', lineHeight:1.5 }}>By submitting you agree to be contacted by the KidTrack team. We will not spam you.</div>
        </div>
      </div>
    </div>
  );
}
