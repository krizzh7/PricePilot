'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, ArrowUpRight } from 'lucide-react';

interface AutocompleteDropdownProps {
  suggestions: string[];
  highlightedIndex: number;
  onSelect: (suggestion: string) => void;
  onHighlight: (index: number) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function AutocompleteDropdown({
  suggestions,
  highlightedIndex,
  onSelect,
  onHighlight,
}: AutocompleteDropdownProps) {
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!dropdownRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -4, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' }
      );
    }, dropdownRef);
    return () => context.revert();
  }, []);

  if (!suggestions.length) return null;

  return (
    <ul
      id="product-suggestions"
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5"
      role="listbox"
      aria-label="Product suggestions"
    >
      <li
        role="presentation"
        className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Popular Products
      </li>
      {suggestions.slice(0, 8).map((suggestion, index) => {
        const isSelected = index === highlightedIndex;
        return (
          <li
            key={suggestion}
            id={`suggestion-${index}`}
            role="option"
            aria-selected={isSelected}
            className={`group flex items-center justify-between gap-3 cursor-pointer rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 ${
              isSelected
                ? 'bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-medium'
                : 'text-foreground hover:bg-muted/70'
            }`}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={() => onHighlight(index)}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                }`}
              />
              <span className="truncate">{suggestion}</span>
            </div>
            <ArrowUpRight
              className={`h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                isSelected ? 'opacity-100 text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
              }`}
            />
          </li>
        );
      })}
    </ul>
  );
}
