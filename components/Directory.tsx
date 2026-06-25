'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SN } from '@/lib/tokens';
import { naira, type School } from '@/lib/data';
import { Stars, VerifiedBadge, SNCard } from './ui';

// ── Filter option types ───────────────────────────────────────────────────────
type SchoolType = 'All' | 'Primary' | 'Secondary' | 'All-through';
type GenderFilter = 'All' | 'Mixed' | 'Boys' | 'Girls';
type BoardingFilter = 'All' | 'Day' | 'Boarding' | 'Day & Boarding';
type SortKey = 'rating' | 'fee-asc' | 'newest';

const TYPES: SchoolType[] = ['All', 'Primary', 'Secondary', 'All-through'];
const GENDERS: GenderFilter[] = ['All', 'Mixed', 'Boys', 'Girls'];
const BOARDING: BoardingFilter[] = ['All', 'Day', 'Boarding', 'Day & Boarding'];
const SORTS: { label: string; value: SortKey }[] = [
  { label: 'Rating', value: 'rating' },
  { label: 'Fee: Low to High', value: 'fee-asc' },
  { label: 'Newest', value: 'newest' },
];

// Map display filter → school field values
const GENDER_MAP: Record<GenderFilter, string[]> = {
  All: [],
  Mixed: ['Mixed', 'Co-ed'],
  Boys: ['Boys'],
  Girls: ['Girls'],
};

const PAGE_SIZE = 9;

// ── Pill button helper ────────────────────────────────────────────────────────
function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? 'none' : `1.5px solid ${SN.line}`,
        cursor: 'pointer',
        fontFamily: SN.font,
        fontWeight: 700,
        fontSize: 13,
        padding: '8px 16px',
        borderRadius: SN.pill,
        background: active ? SN.accent : SN.cardBg,
        color: active ? '#FAF7F0' : SN.ink2,
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  );
}

// ── Active filter chip ────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: SN.accentLight,
        color: SN.accent,
        borderRadius: SN.pill,
        padding: '5px 12px 5px 14px',
        fontSize: 12.5,
        fontWeight: 700,
        fontFamily: SN.font,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: SN.accent,
          padding: 0,
          lineHeight: 1,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        ×
      </button>
    </span>
  );
}

