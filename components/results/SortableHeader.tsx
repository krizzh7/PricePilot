'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import type { SortField, SortDirection } from '@/types/search';

interface SortableHeaderProps {
  field: SortField;
  label: string;
  activeField: SortField;
  activeDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortableHeader({ field, label, activeField, activeDirection, onSort }: SortableHeaderProps) {
  const isActive = activeField === field;
  const direction = isActive ? activeDirection : 'asc';

  const handleClick = () => {
    onSort(field);
  };

  return (
    <th scope="col" className="px-4 py-3 text-left">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
        aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span>{label}</span>
        {isActive ? (
          direction === 'asc' ? (
            <ChevronUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          )
        ) : (
          <div className="flex flex-col gap-0.5">
            <ChevronUp className="w-3 h-3 text-slate-300" aria-hidden="true" />
            <ChevronDown className="w-3 h-3 text-slate-300" aria-hidden="true" />
          </div>
        )}
      </button>
    </th>
  );
}