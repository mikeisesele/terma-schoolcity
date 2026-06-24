'use client';
import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SN } from '@/lib/tokens';
import { naira, type School } from '@/lib/data';
import { Stars, VerifiedBadge } from './ui';

// All filter state lives in the URL → every search is shareable/bookmarkable and SSR-friendly.
const TYPES = ['Any', 'All-through', 'Secondary', 'Primary'];
const GENDERS = ['Any', 'Mixed', 'Boys', 'Girls'];
const BOARDING = ['Any', 'Day', 'Boarding', 'Day & Boarding'];
const FEES: [string, number][] = [['Any', 0], ['≤ ₦50k', 5_000_000], ['≤ ₦100k', 10_000_000], ['≤ ₦200k', 20_000_000], ['≤ ₦500k', 50_000_000]];
const SORTS: [string, string][] = [['rating', 'Top rated'], ['fee', 'Lowest fees'], ['name', 'Name A–Z'], ['new', 'Newest']];

export function FindClient({ schools }: { schools: School[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const get = (k: string, d = '') => sp.get(k) ?? d;

  const set = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '' || v === 'Any' || v === '0') next.delete(k); else next.set(k, v);
    }
    router.replace(`/find?${next.toString()}`, { scroll: false });
  }, [router, sp]);

  const q = get('q'), type = get('type', 'Any'), gender = get('gender', 'Any'),
    boarding = get('boarding', 'Any'), maxFee = Number(get('fee', '0')),
    scholarships = get('scholarships') === '1', special = get('special') === '1', sort = get('sort', 'rating');

  const rows = useMemo(() => {
    let r = schools.filter((s) =>
      (type === 'Any' || s.type === type) &&
      (gender === 'Any' || s.gender === gender) &&
      (boarding === 'Any' || s.boarding === boarding) &&
      (!maxFee || s.feeFromKobo <= maxFee) &&
      (!scholarships || s.scholarships.length > 0) &&
      (!special || s.specialNeeds) &&
      (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.location.toLowerCase().includes(q.toLowerCase())));
    r = [...r].sort((a, b) =>
      sort === 'fee' ? a.feeFromKobo - b.feeFromKobo :
      sort === 'name' ? a.name.localeCompare(b.name) :
      sort === 'new' ? b.established - a.established :
      b.rating - a.rating);
    return r;
  }, [schools, q, type, gender, boarding, maxFee, scholarships, special, sort]);

  const activeCount = [type !== 'Any', gender !== 'Any', boarding !== 'Any', !!maxFee, scholarships, special, !!q].filter(Boolean).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>
      <aside style={{ position: 'sticky', top: 24, background: '#fff', border: `1px solid ${SN.line}`, borderRadius: SN.cardR, boxShadow: SN.shadow, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: SN.ink }}>Filters</span>
          {activeCount > 0 && <button onClick={() => router.replace('/find', { scroll: false })} style={clearBtn}>Clear ({activeCount})</button>}
        </div>
        <input value={q} onChange={(e) => set({ q: e.target.value })} placeholder="Name or location…" style={input} />
        <Group label="School type" opts={TYPES} value={type} onPick={(v) => set({ type: v })} />
        <Group label="Gender" opts={GENDERS} value={gender} onPick={(v) => set({ gender: v })} />
        <Group label="Boarding" opts={BOARDING} value={boarding} onPick={(v) => set({ boarding: v })} />
        <Group label="Max fee / term" opts={FEES.map(([l]) => l)} value={FEES.find(([, v]) => v === maxFee)?.[0] ?? 'Any'} onPick={(l) => set({ fee: String(FEES.find(([lab]) => lab === l)?.[1] ?? 0) })} />
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Toggle label="Offers scholarships" on={scholarships} onClick={() => set({ scholarships: scholarships ? null : '1' })} />
          <Toggle label="Special-needs friendly" on={special} onClick={() => set({ special: special ? null : '1' })} />
        </div>
      </aside>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: SN.ink2 }}>{rows.length} school{rows.length === 1 ? '' : 's'} found</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: SN.ink3, fontWeight: 700 }}>Sort</span>
            <select value={sort} onChange={(e) => set({ sort: e.target.value === 'rating' ? null : e.target.value })} style={{ ...input, width: 'auto', marginBottom: 0, padding: '8px 12px', cursor: 'pointer' }}>
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: SN.ink3, fontWeight: 600 }}>No schools match these filters. Try widening them.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            {rows.map((s) => (
              <Link key={s.id} href={`/schools/${s.id}`} style={{ background: SN.cardBg, borderRadius: SN.cardR, border: `1px solid ${SN.line}`, boxShadow: SN.shadow, overflow: 'hidden', display: 'block' }}>
                <div style={{ height: 120, background: `linear-gradient(135deg, hsl(${s.hue} 38% 52%), hsl(${s.hue + 20} 42% 38%))`, position: 'relative' }}>
                  {s.badge && <div style={{ position: 'absolute', top: 12, left: 12 }}><VerifiedBadge level={s.badge} /></div>}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: SN.ink, lineHeight: 1.25 }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: SN.ink3, fontWeight: 600, marginTop: 3 }}>{s.location} · {s.type} · {s.boarding}</div>
                  <div style={{ margin: '10px 0' }}><Stars rating={s.rating} reviews={s.reviews} /></div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {s.scholarships.length > 0 && <Tag>Scholarships</Tag>}
                    {s.specialNeeds && <Tag>Special-needs</Tag>}
                    {s.gender !== 'Mixed' && <Tag>{s.gender}</Tag>}
                  </div>
                  <div style={{ fontSize: 13, color: SN.ink2, fontWeight: 600 }}>From <b style={{ color: SN.ink }}>{naira(s.feeFromKobo)}</b>/term</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Group({ label, opts, value, onPick }: { label: string; opts: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: SN.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {opts.map((o) => (
          <button key={o} onClick={() => onPick(o)} style={{
            border: 'none', cursor: 'pointer', fontFamily: SN.font, fontWeight: 700, fontSize: 12.5, padding: '6px 11px', borderRadius: SN.pill,
            background: value === o ? SN.accent : SN.accentLight, color: value === o ? '#fff' : SN.ink2,
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}
function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: SN.font, padding: 0 }}>
      <span style={{ width: 38, height: 22, borderRadius: 999, background: on ? SN.accent : SN.line, position: 'relative', transition: 'background .15s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
      </span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: SN.ink }}>{label}</span>
    </button>
  );
}
function Tag({ children }: { children: React.ReactNode }) {
  return <span style={{ background: SN.accentLight, color: SN.accent, padding: '3px 9px', borderRadius: SN.pill, fontSize: 11.5, fontWeight: 700 }}>{children}</span>;
}

const input: React.CSSProperties = { width: '100%', border: `1.5px solid ${SN.line}`, borderRadius: 10, padding: '10px 12px', fontFamily: SN.font, fontSize: 14, fontWeight: 500, outline: 'none', background: '#fff', color: SN.ink, marginBottom: 4, boxSizing: 'border-box' };
const clearBtn: React.CSSProperties = { border: 'none', background: 'transparent', color: SN.accent, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: SN.font };
