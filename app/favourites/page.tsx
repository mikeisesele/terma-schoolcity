'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ExtrasNav, SCCard, SCAuthModal } from '@/components/ui';
import type { School } from '@/lib/data';
import { useSchools } from '@/lib/useSchools';
import { T } from '@/lib/tokens';

export default function SNFavorites() {
  const router = useRouter();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [user, setUser]     = useState<{name:string;email:string;avatar:string;color:string}|null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { schools: allSchools } = useSchools();

  useEffect(() => {
    try { const u = localStorage.getItem('sc_user'); if (u) setUser(JSON.parse(u)); } catch {}
    try { const f = localStorage.getItem('sc_favs'); if (f) setFavIds(JSON.parse(f)); } catch {}
  }, []);

  const schools = allSchools.filter(s => favIds.includes(s.id));

  const toggleFav = (id: string) => {
    const next = favIds.includes(id) ? favIds.filter(x=>x!==id) : [...favIds, id];
    setFavIds(next);
    try { localStorage.setItem('sc_favs', JSON.stringify(next)); } catch {}
    toast(next.includes(id) ? 'School saved ♥' : 'Removed from saved');
  };

  const clearAll = () => {
    setFavIds([]);
    try { localStorage.removeItem('sc_favs'); } catch {}
  };

  const onSelect = (s: School) => router.push('/schools/' + s.id);

  if (!user) {
    return (
      <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font, display:'flex', flexDirection:'column' }}>
        <ExtrasNav onBack={() => router.push("/")} backLabel="← Back to SchoolCity" />
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🔐</div>
          <div style={{ fontSize:22, fontWeight:800, color:T.ink, marginBottom:8 }}>Sign in to see saved schools</div>
          <div style={{ fontSize:14.5, color:T.ink3, fontWeight:500, maxWidth:320, lineHeight:1.65, marginBottom:28 }}>
            Your saved schools are tied to your account. Sign in with Google to access them from any device.
          </div>
          <button onClick={() => setShowAuth(true)} style={{ display:'flex', alignItems:'center', gap:12, border:`1.5px solid ${T.line}`, background:T.cardBg, borderRadius:12, padding:'13px 24px', fontFamily:'inherit', fontSize:15, fontWeight:700, color:T.ink, cursor:'pointer', boxShadow:`0 1px 6px ${T.shadowColor}` }}>
            <svg width="20" height="20" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        {showAuth && <SCAuthModal onClose={()=>setShowAuth(false)} onSuccess={acc=>{ setUser(acc); setShowAuth(false); try{localStorage.setItem('sc_user',JSON.stringify(acc));}catch{} toast('Welcome, '+acc.name.split(' ')[0]+'!'); }} reason="save" />}
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.font, display:'flex', flexDirection:'column' }}>
      <ExtrasNav onBack={() => router.push("/")} backLabel="← Back to SchoolCity" />
      <div style={{ maxWidth:1100, width:'100%', margin:'0 auto', padding:'32px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ margin:0, fontSize:22, fontWeight:900, color:T.ink }}>
            ❤️ Saved schools <span style={{ fontSize:16, color:T.ink3, fontWeight:600 }}>({schools.length})</span>
          </h2>
          {schools.length > 0 && (
            <button onClick={clearAll} style={{ border:'none', background:'none', color:'#EF4444', fontFamily:'inherit', fontSize:13.5, fontWeight:700, cursor:'pointer', textDecoration:'underline' }}>Clear all</button>
          )}
        </div>
        {schools.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <div style={{ fontSize:56 }}>🏫</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>No saved schools yet</div>
            <div style={{ fontSize:14.5, color:T.ink3, fontWeight:500, maxWidth:300, textAlign:'center', lineHeight:1.6 }}>Tap ♥ on any school card to save it here for later.</div>
            <button onClick={() => router.push('/')} style={{ border:`2px solid ${T.navInk}`, background:T.cardBg, color:T.navInk, borderRadius:10, padding:'10px 24px', fontFamily:'inherit', fontSize:14, fontWeight:800, cursor:'pointer', marginTop:8 }}>Browse schools</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {schools.map(s => (
              <SCCard key={s.id} school={s} onSelect={onSelect} isFav={true} onToggleFav={toggleFav} inCompare={false} onToggleCompare={()=>{}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
