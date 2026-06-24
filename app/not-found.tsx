import Link from 'next/link';
import { SN } from '@/lib/tokens';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: SN.bg, fontFamily: SN.font, textAlign: 'center' }}>
      <div>
        <div className="sn-head" style={{ fontSize: 64, fontWeight: 600, color: SN.accent }}>404</div>
        <p style={{ color: SN.ink2, fontWeight: 600 }}>We couldn’t find that school.</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: 12, background: SN.accent, color: '#fff', padding: '11px 22px', borderRadius: SN.pill, fontWeight: 700 }}>Browse schools</Link>
      </div>
    </div>
  );
}
