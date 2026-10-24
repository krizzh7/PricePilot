'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { autocompleteCatalog } from '@/data/autocomplete-catalog';
import { AutocompleteDropdown } from './AutocompleteDropdown';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ initialQuery = '', onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const filterSuggestions = useCallback((value: string) => {
    const normalized = value.trim().toLocaleLowerCase();
    if (normalized.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const matches = autocompleteCatalog
      .filter((product) => product.toLocaleLowerCase().includes(normalized))
      .slice(0, 8);
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => filterSuggestions(query), 150);
    return () => window.clearTimeout(timeout);
  }, [filterSuggestions, query]);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointer);
    return () => document.removeEventListener('pointerdown', handleOutsidePointer);
  }, []);

  const submitSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please enter a product name');
      inputRef.current?.focus();
      return;
    }
    setError('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onSearch(trimmed.slice(0, 200));
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    submitSearch(suggestion);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
      return;
    }
    if (!showDropdown || suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => (index - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    }
  };

  return (
    <form
      ref={wrapperRef}
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch(query);
      }}
      className="relative mx-auto w-full"
      role="search"
      noValidate
    >
      <div className="flex items-stretch gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setError('');
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search a product, like Lenovo Legion"
            className="h-14 rounded-md pl-12 pr-4 text-base shadow-sm sm:text-lg"
            error={error}
            autoComplete="off"
            spellCheck={false}
            maxLength={200}
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls="product-suggestions"
            aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
          />
          {showDropdown && (
            <AutocompleteDropdown
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onSelect={selectSuggestion}
              onHighlight={setHighlightedIndex}
              onClose={() => setShowDropdown(false)}
              inputRef={inputRef}
            />
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-14 shrink-0 rounded-md px-4 sm:px-6"
          aria-label="Search products"
        >
          {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-5 w-5" aria-hidden="true" />}
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  );
}
