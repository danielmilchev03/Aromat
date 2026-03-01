import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchPerfumesByNote, getAllNotes } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Footer from '../components/Footer';

const POPULAR_NOTES = [
  'Vanilla', 'Rose', 'Musk', 'Sandalwood', 'Oud', 'Jasmine',
  'Bergamot', 'Cedar', 'Amber', 'Patchouli', 'Lavender', 'Tonka Bean',
  'Vetiver', 'Iris', 'Coconut', 'Leather', 'Saffron', 'Cardamom',
];

export default function SearchByNotes({ initialResults = [], initialNote = '', allNotes = [] }) {
  const router = useRouter();
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [noteQuery, setNoteQuery] = useState(initialNote);
  const [lastFetchedNote, setLastFetchedNote] = useState(initialNote);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const n = router.query.note || '';
    if (n && n !== lastFetchedNote) {
      setNoteQuery(n);
      setLastFetchedNote(n);
      handleSearch(n);
    }
  }, [router.query.note]);

  const handleSearch = async (note) => {
    if (!note.trim()) return;
    setLoading(true);
    setShowSuggestions(false);
    try {
      const res = await searchPerfumesByNote(note, 100);
      setResults(res);
    } catch (error) {
      console.error('Note search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noteQuery.trim()) {
      router.push(`/search-notes?note=${encodeURIComponent(noteQuery.trim())}`, undefined, { shallow: false });
      setLastFetchedNote(noteQuery.trim());
      handleSearch(noteQuery.trim());
    }
  };

  const handleNoteClick = (note) => {
    setNoteQuery(note);
    setShowSuggestions(false);
    router.push(`/search-notes?note=${encodeURIComponent(note)}`, undefined, { shallow: false });
    setLastFetchedNote(note);
    handleSearch(note);
  };

  const handleInputChange = (e) => {
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

  // Determine which notes matched for each result so we can highlight them
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

  return (
    <>
      <Head>
        <title>{initialNote ? `Perfumes with "${initialNote}" | Aromat` : 'Search by Notes | Aromat'}</title>
        <meta name="description" content="Find perfumes by their fragrance notes - vanilla, rose, musk, oud and more." />
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
              <Link href="/search" className="text-gray-600 hover:text-black transition-colors text-sm">
                Search
              </Link>
              <Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm">
                Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Search Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <p className="text-accent text-sm font-serif tracking-widest uppercase">Explore by Ingredient</p>
                <h1 className="font-serif text-4xl md:text-5xl text-black">Search by Notes</h1>
                <p className="text-gray-600 text-lg">
                  Type a note like <em>vanilla</em>, <em>rose</em>, or <em>oud</em> to find all fragrances containing it.
                </p>
              </div>

              {/* Search Input */}
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Enter a fragrance note..."
                  value={noteQuery}
                  onChange={handleInputChange}
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

              {/* Results count */}
              {(loading || lastFetchedNote) && (
                <p className="text-center text-gray-600">
                  {loading ? (
                    'Searching...'
                  ) : results.length > 0 ? (
                    <>
                      Found <span className="font-serif text-accent">{results.length}</span> fragrance
                      {results.length !== 1 ? 's' : ''} with <span className="font-serif text-accent">"{lastFetchedNote}"</span>
                    </>
                  ) : lastFetchedNote ? (
                    <>No fragrances found with note "{lastFetchedNote}"</>
                  ) : null}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Popular Notes Quick Access */}
        {!lastFetchedNote && (
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
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Searching fragrances by note...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                {/* Show matched note badge per result */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((perfume, idx) => {
                    const matched = getMatchedNotes(perfume);
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
              </>
            ) : lastFetchedNote ? (
              <div className="text-center py-16 space-y-6">
                <h2 className="font-serif text-2xl text-black">No Fragrances Found</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any fragrances with the note "{lastFetchedNote}". Try a different note.
                </p>
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
              </div>
            ) : null}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const note = context.query.note || '';
  let results = [];
  let allNotes = [];

  try {
    allNotes = await getAllNotes();
    if (note) {
      results = await searchPerfumesByNote(note, 100);
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
  }

  return {
    props: {
      initialResults: results,
      initialNote: note,
      allNotes,
    },
  };
}
