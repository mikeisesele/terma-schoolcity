'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SNNav } from '@/components/ui';
import { SN } from '@/lib/tokens';
import { SCHOOLS } from '@/lib/data';
import type { School } from '@/lib/data';

const LS_KEY = 'sn_compare';

function readCompare(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function removeFromCompare(id: string): string[] {
  const next = readCompare().filter((c) => c !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
}

// ── Row definitions ───────────────────────────────────────────────────────────

type RowDef = {
  label: string;
  render: (s: School) => React.ReactNode;
  compare?: (s: School) => number;
};

const ROWS: RowDef[] = [
  {
    label: 'Rating',
    render: (s) => (
      <span>
        <span style={{ color: '#F59E0B', fontSize: 15 }}>{'★'.repeat(Math.floor(s.rating))}</span>
        <span style={{ color: SN.ink3, fontSize: 13, fontWeight: 700, marginLeft: 5 }}>{s.rating.toFixed(1)}</span>
      </span>
    ),
    compare: (s) => s.rating,
  },
  {
    label: 'Fee from',
    render: (s) => (
      <span style={{ fontWeight: 700 }}>
        ₦{Math.round(s.feeFrom / 100).toLocaleString()} – ₦{Math.round(s.feeTo / 100).toLocaleString()}
      </span>
    ),
    compare: (s) => -s.feeFrom, // lower fee = better
  },
  {
    label: 'Type',
    render: (s) => s.type,
  },
  {
    label: 'Gender',
    render: (s) => s.gender,
  },
  {
    label: 'Boarding',
    render: (s) =>
      s.boarding
        ? <span style={{ color: '#1F8A5B', fontWeight: 800 }}>✓ Yes</span>
        : <span style={{ color: SN.ink3 }}>—</span>,
    compare: (s) => (s.boarding ? 1 : 0),
  },
  {
    label: 'Levels',
    render: (s) => s.levels,
  },
  {
    label: 'Students',
    render: (s) => s.students,
  },
  {
    label: 'Facilities',
    render: (s) => (
      <span style={{ fontSize: 12, lineHeight: 1.5 }}>{s.features.join(' · ')}</span>
    ),
    compare: (s) => s.features.length,
  },
  {
    label: 'Transport',
    render: (s) =>
      s.transport
        ? <span style={{ color: '#1F8A5B', fontWeight: 800 }}>✓ Yes</span>
        : <span style={{ color: SN.ink3 }}>—</span>,
    compare: (s) => (s.transport ? 1 : 0),
  },
  {
    label: 'Vacancies',
    render: (s) =>
      s.vacancies.length > 0
        ? <span style={{ color: SN.accent, fontWeight: 700 }}>{s.vacancies.length} open</span>
        : <span style={{ color: SN.ink3 }}>None</span>,
  },
  {
    label: 'Scholarships',
    render: (s) =>
      s.scholarships.length > 0
        ? <span style={{ color: '#7C3AED', fontWeight: 700 }}>{s.scholarships.length} available</span>
        : <span style={{ color: SN.ink3 }}>None</span>,
    compare: (s) => s.scholarships.length,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isBest(row: RowDef, school: School, schools: School[]): boolean {
  if (schools.length < 2 || !row.compare) return false;
  const vals = schools.map((s) => row.compare!(s));
  const myVal = row.compare(school);
  return myVal === Math.max(...vals) && vals.filter((v) => v === myVal).length === 1;
}

function isDiff(row: RowDef, schools: School[]): boolean {
  if (schools.length < 2 || !row.compare) return false;
  const vals = schools.map((s) => row.compare!(s));
  return vals.some((v) => v !== vals[0]);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    setCompareIds(readCompare());
  }, []);

  const schools: School[] = compareIds
    .map((id) => SCHOOLS.find((s) => s.id === id))
    .filter((s): s is School => s !== undefined);

  const handleRemove = (id: string) => {
    setCompareIds(removeFromCompare(id));
  };

  const emptySlots = Math.max(0, 3 - schools.length);

  return (
    <div style={{ minHeight: '100vh', background: SN.bg, fontFamily: SN.font }}>
      <SNNav />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, color: SN.ink }}>
            Compare schools
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: SN.ink2, fontWeight: 500 }}>
            {schools.length} of 3 selected
            {schools.length > 1 && ' · rows highlighted in green differ between schools'}
          </p>
        </div>

        {/* Empty state */}
        {schools.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>⚖️</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: SN.ink }}>Nothing to compare yet</h2>
            <p style={{ margin: 0, fontSize: 14.5, color: SN.ink2, fontWeight: 500, maxWidth: 320, lineHeight: 1.6, textAlign: 'center' }}>
              Add schools to compare from individual school pages.
            </p>
            <Link
              href="/find"
              style={{ display: 'inline-block', border: `2px solid ${SN.accent}`, background: 'transparent', color: SN.accent, borderRadius: SN.btnR, padding: '10px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', marginTop: 8 }}
            >
              Find schools
            </Link>
          </div>
        )}

        {/* Comparison table */}
        {schools.length > 0 && (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${SN.line}`, boxShadow: SN.shadow }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  {/* Feature label column */}
                  <th style={{ width: 140, padding: '20px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: SN.ink3, textTransform: 'uppercase', letterSpacing: 0.9, background: SN.bg, borderBottom: `2px solid ${SN.line}`, position: 'sticky', top: 0, zIndex: 2 }}>
                    Feature
                  </th>

                  {/* School columns */}
                  {schools.map((s) => (
                    <th key={s.id} style={{ padding: '16px 14px', textAlign: 'center', background: SN.bg, borderBottom: `2px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}`, position: 'sticky', top: 0, zIndex: 2 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        {/* Avatar */}
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}cc 100%)`, display: 'grid', placeItems: 'center', boxShadow: `0 4px 12px ${s.color}44`, flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{s.name[0]}</span>
                        </div>
                        {/* Name */}
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: SN.ink, lineHeight: 1.2, textAlign: 'center', maxWidth: 160 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: SN.ink3, fontWeight: 600 }}>📍 {s.city}</div>
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                          <Link
                            href={`/schools/${s.id}`}
                            style={{ border: `1.5px solid ${s.color}`, background: '#fff', color: s.color, borderRadius: 7, padding: '5px 14px', fontSize: 12.5, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                          >
                            Enquire →
                          </Link>
                          <button
                            onClick={() => handleRemove(s.id)}
                            aria-label={`Remove ${s.name}`}
                            style={{ border: '1.5px solid #FCA5A5', background: '#fff', color: '#EF4444', borderRadius: 7, padding: '5px 10px', fontFamily: SN.font, fontSize: 12, cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* Empty add-slot columns */}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <th key={`empty-${i}`} style={{ padding: '16px 14px', background: SN.bg, borderBottom: `2px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}`, position: 'sticky', top: 0, zIndex: 2 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, border: `2px dashed ${SN.line}`, display: 'grid', placeItems: 'center', fontSize: 22, color: SN.line }}>+</div>
                        <Link href="/find" style={{ fontSize: 12, color: SN.ink3, fontWeight: 600, textAlign: 'center', lineHeight: 1.4, textDecoration: 'none' }}>
                          Add a school<br />to compare
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {ROWS.map((row, ri) => {
                  const diff = isDiff(row, schools);
                  return (
                    <tr key={row.label} style={{ background: diff ? '#F0F9F4' : ri % 2 === 0 ? SN.cardBg : SN.bg }}>
                      {/* Label cell */}
                      <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: diff ? SN.accent : SN.ink2, borderBottom: `1px solid ${SN.line}` }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {diff && <span style={{ width: 5, height: 5, borderRadius: '50%', background: SN.accent, display: 'inline-block', flexShrink: 0 }} />}
                          {row.label}
                        </span>
                      </td>

                      {/* School value cells */}
                      {schools.map((s) => {
                        const best = isBest(row, s, schools);
                        return (
                          <td key={s.id} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: SN.ink, textAlign: 'center', borderBottom: `1px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}`, background: best ? '#E8F5EE' : undefined, position: 'relative' }}>
                            {best && (
                              <span style={{ position: 'absolute', top: 5, right: 8, fontSize: 9, fontWeight: 800, color: '#1F8A5B', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                best
                              </span>
                            )}
                            {row.render(s)}
                          </td>
                        );
                      })}

                      {/* Empty slot cells */}
                      {Array.from({ length: emptySlots }).map((_, i) => (
                        <td key={`empty-${i}`} style={{ borderBottom: `1px solid ${SN.line}`, borderLeft: `1px solid ${SN.line}`, background: '#FAFAFA' }} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer legend */}
            <div style={{ padding: '14px 24px', borderTop: `1px solid ${SN.line}`, background: SN.bg, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: SN.accent, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 500 }}>
                Green rows highlight where schools differ. "Best" marks the leading school per metric.
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
