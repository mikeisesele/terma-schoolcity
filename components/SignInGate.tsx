'use client';
import { useState } from 'react';
import { SN } from '@/lib/tokens';

// School Net is browse-public, act-signed-in. Applying to a vacancy, saving a school, or
// tracking an enquiry requires an account — this gate explains why and offers Google sign-in.
// (OAuth wiring lands when the Supabase project is connected; the button is stubbed until then.)
type Context = 'apply' | 'save' | 'enquire';
const COPY: Record<Context, { title: string; body: string; perks: string[] }> = {
  apply: {
    title: 'Sign in to apply',
    body: 'Create a free account to apply for this role, track your application status, and get feedback directly from the school.',
    perks: ['Apply with a saved profile & CV', 'Track every application in one place', 'Get replies and interview invites'],
  },
  save: {
    title: 'Sign in to save schools',
    body: 'Save schools you like and compare them side by side — synced to your account.',
    perks: ['Save and compare schools', 'Pick up where you left off on any device'],
  },
  enquire: {
    title: 'Sign in to enquire',
    body: 'Sign in so the school can reply to you and you can see their response.',
    perks: ['Send enquiries to schools', 'See replies in your inbox'],
  },
};

export function SignInGate({ context, onClose }: { context: Context; onClose: () => void }) {
  const [note, setNote] = useState(false);
  const c = COPY[context];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,30,25,.5)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 18, maxWidth: 420, width: '100%', padding: 28, boxShadow: SN.shadowHover, fontFamily: SN.font }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: SN.accent, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 20 }}>K</div>
          <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', fontSize: 22, color: SN.ink3, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <h2 className="sn-head" style={{ fontSize: 26, fontWeight: 600, color: SN.ink, margin: '14px 0 6px' }}>{c.title}</h2>
        <p style={{ fontSize: 14.5, color: SN.ink2, fontWeight: 500, lineHeight: 1.55, margin: 0 }}>{c.body}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
          {c.perks.map((p) => (
            <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: SN.ink, fontWeight: 600, padding: '5px 0' }}>
              <span style={{ color: SN.accent, fontWeight: 800 }}>✓</span> {p}
            </li>
          ))}
        </ul>
        <button onClick={() => setNote(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#fff', color: SN.ink, border: `1.5px solid ${SN.line}`, borderRadius: SN.pill, padding: '13px', fontWeight: 700, fontSize: 14.5, fontFamily: SN.font, cursor: 'pointer' }}>
          <GoogleMark /> Continue with Google
        </button>
        {note && <div style={{ marginTop: 12, fontSize: 12.5, color: SN.ink2, fontWeight: 600, background: SN.accentLight, borderRadius: 10, padding: '10px 12px' }}>Google sign-in activates once the School Net backend is connected.</div>}
        <p style={{ fontSize: 11.5, color: SN.ink3, fontWeight: 500, textAlign: 'center', marginTop: 14, marginBottom: 0 }}>Browsing stays free — you only sign in to act.</p>
      </div>
    </div>
  );
}

// Drop-in replacement for the static Apply / Save buttons — opens the gate on click.
export function GateButton({ context, children, style }: { context: Context; children: React.ReactNode; style?: React.CSSProperties }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: SN.accent, color: '#fff', border: 'none', borderRadius: SN.pill, padding: '10px 18px', fontWeight: 700, fontSize: 13.5, fontFamily: SN.font, cursor: 'pointer', ...style }}>{children}</button>
      {open && <SignInGate context={context} onClose={() => setOpen(false)} />}
    </>
  );
}

// Nav sign-in entry (client) — opens the gate with a neutral "save" context.
export function NavSignIn() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: SN.accent, border: 'none', padding: '9px 18px', borderRadius: SN.pill, cursor: 'pointer', fontFamily: SN.font }}>Sign in</button>
      {open && <SignInGate context="save" onClose={() => setOpen(false)} />}
    </>
  );
}

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}
