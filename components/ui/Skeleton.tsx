'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  variant: 'table-row' | 'card';
  count?: number;
}

export function Skeleton({ variant, count = 5 }: SkeletonProps) {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = variant === 'table-row' ? tableRef : cardRef;
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current!, {
        backgroundPosition: '-200% 0',
        duration: 1.5,
        ease: 'none',
        repeat: -1,
      });
    }, ref);
    return () => ctx.revert();
  }, [variant]);

  if (variant === 'table-row') {
    return (
      <tbody ref={tableRef} className="shimmer">
        {Array.from({ length: count }).map((_, i) => (
          <tr key={i} className="h-16">
            <td className="px-4"><div className="h-4 w-32 rounded bg-slate-200" /></td>
            <td className="px-4"><div className="h-4 w-24 rounded bg-slate-200" /></td>
            <td className="px-4"><div className="h-4 w-32 rounded bg-slate-200" /></td>
            <td className="px-4"><div className="h-4 w-40 rounded bg-slate-200" /></td>
            <td className="px-4"><div className="h-10 w-24 rounded bg-slate-200" /></td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <div ref={cardRef} className="shimmer space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="h-4 w-40 rounded mb-3 bg-slate-200" />
          <div className="h-8 w-32 rounded mb-2 bg-slate-200" />
          <div className="h-4 w-48 rounded mb-2 bg-slate-200" />
          <div className="h-4 w-56 rounded mb-4 bg-slate-200" />
          <div className="h-12 w-full rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}