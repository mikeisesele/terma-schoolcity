'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SNNav } from '@/components/ui';
import { Stars, VerifiedBadge } from '@/components/ui';
import { SN } from '@/lib/tokens';
import { SCHOOLS, naira, type School } from '@/lib/data';

// ── Filter constants ──────────────────────────────────────────────────────────
const TYPES = ['All', 'Primary', 'Secondary', 'All-through'] as const;
const GENDERS = ['All', 'Mixed', 'Boys', 'Girls'] as const;
const BOARDING_OPTS = ['All', 'Day', 'Boarding'] as const;
const PLANS = ['All', 'Free', 'Standard', 'Premium'] as const;
const SORTS = [
  { value: 'rating', label: 'Rating' },
  { value: 'fee', label: 'Fee low–high' },
  { value: 'new', label: 'Newest' },
] as const;

type SortVal = 'rating' | 'fee' | 'new';

// Derive unique cities and states from SCHOOLS data
const CITIES = Array.from(new Set(SCHOOLS.map((s) => s.city))).sort();
const STATES = Array.from(new Set(SCHOOLS.map((s) => s.state))).sort();

// ── SNCard ────────────────────────────────────────────────────────────────────
function SNCard({ school }: { school: School }) {
  const { id, name, city, state, type, boarding, gender, rating, reviews, feeFrom, hue, badge, scholarships, specialNeeds, levels } = school;
  return (
    <Link
      href={`/schools/${id}`}
      style={{
        display: 'block',
        background: SN.cardBg,
        borderRadius: SN.cardR,
        border: `1px solid ${SN.line}`,
        boxShadow: SN.shadow,
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'box-shadow .18s, transform .18s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = SN.shadowHover;
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = SN.shadow;
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Hero band */}
      <div style={{
        height: 120,
        background: `linear-gradient(135deg, hsl(${hue} 38% 52%), hsl(${(hue + 20) % 360} 42% 38%))`,
        position: 'relative',
      }}>
        {badge && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <VerifiedBadge level={badge} />
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.85)',
          background: 'rgba(0,0,0,.22)', borderRadius: 6, padding: '3px 8px',
        }}>
          {levels}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontWeight: 800, fontSize: 15.5, color: SN.ink, lineHeight: 1.25, marginBottom: 3 }}>{name}</div>
        <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600, marginBottom: 8 }}>
          {city}, {state} · {type} · {boarding ? 'Boarding' : 'Day'}
          {gender !== 'Mixed' && ` · ${gender}`}
        </div>
        <Stars rating={rating} reviews={reviews} />
        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', margin: '8px 0 10px' }}>
          {scholarships.length > 0 && <Chip>Scholarships</Chip>}
          {specialNeeds && <Chip>Special-needs</Chip>}
        </div>
        <div style={{ fontSize: 13, color: SN.ink2, fontWeight: 600 }}>
          From <strong style={{ color: SN.ink }}>{naira(feeFrom)}</strong>/term
        </div>
      </div>
    </Link>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: SN.accentLight, color: SN.accent,
      padding: '3px 9px', borderRadius: SN.pill,
      fontSize: 11.5, fontWeight: 700,
    }}>{children}</span>
  );
}

// ── Pill button ───────────────────────────────────────────────────────────────
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none', cursor: 'pointer',
        fontFamily: SN.font, fontWeight: 700, fontSize: 13,
        padding: '7px 14px', borderRadius: SN.pill,
        background: active ? SN.accent : SN.accentLight,
        color: active ? '#fff' : SN.ink2,
        transition: 'background .12s, color .12s',
        whiteSpace: 'nowrap',
      }}
    >{children}</button>
  );
}

