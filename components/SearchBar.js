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

const POPULAR_NOTES = [
  'Vanilla', 'Rose', 'Musk', 'Sandalwood', 'Oud', 'Jasmine',
  'Bergamot', 'Cedar', 'Amber', 'Patchouli', 'Lavender', 'Tonka Bean',
];

export default function SearchBar({ initialTab = 'name', initialQuery = '', initialNote = '' }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);

  // --- Name/Brand search state ---
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // --- Notes search state ---
  const [noteQuery, setNoteQuery] = useState(initialNote);
  const [allNotes, setAllNotes] = useState([]);
  const [noteSuggestions, setNoteSuggestions] = useState([]);
  const [showNoteSuggestions, setShowNoteSuggestions] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const noteWrapperRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (noteWrapperRef.current && !noteWrapperRef.current.contains(e.target)) {
        setShowNoteSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Fetch all notes when user switches to notes tab
  useEffect(() => {
    if (activeTab === 'notes' && !notesLoaded) {
      fetchAllNotes();
    }
  }, [activeTab, notesLoaded]);

  const fetchAllNotes = async () => {
    try {
      const response = await fetch('/api/search?type=notes-list');
      const data = await response.json();
      setAllNotes(Array.isArray(data) ? data : []);
      setNotesLoaded(true);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // ==========================================
  // Name/Brand handlers
  // ==========================================
  // Brand matches detected from suggestions
  const [brandMatches, setBrandMatches] = useState([]);

  const fetchSuggestions = useCallback(async (value) => {
    if (value.trim().length < 2) {
      setSuggestions([]);
      setBrandMatches([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=7`);
      const data = await response.json();
      const results = Array.isArray(data) ? data : [];
      setSuggestions(results);

      // Detect unique brands that match the query
      const q = value.toLowerCase().trim();
      const matchedBrands = new Map();
      results.forEach((p) => {
        if (p.brand && p.brand.toLowerCase().includes(q)) {
          if (!matchedBrands.has(p.brand.toLowerCase())) {
            matchedBrands.set(p.brand.toLowerCase(), p.brand);
          }
        }
      });
      setBrandMatches(Array.from(matchedBrands.values()).slice(0, 3));

      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setBrandMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
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

  // ==========================================
  // Notes handlers
  // ==========================================
  const handleNoteInputChange = (e) => {
    const value = e.target.value;
    setNoteQuery(value);
    if (value.trim().length > 0 && allNotes.length > 0) {
      const matches = allNotes
        .filter((n) => n.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setNoteSuggestions(matches);
      setShowNoteSuggestions(matches.length > 0);
    } else {
      setNoteSuggestions([]);
      setShowNoteSuggestions(false);
    }
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (noteQuery.trim()) {
      router.push(`/search?note=${encodeURIComponent(noteQuery.trim())}`);
      setShowNoteSuggestions(false);
    }
  };

  const handleNoteClick = (note) => {
    setNoteQuery(note);
    setShowNoteSuggestions(false);
    router.push(`/search?note=${encodeURIComponent(note)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Tabs */}
      <div className="flex justify-center gap-1 search-tab-container backdrop-blur-sm rounded-full p-1 max-w-xs mx-auto">
        <button
          onClick={() => setActiveTab('name')}
          className={`flex-1 px-5 py-2 text-sm rounded-full transition-all duration-200 ${
            activeTab === 'name'
              ? 'search-tab-active font-medium'
              : 'search-tab-inactive'
          }`}
        >
          Name / Brand
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-5 py-2 text-sm rounded-full transition-all duration-200 ${
            activeTab === 'notes'
              ? 'search-tab-active font-medium'
              : 'search-tab-inactive'
          }`}
        >
          By Notes
        </button>
      </div>

      {/* Tab panels – both rendered in a grid so the container always has the height of the tallest panel, preventing layout shift */}
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        {/* Name/Brand Search */}
        <div
          className={`transition-opacity duration-200 ${
            activeTab === 'name' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <div className="relative" ref={wrapperRef}>
            {/* Spacer to match the helper text height in the notes tab */}
            <p className="text-center text-sm invisible" aria-hidden="true">&nbsp;</p>
            <form onSubmit={handleSubmit} className="relative" role="search">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by fragrance or brand..."
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

                  {/* Brand matches */}
                  {brandMatches.length > 0 && (
                    <div className="border-b border-gray-100">
                      {brandMatches.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => {
                            router.push(`/brand/${encodeURIComponent(brand)}`);
                            setShowSuggestions(false);
                            setQuery('');
                          }}
                          className="w-full text-left px-5 py-3.5 hover:bg-accent/5 transition-colors flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-serif text-sm text-accent font-medium truncate">
                              View all <HighlightMatch text={brand} query={query} /> perfumes
                            </div>
                            <div className="text-xs text-gray-400 truncate mt-0.5">
                              Browse the complete {brand} collection
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
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
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/brand/${encodeURIComponent(perfume.brand)}`);
                              setShowSuggestions(false);
                              setQuery('');
                            }}
                            className="hover:text-accent hover:underline cursor-pointer transition-colors"
                          >
                            <HighlightMatch text={perfume.brand} query={query} />
                          </span>
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
                {suggestions.length > 3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/90 to-transparent rounded-b-2xl pointer-events-none" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notes Search */}
        <div
          className={`transition-opacity duration-200 ${
            activeTab === 'notes' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <div className="space-y-4">
            <p className="text-center text-gray-500 text-sm">
              Search by note like <em className="text-accent">vanilla</em>, <em className="text-accent">rose</em>, or <em className="text-accent">oud</em>
            </p>
            <div className="relative" ref={noteWrapperRef}>
              <form onSubmit={handleNoteSubmit} className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter a fragrance note..."
                  value={noteQuery}
                  onChange={handleNoteInputChange}
                  onFocus={() => {
                    if (noteSuggestions.length > 0) setShowNoteSuggestions(true);
                  }}
                  className="w-full pl-14 pr-32 py-4 text-base bg-white border border-gray-200 rounded-full shadow-soft focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-gold focus:outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-white font-serif text-sm rounded-full hover:bg-accent-600 transition-all duration-200 hover:shadow-gold"
                >
                  Search
                </button>

                {/* Note autocomplete */}
                {showNoteSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-soft-lg z-50 max-h-64 overflow-y-auto animate-scale-in">
                    {noteSuggestions.map((note, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => handleNoteClick(note)}
                        className="w-full text-left px-6 py-3 hover:bg-accent/5 border-b border-gray-50 last:border-b-0 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        <span className="font-serif text-gray-900 text-sm">{note}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Popular Notes Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => handleNoteClick(note)}
                  className="px-4 py-1.5 border border-gray-200 text-gray-600 text-xs hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 rounded-full"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
