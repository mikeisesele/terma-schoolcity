'use client';

import { useState } from 'react';
import { SNNav } from '@/components/ui';
import Link from 'next/link';

const DEPTS = [
  'Secondary – Academic',
  'Primary – Academic',
  'Nursery – Academic',
  'Administration',
  'Non-academic / Support',
];

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Supply'];

interface PostForm {
  school: string;
  email: string;
  title: string;
  dept: string;
  type: string;
  deadline: string;
  salaryFrom: string;
  salaryTo: string;
  summary: string;
  requirements: string;
}

const EMPTY: PostForm = {
  school: '',
  email: '',
  title: '',
  dept: DEPTS[0],
  type: TYPES[0],
  deadline: '',
  salaryFrom: '',
  salaryTo: '',
  summary: '',
  requirements: '',
};

// ── Shared field helpers ───────────────────────────────────────────────────────
const fieldStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #E5E9EC',
  borderRadius: 9,
  padding: '10px 13px',
  fontFamily: "'Source Sans 3','Segoe UI',sans-serif",
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  color: '#111827',
  background: '#fff',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#111827',
  display: 'block',
  marginBottom: 5,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function PostVacancyPage() {
  // Simulate no auth. In production swap for real session check.
  const [authed] = useState(true); // set to false to test auth gate
  const [form, setForm] = useState<PostForm>(EMPTY);
  const [sent, setSent] = useState(false);

  function set(k: keyof PostForm, v: string) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function handleSubmit() {
    if (form.school && form.email && form.title) setSent(true);
  }

  // ── Success ──
  if (sent) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFB', fontFamily: "'Source Sans 3','Segoe UI',sans-serif" }}>
        <SNNav />
        <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center', padding: '48px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,.08)', border: '1.5px solid #E5E9EC' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', marginBottom: 8 }}>Vacancy submitted!</div>
          <div style={{ fontSize: 15, color: '#6B7280', fontWeight: 500, marginBottom: 24 }}>
            Your job posting will be reviewed and published within 24 hours. Applicants can apply directly via email.
          </div>
          <Link href="/" style={{ display: 'inline-block', border: 'none', background: '#1A3D2C', color: '#fff', borderRadius: 10, padding: '12px 28px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}>
            Back to School Net
          </Link>
        </div>
      </div>
    );
  }

  // ── Auth gate ──
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFB', fontFamily: "'Source Sans 3','Segoe UI',sans-serif" }}>
        <SNNav />
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '48px 32px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,.08)', border: '1.5px solid #E5E9EC' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#111827', marginBottom: 8 }}>Sign in to post a vacancy</div>
          <div style={{ fontSize: 15, color: '#6B7280', fontWeight: 500, marginBottom: 28 }}>
            You need a School Net school account to post job listings.
          </div>
          <Link
            href="/sign-in?next=/vacancies/post"
            style={{ display: 'inline-block', background: '#1A3D2C', color: '#fff', borderRadius: 10, padding: '12px 28px', fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}
          >
            Sign in with Google →
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFB', fontFamily: "'Source Sans 3','Segoe UI',sans-serif" }}>
      <SNNav />
      <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px 80px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 900, color: '#111827' }}>Post a vacancy</h1>
        <p style={{ margin: '0 0 32px', fontSize: 15, color: '#6B7280', fontWeight: 500 }}>
          Reach thousands of qualified teachers and school staff across Nigeria.
        </p>

        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E9EC', padding: 32 }}>
          {/* School + email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="School name">
              <input value={form.school} onChange={e => set('school', e.target.value)} placeholder="e.g. Greenfield International School" style={fieldStyle} />
            </Field>
            <Field label="Contact email">
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@yourschool.edu.ng" type="email" style={fieldStyle} />
            </Field>
          </div>

          {/* Job title */}
          <div style={{ marginBottom: 16 }}>
            <Field label="Job title">
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Mathematics Teacher (SSS)" style={fieldStyle} />
            </Field>
          </div>

          {/* Dept / Type / Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Department">
              <select value={form.dept} onChange={e => set('dept', e.target.value)} style={fieldStyle}>
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={e => set('type', e.target.value)} style={fieldStyle}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Deadline">
              <input value={form.deadline} onChange={e => set('deadline', e.target.value)} placeholder="e.g. 30 Jul 2026" style={fieldStyle} />
            </Field>
          </div>

          {/* Salary range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Salary from (₦/month, optional)">
              <input value={form.salaryFrom} onChange={e => set('salaryFrom', e.target.value)} placeholder="e.g. 80,000" style={fieldStyle} />
            </Field>
            <Field label="Salary to (₦/month, optional)">
              <input value={form.salaryTo} onChange={e => set('salaryTo', e.target.value)} placeholder="e.g. 150,000" style={fieldStyle} />
            </Field>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <Field label="Role overview / Job description">
              <textarea
                value={form.summary}
                onChange={e => set('summary', e.target.value)}
                placeholder="Describe the responsibilities and day-to-day duties…"
                style={{ ...fieldStyle, minHeight: 100, resize: 'vertical' }}
              />
            </Field>
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: 20 }}>
            <Field label="Requirements">
              <textarea
                value={form.requirements}
                onChange={e => set('requirements', e.target.value)}
                placeholder={'• B.Sc. Mathematics\n• TRCN registered\n• 3+ years experience'}
                style={{ ...fieldStyle, minHeight: 80, resize: 'vertical' }}
              />
            </Field>
          </div>

          {/* Validation hint */}
          {!(form.school && form.email && form.title) && (
            <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500, marginBottom: 12 }}>
              School name, contact email and job title are required.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!(form.school && form.email && form.title)}
            style={{ width: '100%', border: 'none', background: form.school && form.email && form.title ? '#1A3D2C' : '#D1D5DB', color: '#fff', borderRadius: 10, padding: 13, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: form.school && form.email && form.title ? 'pointer' : 'not-allowed', transition: 'background .2s' }}
          >
            Submit vacancy →
          </button>
        </div>
      </div>
    </div>
  );
}
