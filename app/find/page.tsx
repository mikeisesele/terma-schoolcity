import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SNNav, SHead } from '@/components/ui';
import { FindClient } from '@/components/FindClient';
import { SCHOOLS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Find a school',
  description: 'Filter verified Nigerian private schools by type, gender, boarding, fees, scholarships and special-needs support. Shareable search.',
};

export default function FindPage() {
  return (
    <>
      <SNNav />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 80px' }}>
        <SHead eyebrow="Find a school" title="Search verified schools" sub="Filter by what matters to your family. Every search is shareable." />
        <Suspense fallback={<div style={{ padding: 40, color: '#888' }}>Loading filters…</div>}>
          <FindClient schools={SCHOOLS} />
        </Suspense>
      </main>
    </>
  );
}
