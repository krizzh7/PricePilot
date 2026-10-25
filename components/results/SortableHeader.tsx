'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
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

  return (
    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 rounded-lg px-1.5 py-0.5 -ml-1.5"
        aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <span>{label}</span>
        {isActive ? (
          direction === 'asc' ? (
            <ChevronUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" aria-hidden="true" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}
