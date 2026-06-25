'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SN } from '@/lib/tokens';
import type { School } from '@/lib/data';

const SCHOOL_TYPES = ['All types', 'Nursery', 'Primary', 'Secondary', 'Boarding', 'Day'];

export function HomeHero({ carousel }: { carousel: School[] }) {
  const [slide, setSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % carousel.length), 3500);
    return () => clearInterval(t);
  }, [carousel.length]);

  const school = carousel[slide];
  if (!school) return null;

  return (
    <div style={{ position: 'relative', height: 420, overflow: 'hidden', margin: 0 }}>
      {carousel.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: 'absolute', inset: 0,
            transition: 'opacity 1.4s cubic-bezier(.4,0,.2,1)',
            opacity: i === slide ? 1 : 0,
            pointerEvents: i === slide ? 'auto' : 'none',
            background: `linear-gradient(135deg,${s.color} 0%,${s.color}dd 40%,${s.color}88 100%)`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0,rgba(255,255,255,.03) 1px,transparent 1px,transparent 50px)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 60px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.65)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                Featured school · {s.city}
              </div>
              <h2 style={{ margin: '0 0 6px', fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{s.name}</h2>
              <p style={{ margin: '0 0 14px', fontSize: 17, color: 'rgba(255,255,255,.8)', fontWeight: 500 }}>{s.tagline}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {([s.levels, s.type, s.orientation, s.transport ? 'Transport' : null] as (string | null)[]).filter(Boolean).map((tag) => (
                  <span key={tag!} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,.2)', borderRadius: 7, padding: '5px 12px', border: '1px solid rgba(255,255,255,.3)' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 22 }}>
                <span style={{ color: '#F59E0B' }}>{'★'.repeat(Math.floor(s.rating))}</span>
                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, fontWeight: 600 }}>{s.reviews} reviews</span>
                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, fontWeight: 600 }}>{s.students} students</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => router.push(`/schools/${s.id}`)}
                  style={{ border: 'none', background: '#fff', color: s.color, borderRadius: SN.btnR, padding: '12px 28px', fontFamily: SN.font, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
                >
                  View profile →
                </button>
                <button
                  onClick={() => router.push(`/schools/${s.id}#enquire`)}
                  style={{ border: '2px solid rgba(255,255,255,.5)', background: 'transparent', color: '#fff', borderRadius: SN.btnR, padding: '12px 24px', fontFamily: SN.font, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                >
                  Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 7 }}>
        {carousel.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{ width: i === slide ? 22 : 7, height: 7, borderRadius: 4, border: 'none', background: i === slide ? '#fff' : 'rgba(255,255,255,.4)', cursor: 'pointer', padding: 0, transition: 'all .3s' }}
          />
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={() => setSlide((s) => (s - 1 + carousel.length) % carousel.length)}
        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,.2)', color: '#fff', width: 40, height: 40, borderRadius: '50%', fontSize: 18, cursor: 'pointer' }}
      >‹</button>
      <button
        onClick={() => setSlide((s) => (s + 1) % carousel.length)}
        style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'rgba(255,255,255,.2)', color: '#fff', width: 40, height: 40, borderRadius: '50%', fontSize: 18, cursor: 'pointer' }}
      >›</button>
    </div>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All types');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (type !== 'All types') params.set('type', type);
    router.push(`/find?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', borderRadius: SN.btnR, padding: '10px 18px',
        border: `1.5px solid ${SN.line}`, boxShadow: SN.shadow, minWidth: 280,
      }}>
        <span style={{ color: SN.ink3 }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="School name or city…"
          style={{ flex: 1, border: 'none', outline: 'none', fontFamily: SN.font, fontSize: 14, fontWeight: 500, color: SN.ink, background: 'transparent' }}
        />
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ border: `1.5px solid ${SN.line}`, borderRadius: SN.btnR, padding: '10px 16px', fontFamily: SN.font, fontSize: 14, fontWeight: 600, color: SN.ink, background: '#fff', cursor: 'pointer', outline: 'none', boxShadow: SN.shadow }}
      >
        {SCHOOL_TYPES.map((t) => <option key={t}>{t}</option>)}
      </select>
      <button
        onClick={handleSearch}
        style={{ background: SN.accent, color: '#fff', border: 'none', borderRadius: SN.btnR, padding: '10px 26px', fontFamily: SN.font, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
      >
        Search
      </button>
    </div>
  );
}