// ── Active filter chip ────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: SN.goldLight, color: '#7A5010',
      padding: '4px 10px', borderRadius: SN.pill,
      fontSize: 12.5, fontWeight: 700,
    }}>
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#7A5010', padding: 0, lineHeight: 1, fontSize: 14, fontWeight: 800,
        }}
      >×</button>
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FindPage() {
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [city, setCity] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [type, setType] = useState<string>('All');
  const [gender, setGender] = useState<string>('All');
  const [boarding, setBoarding] = useState<string>('All');
  const [plan, setPlan] = useState<string>('All');
  const [sort, setSort] = useState<SortVal>('rating');

  const results = useMemo(() => {
    let r = SCHOOLS.filter((s) => {
      const mq = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.city.toLowerCase().includes(q.toLowerCase());
      const mCity = !city || s.city === city;
      const mState = !stateFilter || s.state === stateFilter;
      const mType = type === 'All' || (() => {
        if (type === 'Primary') return s.levels.toLowerCase().includes('primary') || s.levels.toLowerCase().includes('nursery');
        if (type === 'Secondary') return s.levels.toLowerCase().includes('jss') || s.levels.toLowerCase().includes('sss') || s.levels.toLowerCase().includes('secondary');
        if (type === 'All-through') return (s.levels.toLowerCase().includes('nursery') || s.levels.toLowerCase().includes('primary')) && (s.levels.toLowerCase().includes('jss') || s.levels.toLowerCase().includes('sss'));
        return true;
      })();
      const mGender = gender === 'All' || s.gender === gender;
      const mBoarding = boarding === 'All' || (boarding === 'Boarding' ? s.boarding : !s.boarding);
      const mPlan = plan === 'All' || (() => {
        if (plan === 'Free') return !s.ktPlan;
        if (plan === 'Standard') return s.ktPlan === 'Standard';
        if (plan === 'Premium') return s.ktPlan === 'Premium';
        return true;
      })();
      return mq && mCity && mState && mType && mGender && mBoarding && mPlan;
    });

    r = [...r].sort((a, b) =>
      sort === 'fee' ? a.feeFrom - b.feeFrom :
      sort === 'new' ? b.established - a.established :
      b.rating - a.rating
    );
    return r;
  }, [q, city, stateFilter, type, gender, boarding, plan, sort]);

  // Build active filter chips
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (q) activeFilters.push({ label: `"${q}"`, clear: () => { setQ(''); setSearchInput(''); } });
  if (city) activeFilters.push({ label: `City: ${city}`, clear: () => setCity('') });
  if (stateFilter) activeFilters.push({ label: `State: ${stateFilter}`, clear: () => setStateFilter('') });
  if (type !== 'All') activeFilters.push({ label: `Type: ${type}`, clear: () => setType('All') });
  if (gender !== 'All') activeFilters.push({ label: `Gender: ${gender}`, clear: () => setGender('All') });
  if (boarding !== 'All') activeFilters.push({ label: `Boarding: ${boarding}`, clear: () => setBoarding('All') });
  if (plan !== 'All') activeFilters.push({ label: `Plan: ${plan}`, clear: () => setPlan('All') });

  return (
    <div style={{ minHeight: '100vh', background: SN.bg, fontFamily: SN.font }}>
      <SNNav />

      {/* Hero + search ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1A3D2C 0%, #0A4B48 100%)',
        padding: '48px 40px 36px',
      }}>
        <h1 style={{
          margin: '0 0 6px', fontSize: 32, fontWeight: 900,
          color: '#fff', textAlign: 'center', fontFamily: SN.head,
        }}>
          Find a school
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 16, color: 'rgba(255,255,255,.75)', textAlign: 'center', fontWeight: 500 }}>
          Search across verified schools in Nigeria
        </p>

        {/* Search bar */}
        <div style={{
          maxWidth: 680, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff', borderRadius: 14, padding: '10px 14px 10px 18px',
          boxShadow: '0 8px 32px rgba(0,0,0,.18)',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔍</span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setQ(searchInput); }}
            placeholder="School name, area or city…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: SN.font, fontSize: 16, fontWeight: 500, color: '#111827',
              background: 'transparent',
            }}
          />
          <button
            onClick={() => setQ(searchInput)}
            style={{
              border: 'none', background: SN.accent, color: '#fff',
              borderRadius: 10, padding: '10px 22px',
              fontFamily: SN.font, fontSize: 14, fontWeight: 800,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters + results ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '32px auto 60px', padding: '0 24px' }}>

        {/* Filter row */}
        <div style={{
          background: '#fff', border: `1px solid ${SN.line}`,
          borderRadius: SN.cardR, padding: '18px 22px',
          marginBottom: 20, boxShadow: SN.shadow,
        }}>
          {/* City / State selects */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={selectStyle}
              aria-label="Filter by city"
            >
              <option value="">All cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={selectStyle}
              aria-label="Filter by state"
            >
              <option value="">All states</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Pill filter rows */}
          <FilterRow label="Type">
            {TYPES.map((t) => <Pill key={t} active={type === t} onClick={() => setType(t)}>{t}</Pill>)}
          </FilterRow>
          <FilterRow label="Gender">
            {GENDERS.map((g) => <Pill key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Pill>)}
          </FilterRow>
          <FilterRow label="Boarding">
            {BOARDING_OPTS.map((b) => <Pill key={b} active={boarding === b} onClick={() => setBoarding(b)}>{b}</Pill>)}
          </FilterRow>
          <FilterRow label="KidTrack plan">
            {PLANS.map((p) => <Pill key={p} active={plan === p} onClick={() => setPlan(p)}>{p}</Pill>)}
          </FilterRow>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: SN.ink3 }}>Active:</span>
            {activeFilters.map((f) => (
              <FilterChip key={f.label} label={f.label} onRemove={f.clear} />
            ))}
            <button
              onClick={() => {
                setQ(''); setSearchInput(''); setCity(''); setStateFilter('');
                setType('All'); setGender('All'); setBoarding('All'); setPlan('All');
              }}
              style={{
                border: 'none', background: 'transparent', color: SN.accent,
                fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: SN.font,
                padding: '4px 6px',
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results header: count + sort */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 10, marginBottom: 20,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            background: SN.accentLight, color: SN.accent,
            fontWeight: 800, fontSize: 13.5,
            padding: '5px 14px', borderRadius: SN.pill,
          }}>
            {results.length} school{results.length !== 1 ? 's' : ''} found
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: SN.ink3 }}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortVal)}
              style={{ ...selectStyle, padding: '8px 12px' }}
            >
              {SORTS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid / empty state */}
        {results.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '72px 20px',
            color: SN.ink3, fontWeight: 600, fontSize: 15,
            background: '#fff', borderRadius: SN.cardR,
            border: `1px solid ${SN.line}`,
          }}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>🏫</div>
            No schools match your filters. Try broadening your search.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 18,
          }}
            className="sn-find-grid"
          >
            {results.map((s) => <SNCard key={s.id} school={s} />)}
          </div>
        )}
      </div>

      {/* Responsive grid breakpoints via a style tag */}
      <style>{`
        @media (max-width: 1024px) { .sn-find-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .sn-find-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
      <span style={{
        fontSize: 11.5, fontWeight: 800, color: SN.ink3,
        textTransform: 'uppercase', letterSpacing: 0.5,
        minWidth: 90, flexShrink: 0,
      }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  border: `1.5px solid ${SN.line}`,
  borderRadius: 10,
  padding: '9px 12px',
  fontFamily: SN.font,
  fontSize: 13.5,
  fontWeight: 600,
  color: SN.ink,
  background: '#fff',
  outline: 'none',
  cursor: 'pointer',
};
