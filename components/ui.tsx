'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SN } from '@/lib/tokens';
import type { School } from '@/lib/data';
import { naira } from '@/lib/data';

// ── Stars ───────────────────────────────────────────────────────────────────
// Pure display — no interactivity, no "use client" needed but file is already
// client because SNNav/SNCard/SNCompareBar require it.
export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', letterSpacing: 1 }}>
        {'★'.repeat(full)}{'☆'.repeat(empty)}
      </span>
      <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{rating.toFixed(1)}</span>
      {reviews != null && (
        <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>({reviews})</span>
      )}
    </span>
  );
}

// ── VerifiedBadge ────────────────────────────────────────────────────────────
// level prop is accepted for backward-compat with existing callers but ignored —
// the badge always renders as a simple green "Verified" chip per the prototype.
export function VerifiedBadge({ level: _level }: { level?: string } = {}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 11, fontWeight: 800,
      background: '#D6EDE0', color: '#1A3D2C',
      padding: '3px 8px', borderRadius: 9999,
    }}>
      ✓ Verified
    </span>
  );
}

// ── SHead ────────────────────────────────────────────────────────────────────
// Retained for all page-level use.
export function SHead({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div style={{ fontSize: 12.5, fontWeight: 800, color: SN.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
          {eyebrow}
        </div>
      )}
      <h2 className="sn-head" style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5, margin: 0, color: SN.ink }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 15, color: SN.ink2, fontWeight: 500, marginTop: 8 }}>{sub}</p>}
    </div>
  );
}

// ── SNNav ────────────────────────────────────────────────────────────────────
// Sticky forest nav bar, 60px. Gold K box logo. Next.js Links for nav items.
// Hamburger menu on mobile (≤640px).
export function SNNav({ rightSlot }: { rightSlot?: React.ReactNode } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      background: '#1A3D2C',
      padding: '0 40px',
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      height: 60, position: 'sticky', top: 0, zIndex: 100,
      fontFamily: SN.font, flexShrink: 0,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#B87D20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 900 }}>K</span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1 }}>School Net</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.5)', lineHeight: 1 }}>by KidTrack</div>
        </div>
      </Link>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Desktop nav links + sign in */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 6,
      }} className="sn-nav-desktop">
        <Link href="/find" style={{
          border: 'none', background: 'transparent',
          color: 'rgba(255,255,255,.75)',
          fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
          padding: '4px 10px', textDecoration: 'none', borderRadius: 6,
        }}>
          Find a school
        </Link>
        <Link href="/vacancies" style={{
          border: 'none', background: 'transparent',
          color: 'rgba(255,255,255,.75)',
          fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
          padding: '4px 10px', textDecoration: 'none', borderRadius: 6,
        }}>
          Vacancies
        </Link>
        <Link href="/list" style={{
          border: 'none', background: 'transparent',
          color: 'rgba(255,255,255,.75)',
          fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
          padding: '4px 10px', textDecoration: 'none', borderRadius: 6,
        }}>
          List your school
        </Link>
        <button style={{
          border: '1.5px solid rgba(255,255,255,.45)',
          background: 'transparent',
          color: '#fff',
          borderRadius: 100,
          padding: '7px 18px',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          marginLeft: 8,
        }}>
          Sign in
        </button>
      </nav>

      {/* Optional right slot (e.g. save/enquire on detail pages) */}
      {rightSlot && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>{rightSlot}</div>}

      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          border: 'none', background: 'transparent',
          color: '#fff', fontSize: 22, cursor: 'pointer', padding: 4,
        }}
        className="sn-nav-hamburger"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 60, left: 0, right: 0,
          background: '#1A3D2C',
          borderTop: '1px solid rgba(255,255,255,.12)',
          padding: '12px 24px 16px',
          display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 99,
        }} className="sn-nav-mobile-menu">
          <Link href="/find" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 600, padding: '8px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.08)' }}>Find a school</Link>
          <Link href="/vacancies" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 600, padding: '8px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.08)' }}>Vacancies</Link>
          <Link href="/list" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, fontWeight: 600, padding: '8px 0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.08)' }}>List your school</Link>
          <button style={{ border: '1.5px solid rgba(255,255,255,.45)', background: 'transparent', color: '#fff', borderRadius: 100, padding: '9px 18px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8, alignSelf: 'flex-start' }}>Sign in</button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .sn-nav-desktop { display: none !important; }
          .sn-nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

// ── Plan badge helper ─────────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: School['ktPlan'] }) {
  if (!plan) return null;
  if (plan === 'Premium') {
    return (
      <span style={{
        fontSize: 9.5, fontWeight: 800, color: '#fff',
        background: 'rgba(184,125,32,.85)',
        borderRadius: 6, padding: '3px 8px',
        border: '1px solid rgba(255,255,255,.3)',
        display: 'inline-flex', alignItems: 'center', gap: 3,
      }}>
        ⭐ KidTrack Premium
      </span>
    );
  }
  // Standard
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 800, color: '#fff',
      background: 'rgba(42,111,219,.75)',
      borderRadius: 6, padding: '3px 8px',
      border: '1px solid rgba(255,255,255,.25)',
    }}>
      KidTrack Standard
    </span>
  );
}

