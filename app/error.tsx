'use client';
import { T } from '@/lib/tokens';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight:'70vh', display:'grid', placeItems:'center', background:T.bg, fontFamily:T.font, textAlign:'center', padding:24 }}>
      <div style={{ maxWidth:420 }}>
        <div style={{ fontSize:34, fontWeight:600, color:T.accent }}>Something went wrong</div>
        <p style={{ color:'#374151', fontWeight:600, fontSize:15, margin:'10px 0 20px', lineHeight:1.6 }}>We hit a snag loading this page. Please try again.</p>
        <button onClick={reset} style={{ background:T.accent, color:'#fff', border:'none', borderRadius:T.btnR, padding:'11px 24px', fontWeight:700, fontSize:14.5, cursor:'pointer', fontFamily:T.font }}>Try again</button>
      </div>
    </div>
  );
}
