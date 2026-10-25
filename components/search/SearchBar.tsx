'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
      inputRef.current?.blur();
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

  const clearInput = () => {
    setQuery('');
    setError('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
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
      {/* Outer container with glowing focus ring */}
      <div className="group relative flex items-center rounded-2xl border border-border/80 bg-card p-1.5 shadow-lg shadow-black/5 ring-1 ring-border/50 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:shadow-xl focus-within:shadow-emerald-500/10 hover:border-border hover:shadow-xl hover:shadow-black/5">
        <div className="pointer-events-none pl-3.5 pr-1 text-muted-foreground transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
          <Search className="h-5 w-5" aria-hidden="true" />
        </div>

        <input
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
          placeholder="Search products, e.g. Lenovo Legion, AirPods Pro..."
          className="h-12 w-full bg-transparent px-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-base"
          autoComplete="off"
          spellCheck={false}
          maxLength={200}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="product-suggestions"
          aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="mr-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Clear search input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Compare / Search Button */}
        <Button
          type="submit"
          size="md"
          disabled={isLoading}
          className="btn-tactile h-11 shrink-0 rounded-xl px-5 text-sm font-semibold shadow-sm"
          aria-label="Search prices"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              <span>Compare</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>

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

      {error && (
        <p className="mt-2 text-left text-xs font-medium text-destructive px-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