// ── SNCard ───────────────────────────────────────────────────────────────────
// Full school card matching the prototype SNCard exactly.
export interface SNCardProps {
  school: School;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  inCompare: boolean;
  onToggleCompare: (id: string) => void;
}

export function SNCard({ school, isFav, onToggleFav, inCompare, onToggleCompare }: SNCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: hovered ? '0 10px 28px rgba(0,0,0,.12)' : '0 2px 10px rgba(0,0,0,.07)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all .2s',
        border: '1.5px solid #E5E9EC',
        fontFamily: SN.font,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Banner ── */}
      <Link
        href={`/schools/${school.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{
          height: 160,
          background: `linear-gradient(135deg,${school.color} 0%,${school.color}cc 60%,${school.color}88 100%)`,
          position: 'relative',
          display: 'flex', alignItems: 'flex-end',
          padding: '0 14px 12px',
        }}>
          {/* Subtle diagonal stripe texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 30px)',
          }} />

          {/* School initial avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,.25)',
            border: '2px solid rgba(255,255,255,.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
          }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{school.name[0]}</span>
          </div>

          {/* Plan badge — top left (above avatar) */}
          {school.ktPlan && (
            <div style={{ position: 'absolute', top: 9, left: 10, zIndex: 2 }}>
              <PlanBadge plan={school.ktPlan} />
            </div>
          )}

          {/* Verified chip — top right of body area (when no Premium badge overlaps) */}
          {school.verified && !school.ktPlan && (
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,.22)', borderRadius: 5, padding: '2px 7px', border: '1px solid rgba(255,255,255,.35)' }}>
                ✓ Verified
              </span>
            </div>
          )}

          {/* Special needs label */}
          {school.special && (
            <span style={{
              position: 'absolute', bottom: 10, left: 14, zIndex: 2,
              fontSize: 10, fontWeight: 800, color: '#fff',
              background: 'rgba(0,0,0,.25)', borderRadius: 5, padding: '2px 7px',
            }}>
              Special Needs
            </span>
          )}

          {/* Fav heart button — top right */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(school.id); }}
            title={isFav ? 'Remove from saved' : 'Save school'}
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 3,
              width: 28, height: 28, borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,.35)',
              color: isFav ? '#EF4444' : 'rgba(255,255,255,.9)',
              cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'color .15s',
            }}
          >
            {isFav ? '♥' : '♡'}
          </button>
        </div>
      </Link>

      {/* ── Body ── */}
      <Link href={`/schools/${school.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ padding: '12px 14px 10px' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: 3 }}>
            {school.name}
          </div>
          <div style={{ fontSize: 12.5, color: '#6B7280', fontWeight: 600, marginBottom: 8 }}>
            📍 {school.city}
          </div>

          {/* Stars + review count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stars rating={school.rating} />
            <span style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 600 }}>{school.reviews} reviews</span>
          </div>

          {/* Fee from + plan/verified badges */}
          <div style={{
            marginTop: 8, paddingTop: 8,
            borderTop: '1px solid #F3F4F6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 6,
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#374151' }}>
              From {naira(school.feeFrom)}<span style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF' }}>/term</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {school.ktPlan && <PlanBadge plan={school.ktPlan} />}
              {school.verified && <VerifiedBadge />}
            </div>
          </div>
        </div>
      </Link>

      {/* ── Compare toggle ── */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleCompare(school.id); }}
        style={{
          display: 'block', width: '100%',
          border: 'none', borderTop: '1px solid #F3F4F6',
          background: inCompare ? '#1A3D2C' : '#FAFAFA',
          color: inCompare ? '#fff' : '#6B7280',
          padding: '7px',
          fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', transition: 'all .15s',
          borderRadius: '0 0 14px 14px',
          marginTop: 'auto',
        }}
      >
        {inCompare ? '✓ In comparison' : '+ Compare'}
      </button>
    </div>
  );
}

