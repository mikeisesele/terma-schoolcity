'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { V_TYPE_CLR } from '@/lib/data';
import type { Vacancy } from '@/lib/data';
import { ExtrasNav, SCAuthModal } from '@/components/ui';
import { T } from '@/lib/tokens';

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
    <div style={{ position:'fixed', inset:0, background:T.overlay, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:T.font }}>
      <div style={{ background:T.cardBg, borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:`0 32px 80px ${T.shadowColor}` }}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${T.line}`, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div><div style={{ fontSize:17, fontWeight:800, color:T.ink, marginBottom:2 }}>Apply for position</div><div style={{ fontSize:13.5, color:T.footerBg, fontWeight:700 }}>{vacancy.title} · {vacancy.sName}</div></div>
          <button onClick={onClose} style={{ border:'none', background:T.inputBg, borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
        </div>
        {sent ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 32px', textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:8 }}>Application submitted!</div>
            <div style={{ fontSize:14, color:T.ink3, fontWeight:500, maxWidth:320, lineHeight:1.65, marginBottom:24 }}>{vacancy.sName} will review your CV and contact you at <strong>{user?.email}</strong> within 5 business days.</div>
            <button onClick={onClose} style={{ border:'none', background:T.footerBg, color:T.cardBg, borderRadius:10, padding:'11px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Done</button>
          </div>
        ) : (
          <div style={{ flex:1, overflow:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', gap:12 }}>
              {[['Applying as', user?.name||''], ['Email', user?.email||'']].map(([l,v])=>(
                <div key={l} style={{ flex:1 }}><label style={{ fontSize:12.5, fontWeight:700, color:T.ink2, display:'block', marginBottom:4 }}>{l}</label><div style={{ border:`1.5px solid ${T.line}`, borderRadius:8, padding:'9px 12px', fontSize:14, color:T.ink3, background:T.inputBg, fontFamily:'inherit' }}>{v}</div></div>
              ))}
            </div>
            <div><label style={{ fontSize:12.5, fontWeight:700, color:T.ink2, display:'block', marginBottom:4 }}>Phone number *</label><input value={form.phone} onChange={e=>setF('phone',e.target.value)} placeholder="+234 800 000 0000" style={{ width:'100%', border:`1.5px solid ${T.line}`, borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }} /></div>
            <div><label style={{ fontSize:12.5, fontWeight:700, color:T.ink2, display:'block', marginBottom:4 }}>Cover note * <span style={{ color:T.ink3, fontWeight:500 }}>({form.cover.trim().length}/30 min)</span></label><textarea value={form.cover} onChange={e=>setF('cover',e.target.value)} placeholder="Briefly explain why you are a great fit for this role…" rows={4} style={{ width:'100%', border:`1.5px solid ${form.cover.trim().length>=30?T.footerBg:T.line}`, borderRadius:8, padding:'10px 12px', fontFamily:'inherit', fontSize:14, resize:'none', outline:'none', boxSizing:'border-box' }} /></div>
            <div><label style={{ fontSize:12.5, fontWeight:700, color:T.ink2, display:'block', marginBottom:4 }}>CV / Resume (PDF) *</label>
              <label style={{ display:'flex', alignItems:'center', gap:10, border:`1.5px dashed ${form.cvFile?T.footerBg:'#D1D5DB'}`, borderRadius:10, padding:'14px 16px', cursor:'pointer', background:form.cvFile?T.accentLight:'#FAFAFA' }}>
                <span style={{ fontSize:22 }}>{form.cvFile?'📄':'⬆️'}</span>
                <div><div style={{ fontSize:14, fontWeight:700, color:form.cvFile?'#166534':T.ink2 }}>{form.cvFile?form.cvName:'Click to upload your CV'}</div><div style={{ fontSize:12, color:T.ink3, fontWeight:500 }}>{form.cvFile?'PDF selected ✓':'PDF only · Max 5MB'}</div></div>
                <input type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>{ if(e.target.files?.[0]){ setF('cvFile',e.target.files[0]); setF('cvName',e.target.files[0].name); } }} />
              </label>
            </div>
            {errors.length > 0 && <div style={{ background:'#FEE2E2', border:'1.5px solid #FECACA', borderRadius:10, padding:'12px 14px' }}><div style={{ fontSize:13, fontWeight:800, color:'#B91C1C', marginBottom:5 }}>Please fix the following:</div>{errors.map(e=><div key={e} style={{ fontSize:12.5, color:'#B91C1C', fontWeight:500, marginBottom:3 }}>• {e}</div>)}</div>}
            <button onClick={handleSubmit} style={{ border:'none', background:T.footerBg, color:T.cardBg, borderRadius:10, padding:'13px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>Submit application →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function BulletList({ text }: { text: string }) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
      {lines.map((line, i) => (
        <li key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', fontSize:14.5, color:T.ink2, lineHeight:1.65 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:T.ink, flexShrink:0, marginTop:7 }} />
          <span>{line.replace(/^[•\-–]\s*/, '')}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ text }: { text: string }) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
          <span style={{ width:24, height:24, borderRadius:6, background:T.accentLight, border:`1px solid ${T.line}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#166534', flexShrink:0 }}>
            {i + 1}
          </span>
          <span style={{ fontSize:14.5, color:T.ink2, lineHeight:1.65, paddingTop:3 }}>
            {line.replace(/^[•\-–]\s*/, '')}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function VacancyDetail() {
  const router  = useRouter();
  const params  = useParams();
  const id      = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '');

  const [vacancy,  setVacancy]  = useState<Vacancy | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [user,      setUser]      = useState<{name:string;email:string;avatar:string;color:string}|null>(null);
  const [showAuth,  setShowAuth]  = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('public_vacancies')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setNotFound(true); setLoading(false); return; }
        const row = data as Record<string, unknown>;
        setVacancy({
          id: String(row.id ?? ''),
          sId: String(row.school_id ?? ''),
          sName: String(row.school_name ?? ''),
          sColor: String(row.school_colour ?? '#1A3D2C'),
          city: String(row.city ?? ''),
          state: String(row.state ?? ''),
          title: String(row.title ?? ''),
          dept: String(row.department ?? ''),
          type: String(row.type ?? 'Full-time'),
          deadline: row.deadline != null ? String(row.deadline) : '',
          summary: String(row.summary ?? row.role_overview ?? ''),
          applyEmail: String(row.apply_email ?? ''),
          roleOverview: row.role_overview != null ? String(row.role_overview) : null,
          keyResponsibilities: row.key_responsibilities != null ? String(row.key_responsibilities) : null,
          requirements: row.requirements != null ? String(row.requirements) : null,
          perks: Array.isArray(row.perks) ? (row.perks as string[]) : [],
          salaryRange: row.salary_range != null ? String(row.salary_range) : null,
          minQualification: row.min_qualification != null ? String(row.min_qualification) : null,
          experienceLevel: row.experience_level != null ? String(row.experience_level) : null,
          location: row.location != null ? String(row.location) : null,
          trcnRequired: Boolean(row.trcn_required),
          applyInstructions: row.apply_instructions != null ? String(row.apply_instructions) : null,
        });
        setLoading(false);
      });
  }, [id]);

  const font = T.font;

  if (loading) return (
    <div style={{ minHeight:'100vh', background:T.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:font }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
        <div style={{ width:40, height:40, border:`3px solid ${T.line}`, borderTopColor:T.footerBg, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <div style={{ fontSize:14, color:T.ink3, fontWeight:600 }}>Loading vacancy…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (notFound || !vacancy) return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:font, display:'flex', flexDirection:'column' }}>
      <ExtrasNav onBack={() => router.push('/vacancies')} backLabel="← Back to vacancies" />
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:40 }}>
        <div style={{ fontSize:52 }}>📋</div>
        <div style={{ fontSize:22, fontWeight:800, color:T.ink }}>Vacancy not found</div>
        <div style={{ fontSize:15, color:T.ink3, fontWeight:500 }}>This listing may have been closed or removed.</div>
        <button onClick={() => router.push('/vacancies')} style={{ border:'none', background:T.footerBg, color:T.cardBg, borderRadius:10, padding:'11px 24px', fontFamily:font, fontSize:14.5, fontWeight:800, cursor:'pointer', marginTop:8 }}>
          Browse all vacancies
        </button>
      </div>
    </div>
  );

  const color = vacancy.sColor || '#1A3D2C';
  const deadlineStr = vacancy.deadline
    ? new Date(vacancy.deadline).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
    : null;
  const isExpired = vacancy.deadline ? new Date(vacancy.deadline) < new Date() : false;

  const handleApply = () => {
    if (!user) { setShowAuth(true); } else { setApplyOpen(true); }
  };

  const statsRow = [
    { label:'SALARY',           value: vacancy.salaryRange },
    { label:'EXPERIENCE',       value: vacancy.experienceLevel },
    { label:'MIN. QUALIFICATION', value: vacancy.minQualification },
    { label:'LOCATION',         value: vacancy.city || vacancy.location },
  ].filter(s => s.value);

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:font, display:'flex', flexDirection:'column' }}>
      <ExtrasNav onBack={() => router.push('/vacancies')} backLabel="← Back to vacancies" />

      {/* White header */}
      <div style={{ background:T.cardBg, borderBottom:`1.5px solid ${T.line}`, flexShrink:0 }}>
        <div style={{ maxWidth:980, margin:'0 auto', padding:'28px 40px 0' }}>

          {/* Title row */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:20, marginBottom:20 }}>
            {/* School avatar */}
            <div style={{ width:64, height:64, borderRadius:14, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:26, fontWeight:900, color:'#fff' }}>
              {vacancy.sName[0]}
            </div>

            {/* Title + badges + school */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#166534', background:T.accentLight, border:`1px solid ${T.line}`, borderRadius:6, padding:'3px 10px' }}>{vacancy.type}</span>
                {vacancy.trcnRequired && <span style={{ fontSize:13, fontWeight:700, color:'#92400E', background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:6, padding:'3px 10px' }}>TRCN required</span>}
                {isExpired && <span style={{ fontSize:13, fontWeight:700, color:'#B91C1C', background:'#FEE2E2', border:'1px solid #FECACA', borderRadius:6, padding:'3px 10px' }}>Deadline passed</span>}
                <span style={{ fontSize:13, fontWeight:600, color:T.ink3, background:T.inputBg, border:`1px solid ${T.line}`, borderRadius:6, padding:'3px 10px' }}>{vacancy.dept}</span>
              </div>
              <h1 style={{ margin:'0 0 6px', fontSize:27, fontWeight:900, color:T.ink, lineHeight:1.2 }}>{vacancy.title}</h1>
              <div style={{ fontSize:15, color:T.ink2, fontWeight:600 }}>
                {vacancy.sName}{vacancy.city ? <span> · <span style={{ color:T.ink3 }}>📍</span> {vacancy.city}</span> : null}
              </div>
            </div>

            {/* Deadline top-right */}
            {deadlineStr && (
              <div style={{ textAlign:'right', flexShrink:0, paddingTop:2 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.ink3, textTransform:'uppercase', letterSpacing:.8, marginBottom:3 }}>Deadline</div>
                <div style={{ fontSize:19, fontWeight:900, color: isExpired ? '#B91C1C' : T.ink }}>{deadlineStr}</div>
              </div>
            )}
          </div>

          {/* Stats row — attached to bottom of header */}
          {statsRow.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${statsRow.length}, 1fr)`, border:`1.5px solid ${T.line}`, borderBottom:'none', borderRadius:'10px 10px 0 0', overflow:'hidden' }}>
              {statsRow.map((s, i) => (
                <div key={s.label} style={{ padding:'13px 18px', background:T.inputBg, borderRight: i < statsRow.length - 1 ? `1.5px solid ${T.line}` : 'none' }}>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink3, textTransform:'uppercase', letterSpacing:.7, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.ink }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, maxWidth:980, width:'100%', margin:'0 auto', padding:'28px 40px', display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'flex-start' }}>

        {/* Left: main content */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* About this role */}
          {(vacancy.roleOverview || vacancy.summary) && (
            <section style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'24px 26px' }}>
              <h2 style={{ margin:'0 0 14px', fontSize:17, fontWeight:800, color:T.ink }}>About this role</h2>
              <p style={{ margin:0, fontSize:14.5, color:T.ink2, lineHeight:1.75 }}>
                {vacancy.roleOverview ?? vacancy.summary}
              </p>
            </section>
          )}

          {/* Key responsibilities */}
          {vacancy.keyResponsibilities && (
            <section style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'24px 26px' }}>
              <h2 style={{ margin:'0 0 16px', fontSize:17, fontWeight:800, color:T.ink }}>Key responsibilities</h2>
              <BulletList text={vacancy.keyResponsibilities} />
            </section>
          )}

          {/* Requirements & qualifications — numbered */}
          {vacancy.requirements && (
            <section style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'24px 26px' }}>
              <h2 style={{ margin:'0 0 16px', fontSize:17, fontWeight:800, color:T.ink }}>Requirements & qualifications</h2>
              <NumberedList text={vacancy.requirements} />
            </section>
          )}

          {/* Perks & benefits — grey outlined chips */}
          {vacancy.perks.length > 0 && (
            <section style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'24px 26px' }}>
              <h2 style={{ margin:'0 0 16px', fontSize:17, fontWeight:800, color:T.ink }}>Perks & benefits</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {vacancy.perks.map(p => (
                  <span key={p} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13.5, fontWeight:600, color:T.ink2, background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:20, padding:'7px 14px' }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:T.ink2, flexShrink:0 }} />
                    {p}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* How to apply */}
          {vacancy.applyInstructions && (
            <section style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'24px 26px' }}>
              <h2 style={{ margin:'0 0 12px', fontSize:17, fontWeight:800, color:T.ink }}>How to apply</h2>
              <p style={{ margin:0, fontSize:14, color:T.ink2, lineHeight:1.7 }}>{vacancy.applyInstructions}</p>
            </section>
          )}
        </div>

        {/* Right: sticky sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:24 }}>

          {/* Apply CTA — dark forest green card */}
          <div style={{ background:T.footerBg, borderRadius:14, padding:'22px 22px' }}>
            <div style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:8 }}>Apply for this role</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,.65)', lineHeight:1.65, marginBottom:18 }}>
              Applications submitted via SchoolCity are shared directly with the school's SchoolOS recruitment inbox.
            </div>
            <button
              onClick={handleApply}
              disabled={isExpired}
              style={{ width:'100%', border:'1.5px solid rgba(255,255,255,.25)', background:'rgba(255,255,255,.12)', color:'#fff', borderRadius:10, padding:'13px', fontFamily:font, fontSize:15, fontWeight:800, cursor: isExpired ? 'not-allowed' : 'pointer', marginBottom:12, opacity: isExpired ? .6 : 1 }}>
              {isExpired ? 'Applications closed' : user ? 'Apply for this role →' : 'Sign in to apply →'}
            </button>
            {!isExpired && vacancy.applyEmail && (
              <div style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,.55)', fontWeight:500 }}>
                or email{' '}
                <a href={`mailto:${vacancy.applyEmail}`} style={{ color:'rgba(255,255,255,.9)', fontWeight:700, textDecoration:'none' }}>
                  {vacancy.applyEmail}
                </a>
              </div>
            )}
          </div>

          {/* Job details */}
          <div style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'18px 20px' }}>
            <div style={{ fontSize:11.5, fontWeight:800, color:T.ink3, textTransform:'uppercase', letterSpacing:.7, marginBottom:14 }}>Job details</div>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              {[
                { label:'Employment', value: vacancy.type, badge: V_TYPE_CLR[vacancy.type] },
                { label:'Department',  value: vacancy.dept },
                { label:'Location',    value: vacancy.city || vacancy.location },
                { label:'Salary',      value: vacancy.salaryRange },
                { label:'Experience',  value: vacancy.experienceLevel },
                { label:'Qualification', value: vacancy.minQualification },
                { label:'TRCN required', value: vacancy.trcnRequired ? 'Yes' : null },
                { label:'Deadline',    value: deadlineStr },
              ].filter(r => r.value).map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:13, color:T.ink3, fontWeight:600, flexShrink:0 }}>{r.label}</span>
                  {r.badge
                    ? <span style={{ fontSize:12, fontWeight:700, color:'#fff', background:r.badge, borderRadius:5, padding:'2px 8px' }}>{r.value}</span>
                    : <span style={{ fontSize:13, color:T.ink, fontWeight:700, textAlign:'right' }}>{r.value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Posted by */}
          <div style={{ background:T.cardBg, border:`1.5px solid ${T.line}`, borderRadius:14, padding:'18px 20px' }}>
            <div style={{ fontSize:11.5, fontWeight:800, color:T.ink3, textTransform:'uppercase', letterSpacing:.7, marginBottom:14 }}>Posted by</div>
            <div style={{ display:'flex', alignItems:'center', gap:13, marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:11, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18, fontWeight:900, color:'#fff' }}>
                {vacancy.sName[0]}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:T.ink }}>{vacancy.sName}</div>
                {vacancy.city && <div style={{ fontSize:12.5, color:T.ink3, fontWeight:600, marginTop:2 }}>📍 {vacancy.city}</div>}
              </div>
            </div>
            <button
              onClick={() => router.push('/schools/' + vacancy.sId)}
              style={{ width:'100%', border:`1.5px solid ${T.line}`, background:T.cardBg, borderRadius:9, padding:'10px', fontFamily:font, fontSize:13.5, fontWeight:700, color:T.ink2, cursor:'pointer' }}>
              View school profile →
            </button>
          </div>
        </div>
      </div>

      {applyOpen && vacancy && <SNApplyModal vacancy={vacancy} user={user} onClose={() => setApplyOpen(false)} />}
      {showAuth && (
        <SCAuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={acc => { setUser(acc); setShowAuth(false); setApplyOpen(true); toast('Welcome, ' + acc.name.split(' ')[0] + '!'); }}
          reason="apply"
          applyEmail={vacancy.applyEmail}
        />
      )}
    </div>
  );
}
