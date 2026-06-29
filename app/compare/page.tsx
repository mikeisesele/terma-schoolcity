'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SCCompareModal } from '@/components/ui';

export default function ComparePage() {
  const router = useRouter();
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    try { const c = localStorage.getItem('sc_compare'); if (c) setCompareIds(JSON.parse(c)); } catch {}
  }, []);

  const onRemove = (id: string) => {
    const next = compareIds.filter(x => x !== id);
    setCompareIds(next);
    try { localStorage.setItem('sc_compare', JSON.stringify(next)); } catch {}
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB' }}>
      <SCCompareModal
        compareIds={compareIds}
        onClose={() => router.back()}
        onRemove={onRemove}
        onSelect={s => router.push('/schools/' + s.id)}
      />
    </div>
  );
}
