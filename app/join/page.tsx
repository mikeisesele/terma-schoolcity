'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { T } from '@/lib/tokens';
import { supabase } from '@/lib/supabase';

type ReferrerSchool = { name: string; city: string; tagline: string; imageUrl: string | null };

const PORTAL_REGISTER_URL = 'https://app.schoolos.ng/register';

export default function JoinPage() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') ?? '';

  const [referrer, setReferrer] = useState<ReferrerSchool | null>(null);
  const [loading, setLoading]   = useState(!!refCode);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!refCode) return;
    supabase
      .from('schools')
      .select('name, city, motto, image_url')
      .eq('referral_code', refCode)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setReferrer({
            name:     String(data.name),
            city:     String(data.city ?? ''),
            tagline:  String(data.motto ?? ''),
            imageUrl: data.image_url ? String(data.image_url) : null,
          });
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [refCode]);

  // Build the registration URL — always include ref so the portal can record it
  const registerUrl = refCode
    ? `${PORTAL_REGISTER_URL}?ref=${encodeURIComponent(refCode)}`
    : PORTAL_REGISTER_URL;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>

      {/* SchoolCity wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, lineHeight: 1 }}>SchoolOS</div>
          <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>School management platform</div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 480, background: T.cardBg, borderRadius: 24, border: `1.5px solid ${T.cardBorder}`, boxShadow: `0 8px 40px ${T.shadowColor}`, overflow: 'hidden' }}>

        {/* Referrer banner — only when a valid ref code is present */}
        {loading && (
          <div style={{ background: T.accentLight, padding: '20px 28px', textAlign: 'center', fontSize: 14, color: T.ink2 }}>
            Loading referral details…
          </div>
        )}

        {!loading && referrer && (
          <div style={{ background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accent}cc 100%)`, padding: '28px 28px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,.2)', border: '2px solid rgba(255,255,255,.45)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {referrer.imageUrl
                ? <img src={referrer.imageUrl} alt={referrer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{referrer.name[0]}</span>
              }
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Referred by</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>{referrer.name}</div>
              {referrer.city && <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', marginTop: 2 }}>📍 {referrer.city}</div>}
            </div>
          </div>
        )}

        {!loading && notFound && refCode && (
          <div style={{ background: '#FEF2F2', borderBottom: `1px solid #FECACA`, padding: '14px 28px', fontSize: 13.5, color: '#991B1B', fontWeight: 600 }}>
            Referral code not recognised — you can still sign up below.
          </div>
        )}

        {/* Main CTA */}
        <div style={{ padding: '32px 28px' }}>
          {referrer ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.ink, marginBottom: 6, lineHeight: 1.2 }}>
                Join SchoolOS — your first month free
              </div>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: T.ink2, lineHeight: 1.7 }}>
                {referrer.name} uses SchoolOS to manage admissions, fees, attendance, results and parent communication — all in one place. Sign up with their referral and get your first month free.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.ink, marginBottom: 6, lineHeight: 1.2 }}>
                Get started with SchoolOS
              </div>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: T.ink2, lineHeight: 1.7 }}>
                The all-in-one school management platform used by leading Nigerian schools. Set up your school in minutes.
              </p>
            </>
          )}

          {/* What's included */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {[
              ['📊', 'Results & report cards, published instantly'],
              ['💳', 'Fee collection, receipts and payment history'],
              ['📋', 'Attendance, welfare reports and parent alerts'],
              ['🚌', 'Transport with live GPS bus tracking'],
              ['🏫', 'Your school profile on SchoolCity'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 13.5, color: T.ink2, fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <a
            href={registerUrl}
            style={{ display: 'block', textAlign: 'center', background: T.accent, color: T.accentText, borderRadius: T.btnR, padding: '14px 24px', fontFamily: T.font, fontSize: 15, fontWeight: 800, textDecoration: 'none', transition: 'opacity .15s', marginBottom: 12 }}
          >
            {referrer ? 'Claim your free month →' : 'Get started free →'}
          </a>

          <div style={{ textAlign: 'center', fontSize: 13, color: T.ink3 }}>
            Already have an account?{' '}
            <a href="https://app.schoolos.ng/login" style={{ color: T.accent, fontWeight: 700, textDecoration: 'none' }}>Sign in</a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.line}`, padding: '14px 28px', display: 'flex', gap: 20, justifyContent: 'center' }}>
          <Link href="/" style={{ fontSize: 12, color: T.ink3, textDecoration: 'none', fontWeight: 600 }}>Browse schools</Link>
          <a href="https://schoolos.ng/legal/privacy" style={{ fontSize: 12, color: T.ink3, textDecoration: 'none', fontWeight: 600 }}>Privacy</a>
          <a href="mailto:hello@schoolos.ng" style={{ fontSize: 12, color: T.ink3, textDecoration: 'none', fontWeight: 600 }}>Contact</a>
        </div>
      </div>
    </div>
  );
}
