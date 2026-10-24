'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AutocompleteDropdownProps {
  suggestions: string[];
  highlightedIndex: number;
  onSelect: (suggestion: string) => void;
  onHighlight: (index: number) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function AutocompleteDropdown({ suggestions, highlightedIndex, onSelect, onHighlight }: AutocompleteDropdownProps) {
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!dropdownRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.from(dropdownRef.current, { opacity: 0, y: -6, duration: 0.15, ease: 'power2.out' });
    }, dropdownRef);
    return () => context.revert();
  }, []);

  if (!suggestions.length) return null;

  return (
    <ul
      id="product-suggestions"
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto border border-slate-200 bg-white py-1 shadow-lg"
      role="listbox"
      aria-label="Product suggestions"
    >
      {suggestions.slice(0, 8).map((suggestion, index) => (
        <li
          key={suggestion}
          id={`suggestion-${index}`}
          role="option"
          aria-selected={index === highlightedIndex}
          className={`cursor-pointer px-4 py-3 text-sm transition-colors ${index === highlightedIndex ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'}`}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => onHighlight(index)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
}
