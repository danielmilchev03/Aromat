import Head from 'next/head';
import Link from 'next/link';
import { searchPerfumes, searchPerfumesByNote } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';

export default function SearchResults({ results = [], query = '', note = '' }) {
  const isNoteSearch = !!note;
  const hasSearched = !!(query || note);

  const getMatchedNotes = (perfume) => {
    if (!note) return [];
    const q = note.toLowerCase().trim();
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
        <title>
          {isNoteSearch
            ? `Perfumes with "${note}" | Aromat`
            : query
            ? `Search Results for "${query}" | Aromat`
            : 'Search | Aromat'}
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
                <h1 className="font-serif text-4xl md:text-5xl text-black">Search</h1>
              </div>

              <SearchBar
                initialTab={isNoteSearch ? 'notes' : 'name'}
                initialQuery={query}
                initialNote={note}
              />
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {hasSearched && results.length > 0 && (
              <>
                <p className="text-center text-gray-600 mb-8">
                  Found <span className="font-serif text-accent">{results.length}</span> fragrance{results.length !== 1 ? 's' : ''}
                  {isNoteSearch && (
                    <> with <span className="font-serif text-accent">&ldquo;{note}&rdquo;</span></>
                  )}
                  {query && !isNoteSearch && (
                    <> for <span className="font-serif text-accent">&ldquo;{query}&rdquo;</span></>
                  )}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((perfume, idx) => {
                    const matched = isNoteSearch ? getMatchedNotes(perfume) : [];
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
              </>
            )}

            {hasSearched && results.length === 0 && (
              <div className="text-center py-20 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-black">No Fragrances Found</h2>
                <p className="text-gray-500 max-w-md mx-auto text-sm">
                  {isNoteSearch
                    ? `We couldn't find any fragrances with the note "${note}". Try a different note.`
                    : `We couldn't find any fragrances matching "${query}". Try different keywords.`}
                </p>
                <Link href="/" className="btn-primary inline-flex mt-6">
                  &larr; Back to Home
                </Link>
              </div>
            )}

            {!hasSearched && (
              <section className="bg-light-bg py-16 -mx-6 px-6 rounded-2xl">
                <div className="max-w-3xl mx-auto space-y-8">
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
          </div>
        </section>

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

    if (note) {
      results = await searchPerfumesByNote(note, 100);
    } else if (q) {
      results = await searchPerfumes(q, 50);
    }

    return {
      props: {
        results: results || [],
        query: q,
        note,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        results: [],
        query: query.q || '',
        note: query.note || '',
      },
    };
  }
}
