'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SNNav, Stars, VerifiedBadge } from '@/components/ui';
import { SN } from '@/lib/tokens';
import { SCHOOLS } from '@/lib/data';
import type { School } from '@/lib/data';

const LS_KEY = 'sn_favs';

function readFavs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function removeFav(id: string): string[] {
  const next = readFavs().filter((f) => f !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
}

// ── School card (self-contained, no external SNCard dep) ──────────────────────

function FavCard({ school, onRemove }: { school: School; onRemove: (id: string) => void }) {
  return (
    <div style={{ background: SN.cardBg, borderRadius: SN.cardR, border: `1.5px solid ${SN.line}`, boxShadow: SN.shadow, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Banner */}
      <div style={{ height: 80, background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}bb 100%)`, display: 'flex', alignItems: 'flex-end', padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(4px)', border: '2px solid rgba(255,255,255,.4)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 20, fontWeight: 900 }}>
          {school.name[0]}
        </div>
        <button
          onClick={() => onRemove(school.id)}
          aria-label="Remove from saved"
          style={{ marginLeft: 'auto', border: 'none', background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 14, display: 'grid', placeItems: 'center' }}
        >
          ♥
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div style={{ marginBottom: 4 }}>
          {school.badge && <VerifiedBadge level={school.badge} />}
        </div>
        <h3 style={{ margin: '6px 0 2px', fontSize: 15, fontWeight: 800, color: SN.ink, lineHeight: 1.3 }}>{school.name}</h3>
        <p style={{ margin: '0 0 8px', fontSize: 12.5, color: SN.ink3, fontWeight: 500 }}>📍 {school.city}</p>
        <Stars rating={school.rating} reviews={school.reviews} />
        <div style={{ marginTop: 8, fontSize: 12.5, color: SN.ink2, fontWeight: 600 }}>
          {school.type} · {school.levels}
        </div>
        <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: SN.accent }}>
          ₦{Math.round(school.feeFrom / 100).toLocaleString()} – ₦{Math.round(school.feeTo / 100).toLocaleString()}/term
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${SN.line}`, background: SN.cardFooterBg }}>
        <Link
          href={`/schools/${school.id}`}
          style={{ display: 'block', textAlign: 'center', border: 'none', background: SN.accent, color: SN.accentText, borderRadius: SN.btnR, padding: '9px', fontSize: 13, fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}
        >
          View school →
        </Link>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FavouritesPage() {
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    setFavIds(readFavs());
  }, []);

  const schools: School[] = SCHOOLS.filter((s) => favIds.includes(s.id));

  const handleRemove = (id: string) => {
    setFavIds(removeFav(id));
  };

  const handleClearAll = () => {
    localStorage.setItem(LS_KEY, '[]');
    setFavIds([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: SN.bg, fontFamily: SN.font }}>
      <SNNav />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Heading row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: SN.ink, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#EF4444' }}>♥</span>
            Saved schools
            <span style={{ fontSize: 16, color: SN.ink3, fontWeight: 600 }}>({schools.length})</span>
          </h1>
          {schools.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{ border: 'none', background: 'none', color: '#EF4444', fontFamily: SN.font, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {schools.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>🏫</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: SN.ink }}>No saved schools yet</h2>
            <p style={{ margin: 0, fontSize: 14.5, color: SN.ink2, fontWeight: 500, maxWidth: 300, lineHeight: 1.6, textAlign: 'center' }}>
              Tap ♥ on any school card to save it here for later.
            </p>
            <Link
              href="/find"
              style={{ display: 'inline-block', border: `2px solid ${SN.accent}`, background: 'transparent', color: SN.accent, borderRadius: SN.btnR, padding: '10px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', marginTop: 8 }}
            >
              Find schools
            </Link>
          </div>
        )}

        {/* Grid */}
        {schools.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
            {schools.map((s) => (
              <FavCard key={s.id} school={s} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
