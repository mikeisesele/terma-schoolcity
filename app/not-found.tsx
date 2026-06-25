import Link from 'next/link';
import { T } from '@/lib/tokens';

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'grid', placeItems:'center', background:T.bg, fontFamily:T.font, textAlign:'center' }}>
      <div>
        <div style={{ fontSize:64, fontWeight:600, color:T.accent }}>404</div>
        <p style={{ color:'#374151', fontWeight:600 }}>We couldn&apos;t find that school.</p>
        <Link href="/" style={{ display:'inline-block', marginTop:12, background:T.accent, color:T.accentText, padding:'11px 22px', borderRadius:T.btnR, fontWeight:700 }}>Browse schools</Link>
      </div>
    </div>
  );
}