// ── Directory ─────────────────────────────────────────────────────────────────
export function Directory({ schools }: { schools: School[] }) {
  const [type, setType] = useState<SchoolType>('All');
  const [gender, setGender] = useState<GenderFilter>('All');
  const [boarding, setBoarding] = useState<BoardingFilter>('All');
  const [sort, setSort] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = schools.filter((s) => {
      // Type filter — maps to school.levels (Primary contains "Primary", Secondary contains JSS/SSS)
      if (type !== 'All') {
        if (type === 'Primary' && !s.levels.toLowerCase().includes('primary')) return false;
        if (type === 'Secondary' && !(s.levels.includes('JSS') || s.levels.includes('SSS') || s.levels.toLowerCase().includes('secondary'))) return false;
        if (type === 'All-through' && !(s.levels.includes('Nursery') || s.levels.includes('Primary')) && !(s.levels.includes('JSS') || s.levels.includes('SSS'))) return false;
        // All-through: must span both primary and secondary
        if (type === 'All-through') {
          const hasPrimary = s.levels.toLowerCase().includes('primary') || s.levels.includes('Nursery');
          const hasSecondary = s.levels.includes('JSS') || s.levels.includes('SSS');
          if (!hasPrimary || !hasSecondary) return false;
        }
      }
      // Gender filter
      if (gender !== 'All') {
        const allowed = GENDER_MAP[gender];
        if (!allowed.some((g) => s.gender.toLowerCase().includes(g.toLowerCase()))) return false;
      }
      // Boarding filter
      if (boarding !== 'All') {
        if (boarding === 'Day' && s.type !== 'Day') return false;
        if (boarding === 'Boarding' && !s.boarding) return false;
        if (boarding === 'Day & Boarding' && s.type !== 'Day & Boarding') return false;
      }
      return true;
    });

    // Sort
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === 'fee-asc') list = [...list].sort((a, b) => a.feeFrom - b.feeFrom);
    else if (sort === 'newest') list = [...list].sort((a, b) => b.established - a.established);

    return list;
  }, [schools, type, gender, boarding, sort]);

  const shown = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < filtered.length;

  // Build active filter chips
  const activeChips: { label: string; clear: () => void }[] = [];
  if (type !== 'All') activeChips.push({ label: type, clear: () => { setType('All'); setPage(1); } });
  if (gender !== 'All') activeChips.push({ label: gender, clear: () => { setGender('All'); setPage(1); } });
  if (boarding !== 'All') activeChips.push({ label: boarding, clear: () => { setBoarding('All'); setPage(1); } });

  function resetFilters() {
    setType('All');
    setGender('All');
    setBoarding('All');
    setPage(1);
  }

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          background: SN.cardBg,
          border: `1px solid ${SN.line}`,
          borderRadius: SN.cardR,
          padding: '20px 22px',
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 14,
        }}
      >
        {/* Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.ink3, fontFamily: SN.font, minWidth: 64 }}>Type</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {TYPES.map((t) => (
              <Pill key={t} label={t} active={type === t} onClick={() => { setType(t); setPage(1); }} />
            ))}
          </div>
        </div>

        {/* Gender */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.ink3, fontFamily: SN.font, minWidth: 64 }}>Gender</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {GENDERS.map((g) => (
              <Pill key={g} label={g} active={gender === g} onClick={() => { setGender(g); setPage(1); }} />
            ))}
          </div>
        </div>

        {/* Boarding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.ink3, fontFamily: SN.font, minWidth: 64 }}>Boarding</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {BOARDING.map((b) => (
              <Pill key={b} label={b} active={boarding === b} onClick={() => { setBoarding(b); setPage(1); }} />
            ))}
          </div>
        </div>

        {/* Sort + active chips row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const, paddingTop: 4, borderTop: `1px solid ${SN.line}` }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.ink3, fontFamily: SN.font }}>Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            style={{
              border: `1.5px solid ${SN.line}`,
              borderRadius: SN.pill,
              padding: '7px 14px',
              fontFamily: SN.font,
              fontSize: 13,
              fontWeight: 700,
              color: SN.ink,
              background: SN.cardBg,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active chips + results count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          flexWrap: 'wrap' as const,
        }}
      >
        <span style={{ fontSize: 13.5, fontWeight: 700, color: SN.ink2, fontFamily: SN.font }}>
          {filtered.length} {filtered.length === 1 ? 'school' : 'schools'}
        </span>
        {activeChips.map((chip) => (
          <FilterChip key={chip.label} label={chip.label} onRemove={chip.clear} />
        ))}
        {activeChips.length > 1 && (
          <button
            onClick={resetFilters}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 700,
              color: SN.ink3,
              fontFamily: SN.font,
              padding: '4px 8px',
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Grid — 3 cols → 2 cols → 1 col via inline media via CSS class */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: SN.ink3,
            fontFamily: SN.font,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          No schools match your filters. Try adjusting or clearing them.
        </div>
      ) : (
        <>
          <div className="sn-dir-grid">
            {shown.map((s) => (
              <SNCard
                key={s.id}
                school={s}
                isFav={false}
                onToggleFav={() => undefined}
                inCompare={false}
                onToggleCompare={() => undefined}
              />
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button
                onClick={() => setPage((p) => p + 1)}
                style={{
                  border: `1.5px solid ${SN.accent}`,
                  background: SN.cardBg,
                  color: SN.accent,
                  borderRadius: SN.pill,
                  padding: '13px 36px',
                  fontFamily: SN.font,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Load more ({filtered.length - shown.length} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Responsive grid styles injected via style tag */}
      <style>{`
        .sn-dir-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .sn-dir-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .sn-dir-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
