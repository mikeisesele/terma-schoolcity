'use client';
import { useState } from 'react';
import { SN } from '@/lib/tokens';

// Growth loop: a parent nudges their (not-yet-on-KidTrack) school to join. Captures the lead
// inline; real submission lands when the backend is connected.
export function AskYourSchool() {
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <div id="ask-your-school" style={{ background: SN.footerBg, color: '#fff', padding: '40px 24px', textAlign: 'center' }}>
      <div className="sn-head" style={{ fontSize: 28, fontWeight: 600 }}>Is your school on KidTrack?</div>
      <p style={{ color: 'rgba(253,250,245,.6)', fontWeight: 500, marginTop: 8 }}>Ask them to join — we’ll reach out on your behalf.</p>
      {sent ? (
        <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.12)', borderRadius: SN.pill, padding: '12px 22px', fontWeight: 700, fontSize: 14.5 }}>
          ✓ Thanks — we’ll invite {name.trim() || 'your school'} to join KidTrack.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) setSent(true); }} style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your school’s name" required
            style={{ border: 'none', borderRadius: SN.pill, padding: '12px 20px', fontFamily: SN.font, fontSize: 14, fontWeight: 600, minWidth: 260, outline: 'none', color: SN.ink }} />
          <button type="submit" style={{ background: SN.gold, color: SN.footerBg, border: 'none', borderRadius: SN.pill, padding: '12px 22px', fontWeight: 800, fontSize: 14, fontFamily: SN.font, cursor: 'pointer' }}>Ask them to join</button>
        </form>
      )}
    </div>
  );
}
