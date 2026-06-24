'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div>
        <p style={{ color: '#3A5848', fontWeight: 700 }}>Something went wrong loading this page.</p>
        <button onClick={reset} style={{ marginTop: 10, background: '#3D7058', color: '#fff', border: 'none', borderRadius: 9999, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
      </div>
    </div>
  );
}
