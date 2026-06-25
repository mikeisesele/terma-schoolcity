'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SNCompareModal } from '@/components/ui';

export default function ComparePage() {
  const router = useRouter();
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    try { const c = localStorage.getItem('sn_compare'); if (c) setCompareIds(JSON.parse(c)); } catch {}
  }, []);

  const onRemove = (id: string) => {
    const next = compareIds.filter(x => x !== id);
    setCompareIds(next);
    try { localStorage.setItem('sn_compare', JSON.stringify(next)); } catch {}
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB' }}>
      <SNCompareModal
        compareIds={compareIds}
        onClose={() => router.back()}
        onRemove={onRemove}
        onSelect={s => router.push('/schools/' + s.id)}
      />
    </div>
  );
}
