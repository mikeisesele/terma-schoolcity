import { T } from '@/lib/tokens';

export default function Loading() {
  return <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: T.ink3, fontWeight: 600 }}>Loading…</div>;
}
