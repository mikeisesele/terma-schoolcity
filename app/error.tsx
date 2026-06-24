'use client';
import { SN } from '@/lib/tokens';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', background: SN.bg, fontFamily: SN.font, textAlign: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420 }}>
        <div className="sn-head" style={{ fontSize: 34, fontWeight: 600, color: SN.accent }}>Something went wrong</div>
        <p style={{ color: SN.ink2, fontWeight: 600, fontSize: 15, margin: '10px 0 20px', lineHeight: 1.6 }}>We hit a snag loading this page. Please try again.</p>
        <button onClick={reset} style={{ background: SN.accent, color: '#fff', border: 'none', borderRadius: SN.pill, padding: '11px 24px', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', fontFamily: SN.font }}>Try again</button>
      </div>
    </div>
  );
}
