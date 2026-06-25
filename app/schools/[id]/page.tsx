'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { SN_SCHOOLS, MOCK_REVIEWS } from '@/lib/data';
import { T } from '@/lib/tokens';
import { SNNav, Stars } from '@/components/ui';

export default function SNDetail() {
  const router = useRouter();
  const params = useParams();
  const school = SN_SCHOOLS.find(s => s.id === params.id);

  const [tab, setTab]           = useState('about');
  const [enquireOpen, setEnqOpen] = useState(false);
  const [sent, setSent]         = useState(false);
  const [form, setForm]         = useState({ name:'', phone:'', email:'', message:'' });
  const [facilityModal, setFM]  = useState<typeof facilityList[0]|null>(null);
  const [reviewsOpen, setRO]    = useState(false);
  const [isFav, setIsFav]       = useState(false);

  useEffect(() => {
    try { const f = JSON.parse(localStorage.getItem('sn_favs')||'[]'); setIsFav(f.includes(params.id)); } catch {}
  }, [params.id]);

  if (!school) return <div style={{ padding:40, fontFamily:'sans-serif', color:'#374151' }}>School not found.</div>;

  const setF = (k: string, v: string) => setForm(p=>({...p,[k]:v}));
  const toggleFav = () => {
    try {
      const f: string[] = JSON.parse(localStorage.getItem('sn_favs')||'[]');
      const next = f.includes(school.id) ? f.filter(x=>x!==school.id) : [...f, school.id];
      localStorage.setItem('sn_favs', JSON.stringify(next));
      setIsFav(next.includes(school.id));
      toast(next.includes(school.id) ? 'School saved ♥' : 'Removed from saved');
    } catch {}
  };

  const tabs: [string,string][] = [['about','About'],['facilities','Facilities'],['jobs','Vacancies ('+school.vacancies+')'],['scholarships','Scholarships ('+school.scholarships+')'],['map','Map']];

  const facilityList = [
    { label:'Science Lab',   emoji:'🔬', color:'#1A3D2C', photos:5, detail:'Fully equipped for WAEC/NECO Biology, Chemistry & Physics practicals' },
    { label:'Computer Lab',  emoji:'💻', color:'#15294B', photos:4, detail:'40 workstations, broadband internet, coding curriculum' },
    { label:'Library',       emoji:'📚', color:'#B87D20', photos:3, detail:'3,000+ books, quiet reading room, digital catalogue' },
    { label:'Sports Ground', emoji:'⚽', color:'#1F8A5B', photos:6, detail:'Football pitch, basketball court, athletics track' },
    { label:'Transport',     emoji:'🚌', color:'#E2922B', photos:3, detail:'GPS-tracked buses covering major routes' },
    { label:'Dining Hall',   emoji:'🍽️', color:'#D4591A', photos:2, detail:'Hot meals, dietary options available' },
    { label:'Security',      emoji:'🔐', color:'#2A6FDB', photos:2, detail:'CCTV surveillance, gated compound, security personnel' },
    { label:'Assembly Hall', emoji:'🏛️', color:'#7C3AED', photos:3, detail:'Capacity 500+, air-conditioned, AV system' },
    { label:'Medical Unit',  emoji:'🏥', color:'#C41E3A', photos:2, detail:'Registered nurse on-site, first aid' },
    { label:'Nursery Block', emoji:'🧸', color:'#D97757', photos:4, detail:'Dedicated Pre-Nursery & Nursery wing with play area' },
    { label:'Sick Bay',      emoji:'🩺', color:'#C41E3A', photos:2, detail:'First aid, rest beds, nurse on duty' },
  ].filter(f => school.features.some(sf => sf.toLowerCase().includes(f.label.toLowerCase().split(' ')[0].toLowerCase())));

  const mockScholarships = [
    { title:'Academic Excellence Bursary', provider:'School Alumni Foundation', category:'Bursary', value:'₦250,000/term', slots:3, remaining:2, deadline:'31 Jul 2026', covers:['Tuition (partial)','Books & materials'], eligibility:['Top 5% of class in previous term','Financial need demonstrated','Parent income declaration required'], steps:['Download application form','Attach last term result','Submit to school admin'], applyEmail:'bursary@school.edu.ng' },
    { title:'Sports Scholarship', provider:'School Sports Committee', category:'Scholarship', value:'50% tuition', slots:5, remaining:3, deadline:'15 Aug 2026', covers:['Tuition (50%)','Sports kit','Coaching sessions'], eligibility:['Varsity-level athlete','Maintains 60%+ academic average'], steps:['Sports trial with coach','Academic assessment','Letter of recommendation'], applyEmail:'sports@school.edu.ng' },
    { title:'Girls in STEM Scholarship', provider:'TechBridge Nigeria', category:'Scholarship', value:'100% tuition', slots:4, remaining:1, deadline:'20 Aug 2026', covers:['Full tuition','STEM textbooks','Lab coat & equipment','Mentorship sessions'], eligibility:['Female student','Mathematics above 75%','Science above 75%','SSS entry only'], steps:['Online application','STEM aptitude test','Panel interview'], applyEmail:'stem@techbridge.ng' },
    { title:'Alumni Bursary', provider:'Old Students Association', category:'Bursary', value:'₦150,000/term', slots:6, remaining:4, deadline:'1 Sep 2026', covers:['Tuition (partial)','Examination fees'], eligibility:['Financial need demonstrated','Good conduct record'], steps:['Submit income declaration','Two references','Panel interview'], applyEmail:'alumni@school.edu.ng' },
  ].slice(0, Math.max(school.scholarships||1, 1));

  const ratingBreakdown: [number,number][] = [[5,68],[4,31],[3,14],[2,8],[1,6]];
  const totalReviews = ratingBreakdown.reduce((s,[,n])=>s+n,0);

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB', fontFamily:"'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav onBack={() => router.push('/')} backLabel="← Back to directory"
        rightSlot={
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>{
              const url = window.location.href;
              if(navigator.share){navigator.share({title:school.name,text:school.tagline+' · '+school.city,url});}
              else{navigator.clipboard&&navigator.clipboard.writeText(url).then(()=>toast('Link copied!'));}
            }} style={{ border:`1.5px solid ${T.navInk}25`, background:'transparent', color:`${T.navInk}80`, borderRadius:8, padding:'7px 14px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>↗ Share</button>
            <button onClick={toggleFav}
              style={{ border:`1.5px solid ${T.navInk}25`, background:isFav?'rgba(239,68,68,.1)':'transparent', color:isFav?'#EF4444':`${T.navInk}80`, borderRadius:8, padding:'7px 14px', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .2s' }}>
              {isFav ? '♥ Saved' : '♡ Save'}
            </button>
            <button onClick={()=>setEnqOpen(true)} style={{ border:'none', background:'#B87D20', color:'#fff', borderRadius:9, padding:'9px 20px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Enquire now</button>
          </div>
        } />

      {/* Banner */}
      <div style={{ height:200, background:`linear-gradient(135deg,${school.color} 0%,${school.color}bb 60%,${school.color}66 100%)`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 50px)' }} />
        <div style={{ position:'absolute', bottom:20, left:40, display:'flex', alignItems:'flex-end', gap:16 }}>
          <div style={{ width:72, height:72, borderRadius:18, background:'rgba(255,255,255,.2)', border:'3px solid rgba(255,255,255,.7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontSize:28, fontWeight:900 }}>{school.name[0]}</span>
          </div>
          <div style={{ paddingBottom:4 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
              <h1 style={{ margin:0, fontSize:24, fontWeight:900, color:'#fff' }}>{school.name}</h1>
              {school.verified&&<span style={{ background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.4)', borderRadius:6, fontSize:11, fontWeight:800, color:'#fff', padding:'2px 8px' }}>✓ Verified</span>}
            </div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,.8)', fontWeight:600 }}>{school.tagline} · {school.city}</div>
          </div>
        </div>
        <div style={{ position:'absolute', top:20, right:40, display:'flex', gap:12 }}>
          {([['👩‍🎓',school.students,'students'],['🏫',school.levels,''],['📅','Est. '+school.established,'']] as [string,string,string][]).map(([e,v,l])=>(
            <div key={v} style={{ background:'rgba(0,0,0,.2)', borderRadius:10, padding:'8px 14px', textAlign:'center', backdropFilter:'blur(4px)' }}>
              <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{e} {v}</div>
              {l&&<div style={{ fontSize:10.5, color:'rgba(255,255,255,.7)', fontWeight:600 }}>{l}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Tags + rating */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E9EC', padding:'10px 40px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        {[school.type, school.gender, school.orientation, school.transport?'Transport available':null, school.boarding?'Boarding available':null].filter(Boolean).map(t=>(
          <span key={t as string} style={{ fontSize:12.5, fontWeight:700, color:'#374151', background:'#F3F4F6', borderRadius:6, padding:'4px 10px', border:'1px solid #E5E9EC' }}>{t}</span>
        ))}
        {school.special&&(school.specialFocus||[]).map(sf=>(
          <span key={sf} style={{ fontSize:12.5, fontWeight:700, color:'#7C3AED', background:'#EDE9FE', borderRadius:6, padding:'4px 10px', border:'1px solid #C4B5FD' }}>{sf}</span>
        ))}
        <div style={{ flex:1 }} />
        <Stars rating={school.rating} />
        <button onClick={()=>setRO(true)} style={{ border:'none', background:'none', color:'#1A3D2C', fontFamily:'inherit', fontSize:12.5, fontWeight:700, cursor:'pointer', textDecoration:'underline', padding:0 }}>{school.reviews} reviews</button>
      </div>

      {/* Tabs */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E5E9EC', paddingLeft:36, display:'flex' }}>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ border:'none', borderBottom:tab===id?`3px solid ${school.color}`:'3px solid transparent', background:'transparent', padding:'12px 18px', fontFamily:'inherit', fontSize:14, fontWeight:tab===id?800:600, color:tab===id?school.color:'#6B7280', cursor:'pointer', transition:'all .15s', marginBottom:-1 }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 40px' }}>
        {tab==='about'&&(
          <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:28 }}>
            <div>
              <h3 style={{ margin:'0 0 10px', fontSize:17, fontWeight:800, color:'#111827' }}>About</h3>
              <p style={{ margin:'0 0 20px', fontSize:14.5, color:'#374151', fontWeight:500, lineHeight:1.7 }}>{school.name} is a verified school in {school.city}. We offer {school.levels} education in a {school.type.toLowerCase()} setting for {school.gender.toLowerCase()} students. Since {school.established}, we have been committed to academic excellence and holistic development.</p>
              <h3 style={{ margin:'0 0 10px', fontSize:17, fontWeight:800, color:'#111827' }}>Key facilities</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {school.features.map(f=><span key={f} style={{ fontSize:13, fontWeight:700, background:school.color+'14', color:school.color, borderRadius:7, padding:'5px 12px', border:`1px solid ${school.color}30` }}>{f}</span>)}
              </div>
            </div>
            <div style={{ background:'#fff', borderRadius:14, border:'1.5px solid #E5E9EC', padding:'18px 16px' }}>
              <div style={{ fontSize:14, fontWeight:800, color:'#111827', marginBottom:12 }}>Quick info</div>
              {[['📍',school.address],['📞',school.phone],['✉️',school.email],['💰','₦'+(school.feeFrom/1000).toFixed(0)+'k – ₦'+(school.feeTo/1000).toFixed(0)+'k per term']].map(([e,v])=>(
                <div key={v} style={{ display:'flex', gap:8, marginBottom:10, fontSize:13.5, color:'#374151', fontWeight:500 }}><span>{e}</span><span style={{ fontWeight:600 }}>{v}</span></div>
              ))}
              <button onClick={()=>setEnqOpen(true)} style={{ width:'100%', marginTop:6, border:'none', background:school.color, color:'#fff', borderRadius:10, padding:'12px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Send enquiry →</button>
            </div>
          </div>
        )}

        {tab==='facilities'&&(
          <div>
            <p style={{ fontSize:14, color:'#6B7280', fontWeight:500, marginBottom:16 }}>Click any tile to view photos</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {(facilityList.length>0?facilityList:school.features.map(f=>({ label:f, emoji:'🏫', color:school.color, photos:3, detail:'' }))).map(f=>(
                <div key={f.label} onClick={()=>setFM(f)}
                  style={{ background:f.color+'12', borderRadius:14, padding:'18px 12px', textAlign:'center', cursor:'pointer', border:`1.5px solid ${f.color}28`, transition:'all .15s' }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.background=f.color+'22'; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLDivElement).style.transform='none'; (e.currentTarget as HTMLDivElement).style.background=f.color+'12'; }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{f.emoji}</div>
                  <div style={{ fontSize:13.5, fontWeight:800, color:'#111827', marginBottom:4 }}>{f.label}</div>
                  <div style={{ fontSize:12, color:'#6B7280', fontWeight:500, lineHeight:1.3, marginBottom:6 }}>{f.detail}</div>
                  <div style={{ fontSize:12, color:f.color, fontWeight:700 }}>{f.photos} photos</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='jobs'&&(
          <div>
            {school.vacancies===0
              ? <div style={{ textAlign:'center', padding:'48px', color:'#9CA3AF', fontSize:15, fontWeight:600 }}>No open vacancies at this time.</div>
              : [{ title:'Mathematics Teacher', dept:'Secondary · Full-time', deadline:'30 Jul 2026', summary:'TRCN registered, 3+ years experience, SSS 1–3.' }, { title:'Basic Science Teacher', dept:'Secondary · Full-time', deadline:'25 Jul 2026', summary:'JSS 1–3, lab supervision experience required.' }, { title:'School Accountant', dept:'Administration · Full-time', deadline:'20 Jul 2026', summary:'B.Sc. Accounting, 3+ years, proficient in Excel.' }, { title:'ICT Coordinator', dept:'Administration · Full-time', deadline:'10 Aug 2026', summary:'Oversee computer lab and ICT infrastructure.' }, { title:'School Nurse', dept:'Non-academic · Full-time', deadline:'15 Jul 2026', summary:'Registered Nurse with valid NMCN licence.' }].slice(0,school.vacancies).map((v,i)=>(
                <div key={i} style={{ background:'#fff', border:'1.5px solid #E5E9EC', borderRadius:14, padding:'16px 18px', marginBottom:12, display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:11, background:school.color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>💼</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:'#111827', marginBottom:3 }}>{v.title}</div>
                    <div style={{ fontSize:13, color:'#6B7280', fontWeight:600, marginBottom:5 }}>{v.dept} · Deadline: {v.deadline}</div>
                    <div style={{ fontSize:13.5, color:'#374151', fontWeight:500 }}>{v.summary}</div>
                  </div>
                  <button style={{ border:`2px solid ${school.color}`, background:'#fff', color:school.color, borderRadius:9, padding:'8px 18px', fontFamily:'inherit', fontSize:13, fontWeight:800, cursor:'pointer', flexShrink:0 }}>Apply</button>
                </div>
              ))
            }
          </div>
        )}

        {tab==='scholarships'&&(
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:12, padding:'12px 16px', fontSize:13.5, color:'#92400E', fontWeight:600 }}>
              🎓 {school.name} offers {school.scholarships} scholarship{school.scholarships!==1?'s':''} — apply directly through the school.
            </div>
            {mockScholarships.map((s,i)=>(
              <div key={i} style={{ background:'#fff', border:'1.5px solid #E5E9EC', borderRadius:16, overflow:'hidden' }}>
                <div style={{ background:'linear-gradient(90deg,#FFFBEB,#FEF3C7)', padding:'16px 20px', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid #FDE68A' }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'#FEF3C7', border:'2px solid #FCD34D', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>🎓</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:17, fontWeight:900, color:'#111827', marginBottom:2 }}>{s.title}</div>
                    <div style={{ fontSize:13, color:'#6B7280', fontWeight:600 }}>By {s.provider}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:20, fontWeight:900, color:'#D97706' }}>{s.value}</div>
                    <div style={{ fontSize:12, color:'#6B7280', fontWeight:600 }}>{s.remaining} of {s.slots} slots left</div>
                  </div>
                </div>
                <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>What it covers</div>
                    {s.covers.map(c=><div key={c} style={{ fontSize:13.5, color:'#374151', fontWeight:500, marginBottom:5 }}>✓ {c}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>Eligibility</div>
                    {s.eligibility.map(e=><div key={e} style={{ fontSize:12.5, color:'#374151', fontWeight:500, marginBottom:5, display:'flex', gap:6 }}><span style={{ color:'#D97706', flexShrink:0 }}>•</span>{e}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>How to apply</div>
                    {s.steps.map((step,si)=><div key={si} style={{ fontSize:12.5, color:'#374151', fontWeight:500, marginBottom:5, display:'flex', gap:8 }}><span style={{ width:18, height:18, borderRadius:'50%', background:'#FEF3C7', color:'#D97706', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{si+1}</span>{step}</div>)}
                  </div>
                </div>
                <div style={{ padding:'12px 20px', borderTop:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FAFAFA' }}>
                  <div style={{ fontSize:13, color:'#6B7280', fontWeight:600 }}>Deadline: <strong style={{ color:'#111827' }}>{s.deadline}</strong> · {s.applyEmail}</div>
                  <button onClick={()=>setEnqOpen(true)} style={{ border:'none', background:'#D97706', color:'#fff', borderRadius:9, padding:'9px 20px', fontFamily:'inherit', fontSize:13, fontWeight:800, cursor:'pointer' }}>Enquire to apply →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='map'&&(
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:12, padding:'12px 16px', border:'1.5px solid #E5E9EC', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>📍</span>
              <div><div style={{ fontSize:14.5, fontWeight:700, color:'#111827' }}>{school.address}</div><div style={{ fontSize:13, color:'#9CA3AF', fontWeight:600 }}>{school.phone} · {school.email}</div></div>
            </div>
            <div style={{ borderRadius:14, overflow:'hidden', border:'1.5px solid #E5E9EC', height:420 }}>
              <iframe title="School map" src="https://www.openstreetmap.org/export/embed.html?bbox=7.37%2C9.09%2C7.43%2C9.13&layer=mapnik&marker=9.1092%2C7.3911" width="100%" height="420" style={{ border:'none', display:'block' }} loading="lazy" />
            </div>
          </div>
        )}
      </div>

      {/* Facility photo modal */}
      {facilityModal&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.72)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:680, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.4)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'18px 20px', borderBottom:'1px solid #E5E9EC', flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{facilityModal.emoji}</span>
              <div style={{ flex:1 }}><div style={{ fontSize:16, fontWeight:800, color:'#111827' }}>{facilityModal.label}</div><div style={{ fontSize:13, color:'#6B7280', fontWeight:500 }}>{facilityModal.detail}</div></div>
              <button onClick={()=>setFM(null)} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                {Array.from({ length:facilityModal.photos }, (_,idx)=>(
                  <div key={idx} style={{ aspectRatio:'4/3', borderRadius:12, background:`linear-gradient(135deg,${facilityModal.color} 0%,${facilityModal.color}99 100%)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}>
                    <span style={{ fontSize:40 }}>{facilityModal.emoji}</span>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,.8)', fontWeight:700 }}>Photo {idx+1} of {facilityModal.photos}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews modal */}
      {reviewsOpen&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.62)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:600, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.35)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div><div style={{ fontSize:17, fontWeight:800, color:'#111827' }}>Parent reviews — {school.name}</div><div style={{ fontSize:13, color:'#6B7280', fontWeight:500 }}>Submitted via the Kidtrack Parent App</div></div>
              <button onClick={()=>setRO(false)} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', gap:24, alignItems:'center', flexShrink:0 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:48, fontWeight:900, color:'#111827', lineHeight:1 }}>{school.rating}</div>
                <Stars rating={school.rating} />
                <div style={{ fontSize:12, color:'#9CA3AF', fontWeight:600, marginTop:3 }}>{school.reviews} reviews</div>
              </div>
              <div style={{ flex:1 }}>
                {ratingBreakdown.map(([stars,count])=>(
                  <div key={stars} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#374151', width:16, textAlign:'right' }}>{stars}★</span>
                    <div style={{ flex:1, height:8, borderRadius:4, background:'#F3F4F6', overflow:'hidden' }}>
                      <div style={{ width:`${Math.round(count/totalReviews*100)}%`, height:'100%', background:'#F59E0B', borderRadius:4 }} />
                    </div>
                    <span style={{ fontSize:12, color:'#9CA3AF', fontWeight:600, width:24 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:'12px 24px' }}>
              {MOCK_REVIEWS.map((r,i)=>(
                <div key={i} style={{ padding:'14px 0', borderBottom:i<MOCK_REVIEWS.length-1?'1px solid #F3F4F6':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:school.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:school.color, fontSize:13, flexShrink:0 }}>{r.name.replace(/[^A-Z]/g,'').slice(0,2)}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{r.name}</div>
                      <div style={{ fontSize:12, color:'#9CA3AF', fontWeight:600 }}>{r.date} · {r.tag}</div>
                    </div>
                    <span style={{ fontSize:14, color:'#F59E0B', fontWeight:700 }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p style={{ margin:0, fontSize:14, color:'#374151', fontWeight:500, lineHeight:1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enquire modal */}
      {enquireOpen&&!sent&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
          <div style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:520, boxShadow:'0 24px 64px rgba(0,0,0,.3)', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #E5E9EC', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div><div style={{ fontSize:17, fontWeight:800, color:'#111827' }}>Enquire about {school.name}</div><div style={{ fontSize:13, color:'#9CA3AF' }}>We reply via phone and email within 24h</div></div>
              <button onClick={()=>setEnqOpen(false)} style={{ border:'none', background:'#F3F4F6', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B7280', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ flex:1 }}><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Full name</label><input value={form.name} onChange={e=>setF('name',e.target.value)} placeholder="e.g. Mrs Adaeze Obi" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
                <div style={{ flex:1 }}><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Phone</label><input value={form.phone} onChange={e=>setF('phone',e.target.value)} placeholder="+234 800 000 0000" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
              </div>
              <div><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Email</label><input value={form.email} onChange={e=>setF('email',e.target.value)} placeholder="you@gmail.com" style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' }}/></div>
              <div><label style={{ fontSize:12.5, fontWeight:700, color:'#111827', display:'block', marginBottom:5 }}>Message</label><textarea value={form.message} onChange={e=>setF('message',e.target.value)} placeholder="Any questions about admission, fees or facilities..." rows={3} style={{ width:'100%', border:'1.5px solid #E5E9EC', borderRadius:8, padding:'9px 12px', fontFamily:'inherit', fontSize:14, resize:'vertical', outline:'none', boxSizing:'border-box' }}/></div>
              <button onClick={()=>{ if(form.name&&form.phone&&form.email)setSent(true); }} style={{ border:'none', background:school.color, color:'#fff', borderRadius:10, padding:'13px', fontFamily:'inherit', fontSize:15, fontWeight:800, cursor:'pointer' }}>Send enquiry →</button>
            </div>
          </div>
        </div>
      )}
      {sent&&(
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:18, padding:'48px', textAlign:'center', maxWidth:380 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:18, fontWeight:800, color:'#111827', marginBottom:6 }}>Enquiry sent!</div>
            <div style={{ fontSize:14, color:'#6B7280', fontWeight:500, marginBottom:20 }}>{school.name} will reply within 24 hours.</div>
            <button onClick={()=>{ setSent(false); setEnqOpen(false); }} style={{ border:'none', background:school.color, color:'#fff', borderRadius:10, padding:'10px 24px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer' }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
