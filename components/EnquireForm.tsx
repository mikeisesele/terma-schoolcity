'use client';
import { useState } from 'react';
import { SN } from '@/lib/tokens';

export function EnquireForm({ school }: { school: string }) {
  const [done, setDone] = useState(false);
  if (done) {
    return <div style={{ background: SN.accentLight, color: SN.accent, borderRadius: 14, padding: 18, fontWeight: 700 }}>✓ Enquiry sent to {school}. They’ll be in touch.</div>;
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[['Your name', 'text'], ['Phone', 'tel'], ['Email', 'email'], ['Children', 'number']].map(([ph, t]) => (
        <input key={ph} type={t} placeholder={ph} required={t !== 'number'}
          style={{ border: `1.5px solid ${SN.line}`, borderRadius: 12, padding: '12px 14px', fontFamily: SN.font, fontSize: 14, fontWeight: 600, outline: 'none', background: '#fff', color: SN.ink }} />
      ))}
      <textarea placeholder="Message" rows={3} style={{ gridColumn: '1 / -1', border: `1.5px solid ${SN.line}`, borderRadius: 12, padding: '12px 14px', fontFamily: SN.font, fontSize: 14, fontWeight: 500, outline: 'none', resize: 'vertical' }} />
      <button type="submit" style={{ gridColumn: '1 / -1', background: SN.accent, color: '#fff', border: 'none', borderRadius: SN.pill, padding: '13px', fontWeight: 800, fontSize: 14.5, fontFamily: SN.font, cursor: 'pointer' }}>Send enquiry</button>
    </form>
  );
}
