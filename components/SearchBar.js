import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

// Highlight matching text in a string
function HighlightMatch({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 text-black font-bold rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced fetch
  const fetchSuggestions = useCallback(async (value) => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=7`);
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    // Debounce API calls (300ms)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(`/perfume/${suggestions[activeIndex].id}`);
    } else if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (perfume) => {
    router.push(`/perfume/${perfume.id}`);
    setShowSuggestions(false);
    setQuery('');
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0 && query.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="w-full max-w-2xl relative" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative" role="search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by fragrance name, brand, or note..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 focus:border-accent focus:outline-none transition-colors bg-white"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-8 bg-accent text-white font-serif text-lg hover:bg-yellow-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showSuggestions && (
        <div
          className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 border-t-0 shadow-lg z-50 max-h-96 overflow-y-auto"
          role="listbox"
        >
          {loading && suggestions.length === 0 && (
            <div className="px-6 py-4 text-gray-400 text-sm flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="px-6 py-4 text-gray-400 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {suggestions.map((perfume, idx) => (
            <button
              key={perfume.id || idx}
              id={`suggestion-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              onClick={() => handleSuggestionClick(perfume)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`w-full text-left px-6 py-3 border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-4 ${
                idx === activeIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-serif font-semibold text-gray-900 truncate">
                  <HighlightMatch text={perfume.name} query={query} />
                </div>
                <div className="text-sm text-gray-500 truncate">
                  <HighlightMatch text={perfume.brand} query={query} />
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}

          {suggestions.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full text-center px-6 py-3 text-sm text-accent hover:bg-gray-50 transition-colors font-medium border-t border-gray-200"
            >
              See all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
