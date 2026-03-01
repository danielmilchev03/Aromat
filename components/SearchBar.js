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
          <mark key={i} className="bg-accent/15 text-accent font-semibold rounded px-0.5">{part}</mark>
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
    <div className="w-full max-w-2xl mx-auto relative" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative" role="search">
        {/* Search icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by fragrance, brand, or note..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          className="w-full pl-14 pr-32 py-4 text-base bg-white border border-gray-200 rounded-full shadow-soft focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-gold focus:outline-none transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-white font-serif text-sm rounded-full hover:bg-accent-600 transition-all duration-200 hover:shadow-gold"
        >
          Search
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-scale-in">
          <div
            className="bg-white border border-gray-200 rounded-2xl shadow-soft-lg max-h-96 overflow-y-auto"
            role="listbox"
          >
          {loading && suggestions.length === 0 && (
            <div className="px-6 py-4 text-gray-400 text-sm flex items-center gap-3">
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
              className={`w-full text-left px-5 py-3.5 border-b border-gray-50 last:border-b-0 transition-colors flex items-center gap-4 ${
                idx === activeIndex ? 'bg-accent/5' : 'hover:bg-gray-50'
              }`}
            >
              {/* Thumbnail */}
              {perfume.image_url ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={perfume.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 text-xs">✦</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-serif text-sm text-gray-900 truncate">
                  <HighlightMatch text={perfume.name} query={query} />
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">
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
              className="w-full text-center px-6 py-3.5 text-sm text-accent hover:bg-accent/5 transition-colors font-medium border-t border-gray-100 rounded-b-2xl"
            >
              See all results for &ldquo;{query}&rdquo;
            </button>
          )}
          </div>
          {/* Bottom fade overlay when content is scrollable */}
          {suggestions.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/90 to-transparent rounded-b-2xl pointer-events-none" />
          )}
        </div>
      )}
    </div>
  );
}
