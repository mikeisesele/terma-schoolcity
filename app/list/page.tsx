'use client';

import { useState } from 'react';
import { SNNav } from '@/components/ui';
import { SN } from '@/lib/tokens';

// ── Types ─────────────────────────────────────────────────────────────────────

type Plan = 'free' | 'standard' | 'premium';

interface ListForm {
  name: string;
  email: string;
  phone: string;
  plan: Plan;
}

// ── Plan comparison data ──────────────────────────────────────────────────────

const PLANS: { id: Plan; label: string; price: string; sub: string; color: string; featured?: boolean }[] = [
  {
    id: 'free',
    label: 'Free',
    price: '₦0',
    sub: 'per term',
    color: SN.ink3,
  },
  {
    id: 'standard',
    label: 'Standard',
    price: '₦25,000',
    sub: 'per term',
    color: SN.accent,
    featured: true,
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '₦50,000',
    sub: 'per term',
    color: SN.gold,
  },
];

type FeatureRow = { label: string; free: boolean | string; standard: boolean | string; premium: boolean | string };

const FEATURES: FeatureRow[] = [
  { label: 'School name listing',       free: true,  standard: true,     premium: true     },
  { label: 'Location & contact info',   free: true,  standard: true,     premium: true     },
  { label: 'Full profile page',         free: false, standard: true,     premium: true     },
  { label: 'Fee range display',         free: false, standard: true,     premium: true     },
  { label: 'Photo gallery',             free: false, standard: true,     premium: true     },
  { label: 'Open vacancies',            free: false, standard: true,     premium: true     },
  { label: 'Scholarship listings',      free: false, standard: true,     premium: true     },
  { label: 'Featured placement',        free: false, standard: false,    premium: true     },
  { label: 'Analytics dashboard',       free: false, standard: false,    premium: true     },
  { label: 'Priority badge',            free: false, standard: false,    premium: true     },
  { label: 'Parent enquiry leads',      free: false, standard: '5/term', premium: 'Unlimited' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function CheckCell({ value }: { value: boolean | string }) {
  if (value === false) return <span style={{ color: SN.ink3, fontSize: 18 }}>—</span>;
  if (value === true)  return <span style={{ color: '#1F8A5B', fontSize: 16, fontWeight: 800 }}>✓</span>;
  return <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.ink2 }}>{value}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ListPage() {
  const [form, setForm] = useState<ListForm>({ name: '', email: '', phone: '', plan: 'standard' });
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof ListForm>(k: K, v: ListForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.phone) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: SN.bg, fontFamily: SN.font }}>
        <SNNav />
        <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center', padding: '48px 40px', background: SN.cardBg, borderRadius: 20, boxShadow: SN.shadow, border: `1.5px solid ${SN.line}` }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: SN.ink }}>Application received!</h2>
          <p style={{ fontSize: 15, color: SN.ink2, fontWeight: 500, lineHeight: 1.6, marginBottom: 28 }}>
            We will contact you within 24 hours to complete verification and set up your profile.
          </p>
          <a href="/" style={{ display: 'inline-block', border: 'none', background: SN.accent, color: SN.accentText, borderRadius: SN.btnR, padding: '12px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}>
            Back to School Net
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: SN.bg, fontFamily: SN.font }}>
      <SNNav />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${SN.accent} 0%, #0A4B48 100%)`, padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: SN.gold, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 }}>
            For schools
          </div>
          <h1 style={{ fontFamily: SN.head, margin: '0 0 12px', fontSize: 42, fontWeight: 600, color: SN.accentText, lineHeight: 1.15 }}>
            Put your school on the map
          </h1>
          <p style={{ margin: '0 0 8px', fontSize: 16, color: 'rgba(250,247,240,.75)', fontWeight: 500, lineHeight: 1.65 }}>
            Join 1,247 verified schools already on School Net. Reach thousands of parents searching for the right school in Nigeria.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Plan comparison table */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: SN.head, fontSize: 30, fontWeight: 600, color: SN.ink, margin: '0 0 8px', textAlign: 'center' }}>
            Choose your plan
          </h2>
          <p style={{ fontSize: 14.5, color: SN.ink2, fontWeight: 500, textAlign: 'center', marginBottom: 32 }}>
            All plans include a verified school badge once our team confirms ownership.
          </p>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${SN.line}`, boxShadow: SN.shadow }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              {/* Plan headers */}
              <thead>
                <tr>
                  <th style={{ width: '34%', padding: '20px 20px', textAlign: 'left', background: SN.bg, borderBottom: `2px solid ${SN.line}`, fontSize: 12, fontWeight: 800, color: SN.ink3, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} style={{ padding: '20px 16px', textAlign: 'center', background: p.featured ? `${SN.accent}08` : SN.bg, borderBottom: `2px solid ${p.featured ? SN.accent : SN.line}`, borderLeft: `1px solid ${SN.line}`, position: 'relative' }}>
                      {p.featured && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: SN.accent, borderRadius: '0 0 2px 2px' }} />
                      )}
                      <div style={{ fontSize: 15, fontWeight: 900, color: p.color, marginBottom: 4 }}>{p.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: SN.ink, lineHeight: 1 }}>{p.price}</div>
                      <div style={{ fontSize: 11.5, color: SN.ink3, fontWeight: 600, marginTop: 2 }}>{p.sub}</div>
                      {p.featured && (
                        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 800, background: SN.accent, color: SN.accentText, borderRadius: 100, padding: '3px 10px', display: 'inline-block' }}>
                          Most popular
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? SN.cardBg : SN.bg }}>
                    <td style={{ padding: '11px 20px', fontSize: 13.5, fontWeight: 600, color: SN.ink2, borderBottom: `1px solid ${SN.line}` }}>
                      {row.label}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', borderBottom: `1px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}` }}>
                      <CheckCell value={row.free} />
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', borderBottom: `1px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}`, background: `${SN.accent}05` }}>
                      <CheckCell value={row.standard} />
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'center', borderBottom: `1px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}` }}>
                      <CheckCell value={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Get started form */}
        <div style={{ background: SN.cardBg, borderRadius: 20, border: `1.5px solid ${SN.line}`, padding: '36px 40px', boxShadow: SN.shadow }}>
          <h2 style={{ fontFamily: SN.head, fontSize: 28, fontWeight: 600, color: SN.ink, margin: '0 0 4px' }}>
            Get started
          </h2>
          <p style={{ fontSize: 14, color: SN.ink2, fontWeight: 500, margin: '0 0 28px' }}>
            Fill in your details and our team will be in touch within 24 hours.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: SN.ink, marginBottom: 5 }}>
                  Official school name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Greenfield International School"
                  required
                  style={{ width: '100%', border: `1.5px solid ${SN.line}`, borderRadius: 9, padding: '10px 13px', fontFamily: SN.font, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: SN.bg, color: SN.ink }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: SN.ink, marginBottom: 5 }}>
                  Official email <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="admin@school.edu.ng"
                  required
                  style={{ width: '100%', border: `1.5px solid ${SN.line}`, borderRadius: 9, padding: '10px 13px', fontFamily: SN.font, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: SN.bg, color: SN.ink }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: SN.ink, marginBottom: 5 }}>
                  Phone number <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+234 800 000 0000"
                  required
                  style={{ width: '100%', border: `1.5px solid ${SN.line}`, borderRadius: 9, padding: '10px 13px', fontFamily: SN.font, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: SN.bg, color: SN.ink }}
                />
              </div>
            </div>

            {/* Plan selection */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: SN.ink, marginBottom: 10 }}>
                Select a plan
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {PLANS.map((p) => {
                  const selected = form.plan === p.id;
                  return (
                    <label
                      key={p.id}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', border: `2px solid ${selected ? p.color : SN.line}`, borderRadius: 12, cursor: 'pointer', background: selected ? `${p.color}08` : SN.cardBg, transition: 'border-color .15s' }}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={p.id}
                        checked={selected}
                        onChange={() => set('plan', p.id)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                      />
                      <span style={{ fontSize: 16, fontWeight: 900, color: selected ? p.color : SN.ink2, marginBottom: 2 }}>{p.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: SN.ink, lineHeight: 1 }}>{p.price}</span>
                      <span style={{ fontSize: 11, color: SN.ink3, fontWeight: 600 }}>{p.sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Info note */}
            <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 10, padding: '13px 16px', marginBottom: 24, fontSize: 13, color: '#166534', fontWeight: 600, lineHeight: 1.55 }}>
              ✓ After submission our team contacts you to verify ownership and complete your profile before it goes live.
            </div>

            <button
              type="submit"
              style={{ width: '100%', border: 'none', background: SN.accent, color: SN.accentText, borderRadius: SN.btnR, padding: '14px', fontFamily: SN.font, fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.2 }}
            >
              Submit application →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
