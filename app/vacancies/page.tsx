'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { V_DEPTS, V_TYPES, V_TYPE_CLR, V_SPEC_IDS } from '@/lib/data';
import { ExtrasNav, SNAuthModal } from '@/components/ui';
import type { Vacancy } from '@/lib/data';
import { useVacancies } from '@/lib/useVacancies';

function SNApplyModal({ vacancy, user, onClose }: { vacancy: Vacancy; user: {name:string;email:string}|null; onClose: ()=>void }) {
  const [form, setForm] = useState({ phone:'', cover:'', cvFile:null as File|null, cvName:'' });
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const setF = (k: string, v: string|File|null) => setForm(p=>({...p,[k]:v}));
  const validate = () => {
    const e: string[] = [];
    if (!form.phone.trim() || form.phone.trim().length < 7) e.push('Phone number is required');
    if (!form.cover.trim() || form.cover.trim().length < 30) e.push('Cover note must be at least 30 characters');
    if (!form.cvFile) e.push('CV / Resume (PDF) is required');
    return e;
  };
  const handleSubmit = () => { const e = validate(); if (e.length > 0) { setErrors(e); return; } setErrors([]); setSent(true); toast('Application submitted!'); };
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,.35)' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div><div style={{ fontSize:17, fontWeight:800, color:'#111827', marginBottom:2 }}>Apply for position</div><div style={{ fontSize:13.5, color:'#1A3D2C', fontWeight:700 }}>{vacancy.title} · {vacancy.sName}</div></div>
          <button onClick={onClose} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
        </div>
        {sent ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 32px', textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:20, fontWeight:900, color:'#111827', marginBottom:8 }}>Application submitted!</div>
            <div style={{ fontSize:14, color:'#6B7280', fontWeight:500, maxWidth:320, lineHeight:1.65, marginBottom:24 }}>{vacancy.sName} will review your CV and contact you at <strong>{user?.email}</strong> within 5 business days.</div>
            <button onClick={onClose} style={{ border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'11px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Done</button>
          </div>
        ) : (
          <div style={{ flex:1, overflow:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', gap:12 }}>
              {[['Applying as', user?.name||''], ['Email', user?.email||'']].map(([l,v])=>(
                <div key={l} style={{ flex:1 }}><label style={{ fontSize:12.5, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>{l}</label><div style={{ border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontSize:14, color:'#6B7280', background:'#F9FAFB', fontFamily:'inherit' }}>{v}</div></div>
              ))}
            </div>
            <div><label style={{ fontSize:12.5, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Phone number *</label><input value={form.phone} onChange={e=>setF('phone',e.target.value)} placeholder="+234 800 000 0000" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }} /></div>
            <div><label style={{ fontSize:12.5, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>Cover note * <span style={{ color:'#9CA3AF', fontWeight:500 }}>({form.cover.trim().length}/30 min)</span></label><textarea value={form.cover} onChange={e=>setF('cover',e.target.value)} placeholder="Briefly explain why you are a great fit for this role…" rows={4} style={{ width:'100%', border:`1.5px solid ${form.cover.trim().length>=30?'#1A3D2C':'#E5E9EC'}`, borderRadius:8, padding:'10px 12px', fontFamily:'inherit', fontSize:14, resize:'none', outline:'none', boxSizing:'border-box' }} /></div>
            <div><label style={{ fontSize:12.5, fontWeight:700, color:'#374151', display:'block', marginBottom:4 }}>CV / Resume (PDF) *</label>
              <label style={{ display:'flex', alignItems:'center', gap:10, border:`1.5px dashed ${form.cvFile?'#1A3D2C':'#D1D5DB'}`, borderRadius:10, padding:'14px 16px', cursor:'pointer', background:form.cvFile?'#F0FDF4':'#FAFAFA' }}>
                <span style={{ fontSize:22 }}>{form.cvFile?'📄':'⬆️'}</span>
                <div><div style={{ fontSize:14, fontWeight:700, color:form.cvFile?'#166534':'#374151' }}>{form.cvFile?form.cvName:'Click to upload your CV'}</div><div style={{ fontSize:12, color:'#9CA3AF', fontWeight:500 }}>{form.cvFile?'PDF selected ✓':'PDF only · Max 5MB'}</div></div>
                <input type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>{ if(e.target.files?.[0]){ setF('cvFile',e.target.files[0]); setF('cvName',e.target.files[0].name); } }} />
              </label>
            </div>
            {errors.length > 0 && <div style={{ background:'#FEE2E2', border:'1.5px solid #FECACA', borderRadius:10, padding:'12px 14px' }}><div style={{ fontSize:13, fontWeight:800, color:'#B91C1C', marginBottom:5 }}>Please fix the following:</div>{errors.map(e=><div key={e} style={{ fontSize:12.5, color:'#B91C1C', fontWeight:500, marginBottom:3 }}>• {e}</div>)}</div>}
            <button onClick={handleSubmit} style={{ border:'none', background:'#1A3D2C', color:'#fff', borderRadius:10, padding:'13px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>Submit application →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SNFindVacancy() {
  const router = useRouter();
  const { vacancies } = useVacancies();
  const [q, setQ]           = useState('');
  const [dept, setDept]     = useState('All departments');
  const [type, setType]     = useState('All');
  const [state, setState]   = useState('All States');
  const [spOnly, setSpOnly] = useState(false);
  const [applyVac, setApplyVac] = useState<Vacancy|null>(null);
  const [user, setUser]     = useState<{name:string;email:string;avatar:string;color:string}|null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const shown = vacancies.filter(v => {
    const mq  = !q || v.title.toLowerCase().includes(q.toLowerCase()) || v.sName.toLowerCase().includes(q.toLowerCase()) || v.city.toLowerCase().includes(q.toLowerCase());
    const md  = dept === 'All departments' || v.dept === dept;
    const mt  = type === 'All' || v.type === type;
    const ms  = state === 'All States' || v.state === state;
    const msp = !spOnly || V_SPEC_IDS.includes(v.sId);
    return mq && md && mt && ms && msp;
  });

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif", display:'flex', flexDirection:'column' }}>
      <ExtrasNav onBack={() => router.push('/')} backLabel="← Back to SchoolCity" />

      <div style={{ background:'linear-gradient(135deg,#1A3D2C,#0A4B48)', padding:'40px 40px 28px', flexShrink:0 }}>
        <h1 style={{ margin:'0 0 6px', fontSize:28, fontWeight:900, color:'#fff', textAlign:'center' }}>Find a teaching or school job</h1>
        <p style={{ margin:'0 0 22px', fontSize:15, color:'rgba(255,255,255,.7)', textAlign:'center' }}>Open positions across {vacancies.length}+ verified schools in Nigeria</p>
        <div style={{ maxWidth:680, margin:'0 auto', display:'flex', alignItems:'center', gap:10, background:'#fff', borderRadius:14, padding:'12px 18px', boxShadow:'0 8px 32px rgba(0,0,0,.15)' }}>
          <span style={{ fontSize:20, flexShrink:0 }}>🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Job title, school name or city…"
            style={{ flex:1, border:'none', outline:'none', fontFamily:'inherit', fontSize:16, fontWeight:500, color:'#111827', minWidth:0 }} />
          {q && <button onClick={() => setQ('')} style={{ border:'none', background:'none', color:'#9CA3AF', cursor:'pointer', fontSize:22, padding:0, lineHeight:1, flexShrink:0 }}>×</button>}
        </div>
      </div>

      <div style={{ background:'#fff', borderBottom:'1px solid #E5E9EC', padding:'10px 40px', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', flexShrink:0 }}>
        <select value={dept} onChange={e => setDept(e.target.value)} style={{ border:'1.5px solid #E5E9EC', borderRadius:8, padding:'7px 11px', fontFamily:'inherit', fontSize:13, fontWeight:600, color:'#374151', background:'#fff', outline:'none', cursor:'pointer' }}>
          {V_DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div style={{ display:'flex', gap:5 }}>
          {V_TYPES.map(t => (
            <button key={t} onClick={() => setType(t)} style={{ border:'none', borderRadius:7, padding:'6px 12px', fontFamily:'inherit', fontSize:12.5, fontWeight:type===t?800:600, color:type===t?'#fff':'#374151', background:type===t?'#1A3D2C':'#F3F4F6', cursor:'pointer', transition:'all .15s' }}>{t}</button>
          ))}
        </div>
        <select value={state} onChange={e => setState(e.target.value)} style={{ border:'1.5px solid #E5E9EC', borderRadius:8, padding:'7px 11px', fontFamily:'inherit', fontSize:13, fontWeight:600, color:'#374151', background:'#fff', outline:'none', cursor:'pointer' }}>
          {['All States','FCT','Lagos','Rivers','Oyo','Kano','Plateau'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#374151', cursor:'pointer' }}>
          <input type="checkbox" checked={spOnly} onChange={e => setSpOnly(e.target.checked)} style={{ accentColor:'#7C3AED', width:14, height:14 }} />
          Special needs schools only
        </label>
        <div style={{ flex:1 }} />
        <span style={{ fontSize:13, color:'#9CA3AF', fontWeight:600 }}>{shown.length} position{shown.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={{ flex:1, maxWidth:1100, width:'100%', margin:'0 auto', padding:'24px 40px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {shown.map(v => (
            <div key={v.id} style={{ background:'#fff', borderRadius:14, border:'1.5px solid #E5E9EC', overflow:'hidden', display:'flex', boxShadow:'0 1px 6px rgba(0,0,0,.05)', transition:'box-shadow .2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow='0 6px 20px rgba(0,0,0,.1)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow='0 1px 6px rgba(0,0,0,.05)'}>
              <div style={{ width:5, background:v.sColor, flexShrink:0 }} />
              <div style={{ flex:1, padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:v.sColor+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1.5px solid ${v.sColor}30` }}>
                  <span style={{ fontSize:17, fontWeight:900, color:v.sColor }}>{v.sName[0]}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                    <span style={{ fontSize:15.5, fontWeight:800, color:'#111827' }}>{v.title}</span>
                    <span style={{ fontSize:11.5, fontWeight:700, color:'#fff', background:V_TYPE_CLR[v.type]||'#6B7280', borderRadius:5, padding:'2px 8px', flexShrink:0 }}>{v.type}</span>
                  </div>
                  <div style={{ fontSize:13, color:'#1A3D2C', fontWeight:700, marginBottom:3 }}>{v.sName} · 📍 {v.city}</div>
                  <div style={{ fontSize:12.5, color:'#9CA3AF', fontWeight:600, marginBottom:5 }}>{v.dept}</div>
                  <div style={{ fontSize:13.5, color:'#374151', fontWeight:500, lineHeight:1.5 }}>{v.summary}</div>
                </div>
                <div style={{ flexShrink:0, textAlign:'right', display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
                  <div style={{ fontSize:12.5, color:'#9CA3AF', fontWeight:600, whiteSpace:'nowrap' }}>Deadline: {v.deadline}</div>
                  <div style={{ display:'flex', gap:7 }}>
                    <button onClick={() => router.push('/schools/'+v.sId)} style={{ border:'1.5px solid #E5E9EC', background:'#fff', color:'#374151', borderRadius:8, padding:'7px 13px', fontFamily:'inherit', fontSize:12.5, fontWeight:700, cursor:'pointer' }}>View school</button>
                    <button onClick={() => { if (!user) { setShowAuth(true); return; } setApplyVac(v); }}
                      style={{ border:'none', background:v.sColor, color:'#fff', borderRadius:8, padding:'7px 15px', fontFamily:'inherit', fontSize:12.5, fontWeight:800, cursor:'pointer' }}>
                      {user ? 'Apply' : 'Sign in to apply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <div style={{ textAlign:'center', padding:'64px 0', color:'#9CA3AF', fontSize:15, fontWeight:600 }}>
              No vacancies match your filters. Try broadening your search.
            </div>
          )}
        </div>
      </div>
      {applyVac && <SNApplyModal vacancy={applyVac} user={user} onClose={()=>setApplyVac(null)} />}
      {showAuth && <SNAuthModal onClose={()=>setShowAuth(false)} onSuccess={acc=>{ setUser(acc); setShowAuth(false); toast('Welcome, '+acc.name.split(' ')[0]+'!'); }} reason="apply" />}
    </div>
  );
}
