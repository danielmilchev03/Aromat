import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchPerfumes, searchPerfumesByNote, getAllNotes } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Footer from '../components/Footer';

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

  // --- Tab state: 'name' or 'notes' ---
  const [activeTab, setActiveTab] = useState(initialNote ? 'notes' : 'name');

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
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-black hover:text-accent transition-colors">
              Aromat
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/gallery" className="text-gray-600 hover:text-black transition-colors text-sm">
                Gallery
              </Link>
              <Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm">
                Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Search Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <p className="text-accent text-sm font-serif tracking-widest uppercase">Find Your Fragrance</p>
                <h1 className="font-serif text-4xl md:text-5xl text-black">Advanced Search</h1>
              </div>

              {/* Tabs */}
              <div className="flex justify-center border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('name')}
                  className={`px-6 py-3 font-serif text-sm tracking-wide transition-colors border-b-2 -mb-px ${
                    activeTab === 'name'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  By Name / Brand
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-6 py-3 font-serif text-sm tracking-wide transition-colors border-b-2 -mb-px ${
                    activeTab === 'notes'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  By Notes
                </button>
              </div>

              {/* Name/Brand Search Form */}
              {activeTab === 'name' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">Search fragrances by name or brand</p>
                  <form onSubmit={handleNewSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or brand..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-300 focus:border-accent focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-0 h-full px-8 bg-accent text-white font-serif text-lg hover:bg-yellow-600 transition-colors"
                    >
                      Search
                    </button>
                  </form>

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
                  <p className="text-center text-gray-600">
                    Type a note like <em>vanilla</em>, <em>rose</em>, or <em>oud</em> to find all fragrances containing it.
                  </p>
                  <form onSubmit={handleNoteSubmit} className="relative">
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
                      className="w-full px-6 py-4 text-lg border-2 border-gray-300 focus:border-accent focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-0 h-full px-8 bg-accent text-white font-serif text-lg hover:bg-yellow-600 transition-colors"
                    >
                      Search
                    </button>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && (
                      <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 border-t-0 shadow-lg z-50 max-h-64 overflow-y-auto">
                        {suggestions.map((note, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => handleNoteClick(note)}
                            className="w-full text-left px-6 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <span className="font-serif text-gray-900">{note}</span>
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
          <section className="py-12 border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-2xl text-black mb-6 text-center">Popular Notes</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {POPULAR_NOTES.map((note) => (
                  <button
                    key={note}
                    onClick={() => handleNoteClick(note)}
                    className="px-5 py-2 border border-gray-300 text-gray-700 font-serif text-sm hover:border-accent hover:text-accent hover:bg-yellow-50 transition-all rounded-full"
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
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">
                  {showingNoteResults ? 'Searching fragrances by note...' : 'Loading results...'}
                </p>
              </div>
            ) : currentResults.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentResults.map((perfume, idx) => {
                  const matched = showingNoteResults ? getMatchedNotes(perfume) : [];
                  return (
                    <div key={perfume.id || idx} className="relative">
                      <PerfumeCard perfume={perfume} />
                      {matched.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {matched.map((m, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 text-xs font-serif bg-yellow-50 text-accent border border-yellow-200 rounded-full"
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
              <div className="text-center py-16 space-y-6">
                <h2 className="font-serif text-2xl text-black">No Fragrances Found</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  {showingNameResults
                    ? `We couldn't find any fragrances matching "${lastFetchedQuery}". Try searching with different keywords.`
                    : `We couldn't find any fragrances with the note "${lastFetchedNote}". Try a different note.`}
                </p>
                {showingNoteResults && (
                  <div className="pt-4">
                    <h3 className="font-serif text-lg text-black mb-4">Try one of these:</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {POPULAR_NOTES.slice(0, 8).map((note) => (
                        <button
                          key={note}
                          onClick={() => handleNoteClick(note)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-serif text-sm hover:border-accent hover:text-accent transition-all rounded-full"
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Link href="/" className="inline-block mt-8 px-8 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors">
                  ← Back to Home
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        {/* Tips Section (shown when name tab is active and no results yet) */}
        {activeTab === 'name' && results.length === 0 && !loading && !hasSearched && (
          <section className="bg-gray-50 py-16 border-t border-gray-200">
            <div className="max-w-2xl mx-auto px-6 space-y-8">
              <h3 className="font-serif text-2xl text-black text-center">Search Tips</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl text-accent mb-3">✦</p>
                  <h4 className="font-serif text-black mb-2">By Brand</h4>
                  <p className="text-sm text-gray-600">Try searching &ldquo;Dior&rdquo; or &ldquo;Chanel&rdquo;</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl text-accent mb-3">◆</p>
                  <h4 className="font-serif text-black mb-2">By Note</h4>
                  <p className="text-sm text-gray-600">Switch to the &ldquo;By Notes&rdquo; tab above</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl text-accent mb-3">⟡</p>
                  <h4 className="font-serif text-black mb-2">By Fragrance</h4>
                  <p className="text-sm text-gray-600">Search fragrance name directly</p>
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