// ── SNCompareBar ─────────────────────────────────────────────────────────────
// Sticky bottom bar that appears when one or more schools are queued for comparison.
export interface SNCompareBarProps {
  compareIds: string[];
  schools: School[];          // caller passes the resolved School objects
  onOpen: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function SNCompareBar({ compareIds, schools, onOpen, onRemove, onClear }: SNCompareBarProps) {
  const selected = compareIds
    .map(id => schools.find(s => s.id === id))
    .filter((s): s is School => s !== undefined);

  if (selected.length === 0) return null;

  const canCompare = selected.length >= 2;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1A3D2C',
      padding: '10px 32px',
      display: 'flex', alignItems: 'center', gap: 14,
      zIndex: 200,
      boxShadow: '0 -4px 24px rgba(0,0,0,.25)',
      fontFamily: SN.font,
    }}>
      <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
        Comparing {selected.length}/3:
      </span>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {selected.map(s => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,.12)',
            borderRadius: 9, padding: '5px 10px 5px 8px',
            border: '1px solid rgba(255,255,255,.2)',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>{s.name[0]}</span>
            </div>
            <span style={{
              fontSize: 12.5, fontWeight: 700, color: '#fff',
              maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {s.name.split(' ').slice(0, 2).join(' ')}
            </span>
            <button
              onClick={() => onRemove(s.id)}
              style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,.55)', cursor: 'pointer', fontSize: 15, padding: '0 2px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        ))}

        {selected.length < 3 && (
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,.07)',
            borderRadius: 9, padding: '5px 14px',
            border: '1px dashed rgba(255,255,255,.22)',
            color: 'rgba(255,255,255,.45)', fontSize: 12.5, fontWeight: 600,
          }}>
            + add school
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onClear}
        style={{
          border: '1.5px solid rgba(255,255,255,.3)', background: 'transparent',
          color: 'rgba(255,255,255,.7)',
          borderRadius: 8, padding: '7px 15px',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Clear
      </button>

      <button
        onClick={onOpen}
        disabled={!canCompare}
        style={{
          border: 'none',
          background: canCompare ? '#B87D20' : 'rgba(255,255,255,.2)',
          color: '#fff',
          borderRadius: 9, padding: '10px 22px',
          fontFamily: 'inherit', fontSize: 14, fontWeight: 800,
          cursor: canCompare ? 'pointer' : 'default',
          opacity: canCompare ? 1 : 0.6,
        }}
      >
        {canCompare ? 'Compare →' : 'Compare (add 1 more)'}
      </button>
    </div>
  );
}
