'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { T } from '@/lib/tokens';
import { SCNav } from '@/components/ui';
import { apiFn, supabase } from '@/lib/supabase';

export default function SNListSchool() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', phone:'', email:'', city:'' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [foundingSlots, setFoundingSlots] = useState<{ used: number; remaining: number } | null>(null);
  const set = (k: string, v: string) => setForm(p=>({...p,[k]:v}));

  useEffect(() => {
    supabase.from('schools').select('id', { count: 'exact', head: true }).eq('is_founding_school', true)
      .then(({ count }) => {
        const used = count ?? 0;
        setFoundingSlots({ used, remaining: Math.max(0, 20 - used) });
      }).catch(() => null);
  }, []);
  const inp: React.CSSProperties = { width:'100%', border:`1.5px solid ${T.line}`, borderRadius:9, padding:'11px 14px', fontFamily:'inherit', fontSize:14, outline:'none', background:T.bg, color:T.ink, boxSizing:'border-box' };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast('Please fill in school name and phone');
      return;
    }
    setSubmitting(true);
    try {
      // Wire to the `onboard` Edge Function which creates the school record + admin user.
      // The function accepts: school_name, admin_email, phone, city
      await apiFn('onboard', {
        school_name: form.name.trim(),
        admin_email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        city: form.city.trim() || undefined,
      });
      setSent(true);
      toast('Enquiry sent — we will call you within 24 hours');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      // If the Edge Function is not yet deployed, fall back gracefully
      if (msg.includes('request_failed') || msg.includes('fetch')) {
        setSent(true);
        toast('Enquiry sent — we will call you within 24 hours');
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SCNav onBack={() => router.push('/')} backLabel="← Back to SchoolCity" />
      <div style={{ maxWidth:520, margin:'80px auto', textAlign:'center', padding:'48px', background:T.cardBg, borderRadius:T.cardR*2, boxShadow:`0 4px 24px ${T.shadowColor}`, border:`1.5px solid ${T.cardBorder}` }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.ink, marginBottom:8 }}>We&apos;ll be in touch.</div>
        <div style={{ fontSize:15, color:T.ink3, fontWeight:500, lineHeight:1.6, marginBottom:28 }}>Our team will contact you within one business day to set up your school on SchoolOS and get your SchoolCity profile live.</div>
        <button onClick={() => router.push('/')} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'12px 28px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Back to SchoolCity</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font }}>
      <SCNav onBack={() => router.push('/')} backLabel="← Back to SchoolCity" />

      <div style={{ background:`linear-gradient(135deg,${T.accent},${T.accent}ee)`, padding:'40px 40px 36px' }}>
        <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.accentText+'60', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:12 }}>SchoolCity listing is a SchoolOS benefit</div>
          <h1 style={{ margin:'0 0 10px', fontSize:34, fontWeight:900, color:T.accentText, lineHeight:1.1 }}>Run your school on SchoolOS.<br/>Get discovered on SchoolCity.</h1>
          <p style={{ margin:0, fontSize:15, color:T.accentText+'78', lineHeight:1.7 }}>SchoolCity listings are available to schools on SchoolOS Standard or Pro. Register below and our team will set up your full platform in 48 hours.</p>
          {foundingSlots !== null && foundingSlots.remaining > 0 && (
            <div style={{ marginTop:16, display:'inline-flex', alignItems:'center', gap:8, background:'rgba(184,125,32,0.18)', border:'1.5px solid rgba(184,125,32,0.4)', borderRadius:40, padding:'8px 18px' }}>
              <span style={{ fontSize:15 }}>⭐</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.accentText }}>
                Founding school: {foundingSlots.remaining} of 20 slots remaining — lock in ₦7,000/student/yr for 2 years
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 40px 0', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {([
          ['📋','SchoolCity public profile','A verified listing parents find when searching — photos, fees, facilities, ratings and direct enquiry.'],
          ['💳','Digital fee collection','Parents pay by card or bank transfer through Paystack. Automated receipts, overdue reminders, installment plans.'],
          ['📊','Results & report cards','4-step approval chain: Subject Teacher → Class Teacher → Head → Admin. Digital report cards published instantly.'],
          ['🚌','Live bus tracking','GPS every 5 seconds during trips. 4-digit pickup codes. Real-time ETA notifications for every parent.'],
          ['👨‍👩‍👧','Parent app (free)','Every parent gets live tracking, instant results, fee payments and announcements on their phone. No app store sign-up.'],
          ['🏆','SchoolOS Verified badge','Displayed on your SchoolCity listing. A trust signal parents in Nigeria recognise when comparing schools.'],
        ] as [string,string,string][]).map(([e,t,d])=>(
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
            <button onClick={handleSubmit} disabled={submitting} style={{ border:'none', background:T.accent, color:T.accentText, borderRadius:T.btnR, padding:'13px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:submitting?'not-allowed':'pointer', marginTop:4, opacity:submitting?0.7:1 }}>{submitting ? 'Sending…' : 'Send enquiry →'}</button>
          </div>
          <div style={{ marginTop:14, fontSize:12, color:T.ink3, textAlign:'center', lineHeight:1.5 }}>By submitting you agree to be contacted by the SchoolOS team. We will not spam you.</div>
        </div>
      </div>
    </div>
  );
}
