import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchPerfumes, searchPerfumesByNote, getAllNotes } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  'Vetiver', 'Iris', 'Coconut', 'Leather', 'Saffron', 'Cardamom',
];

export default function SearchResults({ initialResults = [], query = '', initialNoteResults = [], initialNote = '', allNotes = [] }) {
  const router = useRouter();

  // --- Name/Brand search state ---
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [lastFetchedQuery, setLastFetchedQuery] = useState(query);

  // --- Notes search state ---
  const [noteResults, setNoteResults] = useState(initialNoteResults);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteQuery, setNoteQuery] = useState(initialNote);
  const [lastFetchedNote, setLastFetchedNote] = useState(initialNote);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- Name autocomplete state ---
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [nameActiveIndex, setNameActiveIndex] = useState(-1);
  const [nameAutoLoading, setNameAutoLoading] = useState(false);
  const nameWrapperRef = useRef(null);
  const nameInputRef = useRef(null);
  const nameDebounceRef = useRef(null);

  // --- Tab state: 'name' or 'notes' ---
  const [activeTab, setActiveTab] = useState(initialNote ? 'notes' : 'name');

  // Close name autocomplete when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (nameWrapperRef.current && !nameWrapperRef.current.contains(e.target)) {
        setShowNameSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup name debounce on unmount
  useEffect(() => {
    return () => {
      if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);
    };
  }, []);

  // Debounced fetch for name/brand autocomplete
  const fetchNameSuggestions = useCallback(async (value) => {
    if (value.trim().length < 2) {
      setNameSuggestions([]);
      setShowNameSuggestions(false);
      setNameAutoLoading(false);
      return;
    }
    setNameAutoLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=7`);
      const data = await response.json();
      setNameSuggestions(Array.isArray(data) ? data : []);
      setShowNameSuggestions(true);
    } catch (error) {
      console.error('Error fetching name suggestions:', error);
      setNameSuggestions([]);
    } finally {
      setNameAutoLoading(false);
    }
  }, []);

  const handleNameInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setNameActiveIndex(-1);
    if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current);
    if (value.trim().length < 2) {
      setNameSuggestions([]);
      setShowNameSuggestions(false);
      setNameAutoLoading(false);
      return;
    }
    setNameAutoLoading(true);
    nameDebounceRef.current = setTimeout(() => fetchNameSuggestions(value), 300);
  };

  const handleNameSuggestionClick = (perfume) => {
    router.push(`/perfume/${perfume.id}`);
    setShowNameSuggestions(false);
  };

  const handleNameKeyDown = (e) => {
    if (!showNameSuggestions || nameSuggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setNameActiveIndex((prev) => (prev < nameSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setNameActiveIndex((prev) => (prev > 0 ? prev - 1 : nameSuggestions.length - 1));
        break;
      case 'Escape':
        setShowNameSuggestions(false);
        setNameActiveIndex(-1);
        break;
    }
  };

  const handleNameFocus = () => {
    if (nameSuggestions.length > 0 && searchQuery.trim().length >= 2) {
      setShowNameSuggestions(true);
    }
  };

  // Sync URL params
  useEffect(() => {
    const q = router.query.q || '';
    const n = router.query.note || '';

    if (n) {
      setActiveTab('notes');
      if (n !== lastFetchedNote) {
        setNoteQuery(n);
        setLastFetchedNote(n);
        handleNoteSearch(n);
      }
    } else if (q && q !== lastFetchedQuery) {
      setActiveTab('name');
      setSearchQuery(q);
      setLastFetchedQuery(q);
      handleSearch(q);
    }
  }, [router.query.q, router.query.note]);

  // --- Name/Brand handlers ---
  const handleSearch = async (q) => {
    setLoading(true);
    try {
      const res = await searchPerfumes(q, 50);
      setResults(res);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (nameActiveIndex >= 0 && nameSuggestions[nameActiveIndex]) {
      router.push(`/perfume/${nameSuggestions[nameActiveIndex].id}`);
    } else if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setShowNameSuggestions(false);
  };

  // --- Notes handlers ---
  const handleNoteSearch = async (note) => {
    if (!note.trim()) return;
    setNoteLoading(true);
    setShowSuggestions(false);
    try {
      const res = await searchPerfumesByNote(note, 100);
      setNoteResults(res);
    } catch (error) {
      console.error('Note search error:', error);
      setNoteResults([]);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (noteQuery.trim()) {
      router.push(`/search?note=${encodeURIComponent(noteQuery.trim())}`, undefined, { shallow: false });
      setLastFetchedNote(noteQuery.trim());
      handleNoteSearch(noteQuery.trim());
    }
  };

  const handleNoteClick = (note) => {
    setNoteQuery(note);
    setShowSuggestions(false);
    router.push(`/search?note=${encodeURIComponent(note)}`, undefined, { shallow: false });
    setLastFetchedNote(note);
    handleNoteSearch(note);
  };

  const handleNoteInputChange = (e) => {
    const value = e.target.value;
    setNoteQuery(value);
    if (value.trim().length > 0 && allNotes.length > 0) {
      const matches = allNotes
        .filter((n) => n.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getMatchedNotes = (perfume) => {
    if (!noteQuery.trim()) return [];
    const q = noteQuery.toLowerCase().trim();
    const all = [
      ...(perfume.notes_top || []).map((n) => ({ name: n, layer: 'Top' })),
      ...(perfume.notes_middle || []).map((n) => ({ name: n, layer: 'Middle' })),
      ...(perfume.notes_base || []).map((n) => ({ name: n, layer: 'Base' })),
    ];
    return all.filter((n) => n.name.toLowerCase().includes(q));
  };

  const hasSearched = !!lastFetchedQuery;
  const hasNoteSearched = !!lastFetchedNote;

  // Determine which results to show based on active tab
  const showingNameResults = activeTab === 'name';
  const showingNoteResults = activeTab === 'notes';
  const currentResults = showingNameResults ? results : noteResults;
  const currentLoading = showingNameResults ? loading : noteLoading;
  const currentHasSearched = showingNameResults ? hasSearched : hasNoteSearched;

  return (
    <>
      <Head>
        <title>
          {showingNoteResults && hasNoteSearched
            ? `Perfumes with "${lastFetchedNote}" | Aromat`
            : hasSearched
            ? `Search Results for "${lastFetchedQuery}" | Aromat`
            : 'Advanced Search | Aromat'}
        </title>
        <meta name="description" content="Search the Aromat fragrance encyclopedia by name, brand, or fragrance notes." />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Search Section */}
        <section className="pt-28 pb-12 bg-pattern">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-3">
                <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Find Your Fragrance</p>
                <h1 className="font-serif text-4xl md:text-5xl text-black">Advanced Search</h1>
              </div>

              {/* Tabs */}
              <div className="flex justify-center gap-1 bg-gray-100 rounded-full p-1 max-w-xs mx-auto">
                <button
                  onClick={() => setActiveTab('name')}
                  className={`flex-1 px-5 py-2 text-sm rounded-full transition-all duration-200 ${
                    activeTab === 'name'
                      ? 'bg-white text-black shadow-sm font-medium'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Name / Brand
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 px-5 py-2 text-sm rounded-full transition-all duration-200 ${
                    activeTab === 'notes'
                      ? 'bg-white text-black shadow-sm font-medium'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  By Notes
                </button>
              </div>

              {/* Name/Brand Search Form */}
              {activeTab === 'name' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-500 text-sm">Search fragrances by name or brand</p>
                  <div className="relative" ref={nameWrapperRef}>
                    <form onSubmit={handleNewSearch} className="relative" role="search">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        ref={nameInputRef}
                        type="text"
                        placeholder="Search by name or brand..."
                        value={searchQuery}
                        onChange={handleNameInputChange}
                        onKeyDown={handleNameKeyDown}
                        onFocus={handleNameFocus}
                        role="combobox"
                        aria-expanded={showNameSuggestions}
                        aria-autocomplete="list"
                        aria-activedescendant={nameActiveIndex >= 0 ? `name-suggestion-${nameActiveIndex}` : undefined}
                        className="w-full pl-14 pr-32 py-4 text-base bg-white border border-gray-200 rounded-full shadow-soft focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-white font-serif text-sm rounded-full hover:bg-accent-600 transition-all hover:shadow-gold"
                      >
                        Search
                      </button>
                    </form>

                    {/* Autocomplete Dropdown */}
                    {showNameSuggestions && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-scale-in">
                        <div
                          className="bg-white border border-gray-200 rounded-2xl shadow-soft-lg max-h-96 overflow-y-auto"
                          role="listbox"
                        >
                          {nameAutoLoading && nameSuggestions.length === 0 && (
                            <div className="px-6 py-4 text-gray-400 text-sm flex items-center gap-3">
                              <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Searching...
                            </div>
                          )}

                          {!nameAutoLoading && nameSuggestions.length === 0 && searchQuery.trim().length >= 2 && (
                            <div className="px-6 py-4 text-gray-400 text-sm">
                              No results found for &ldquo;{searchQuery}&rdquo;
                            </div>
                          )}

                          {nameSuggestions.map((perfume, idx) => (
                            <button
                              key={perfume.id || idx}
                              id={`name-suggestion-${idx}`}
                              role="option"
                              aria-selected={idx === nameActiveIndex}
                              onClick={() => handleNameSuggestionClick(perfume)}
                              onMouseEnter={() => setNameActiveIndex(idx)}
                              className={`w-full text-left px-5 py-3.5 border-b border-gray-50 last:border-b-0 transition-colors flex items-center gap-4 ${
                                idx === nameActiveIndex ? 'bg-accent/5' : 'hover:bg-gray-50'
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
                                  <HighlightMatch text={perfume.name} query={searchQuery} />
                                </div>
                                <div className="text-xs text-gray-400 truncate mt-0.5">
                                  <HighlightMatch text={perfume.brand} query={searchQuery} />
                                </div>
                              </div>
                              <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}

                          {nameSuggestions.length > 0 && (
                            <button
                              onClick={handleNewSearch}
                              className="w-full text-center px-6 py-3.5 text-sm text-accent hover:bg-accent/5 transition-colors font-medium border-t border-gray-100 rounded-b-2xl"
                            >
                              See all results for &ldquo;{searchQuery}&rdquo;
                            </button>
                          )}
                        </div>
                        {nameSuggestions.length > 3 && (
                          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/90 to-transparent rounded-b-2xl pointer-events-none" />
                        )}
                      </div>
                    )}
                  </div>

                  {(loading || hasSearched) && (
                    <p className="text-center text-gray-600">
                      {loading ? (
                        'Searching...'
                      ) : results.length > 0 ? (
                        <>
                          Found <span className="font-serif text-accent">{results.length}</span> fragrance{results.length !== 1 ? 's' : ''}
                        </>
                      ) : (
                        <>No results found for &ldquo;{lastFetchedQuery}&rdquo;</>
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Notes Search Form */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-500 text-sm">
                    Type a note like <em className="text-accent">vanilla</em>, <em className="text-accent">rose</em>, or <em className="text-accent">oud</em>
                  </p>
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
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      className="w-full pl-14 pr-32 py-4 text-base bg-white border border-gray-200 rounded-full shadow-soft focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-white font-serif text-sm rounded-full hover:bg-accent-600 transition-all hover:shadow-gold"
                    >
                      Search
                    </button>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-soft-lg z-50 max-h-64 overflow-y-auto animate-scale-in">
                        {suggestions.map((note, idx) => (
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

                  {(noteLoading || hasNoteSearched) && (
                    <p className="text-center text-gray-600">
                      {noteLoading ? (
                        'Searching...'
                      ) : noteResults.length > 0 ? (
                        <>
                          Found <span className="font-serif text-accent">{noteResults.length}</span> fragrance
                          {noteResults.length !== 1 ? 's' : ''} with <span className="font-serif text-accent">&ldquo;{lastFetchedNote}&rdquo;</span>
                        </>
                      ) : lastFetchedNote ? (
                        <>No fragrances found with note &ldquo;{lastFetchedNote}&rdquo;</>
                      ) : null}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Popular Notes Quick Access (shown when notes tab is active and no search yet) */}
        {activeTab === 'notes' && !hasNoteSearched && (
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-2xl text-black mb-6 text-center">Popular Notes</h2>
              <div className="flex flex-wrap justify-center gap-2.5">
                {POPULAR_NOTES.map((note) => (
                  <button
                    key={note}
                    onClick={() => handleNoteClick(note)}
                    className="px-5 py-2 border border-gray-200 text-gray-600 text-sm hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200 rounded-full"
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Results Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {currentLoading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm">
                  {showingNoteResults ? 'Searching by note...' : 'Loading results...'}
                </p>
              </div>
            ) : currentResults.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentResults.map((perfume, idx) => {
                  const matched = showingNoteResults ? getMatchedNotes(perfume) : [];
                  return (
                    <div key={perfume.id || idx} className="relative">
                      <PerfumeCard perfume={perfume} />
                      {matched.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {matched.map((m, i) => (
                            <span
                              key={i}
                              className="inline-block px-2.5 py-1 text-[10px] font-medium bg-accent/5 text-accent border border-accent/15 rounded-full"
                            >
                              {m.layer}: {m.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : currentHasSearched ? (
              <div className="text-center py-20 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-black">No Fragrances Found</h2>
                <p className="text-gray-500 max-w-md mx-auto text-sm">
                  {showingNameResults
                    ? `We couldn't find any fragrances matching "${lastFetchedQuery}". Try different keywords.`
                    : `We couldn't find any fragrances with the note "${lastFetchedNote}". Try a different note.`}
                </p>
                {showingNoteResults && (
                  <div className="pt-4">
                    <p className="text-gray-500 text-sm mb-4">Try one of these:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {POPULAR_NOTES.slice(0, 8).map((note) => (
                        <button
                          key={note}
                          onClick={() => handleNoteClick(note)}
                          className="px-4 py-2 border border-gray-200 text-gray-600 text-sm hover:border-accent hover:text-accent transition-all rounded-full"
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Link href="/" className="btn-primary inline-flex mt-6">
                  &larr; Back to Home
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        {/* Tips Section */}
        {activeTab === 'name' && results.length === 0 && !loading && !hasSearched && (
          <section className="bg-light-bg py-16">
            <div className="max-w-3xl mx-auto px-6 space-y-8">
              <h3 className="font-serif text-2xl text-black text-center">Search Tips</h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 text-center shadow-card">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">✦</div>
                  <h4 className="font-serif text-black mb-1.5 text-sm">By Brand</h4>
                  <p className="text-xs text-gray-500">Try &ldquo;Dior&rdquo; or &ldquo;Chanel&rdquo;</p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-card">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">◆</div>
                  <h4 className="font-serif text-black mb-1.5 text-sm">By Note</h4>
                  <p className="text-xs text-gray-500">Switch to &ldquo;By Notes&rdquo; tab</p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-card">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">⟡</div>
                  <h4 className="font-serif text-black mb-1.5 text-sm">By Fragrance</h4>
                  <p className="text-xs text-gray-500">Search name directly</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const q = query.q || '';
    const note = query.note || '';

    let results = [];
    let noteResults = [];
    let allNotes = [];

    // Always fetch all notes for autocomplete
    try {
      allNotes = await getAllNotes();
    } catch (e) {
      console.error('Error fetching notes:', e);
    }

    if (note) {
      noteResults = await searchPerfumesByNote(note, 100);
    }

    if (q) {
      results = await searchPerfumes(q, 50);
    }

    return {
      props: {
        initialResults: results || [],
        query: q,
        initialNoteResults: noteResults || [],
        initialNote: note,
        allNotes,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialResults: [],
        query: query.q || '',
        initialNoteResults: [],
        initialNote: query.note || '',
        allNotes: [],
      },
    };
  }
}
