import Head from 'next/head';
import Link from 'next/link';
import { searchPerfumes, searchPerfumesByNote } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';

export default function SearchResults({ results = [], query = '', note = '', matchedBrand = '' }) {
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

        {/* Search Hero */}
        <section className="relative pt-32 pb-16 bg-pattern z-10">
          {/* Decorative blurs */}
          <div className="absolute top-16 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-3 animate-fade-in-up">
              <p className="text-accent text-sm font-serif tracking-[0.3em] uppercase">Olfactory Search</p>
              <h1 className="font-serif text-5xl md:text-6xl font-light text-black tracking-tight">
                Find Your Scent
              </h1>
              <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
                Search by name, brand, or explore through fragrance notes.
              </p>
            </div>

            <div className="animate-fade-in-up delay-200 relative z-10">
              <SearchBar
                initialTab={isNoteSearch ? 'notes' : 'name'}
                initialQuery={query}
                initialNote={note}
              />
            </div>
          </div>
        </section>

        {/* Results / Empty States */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">

            {/* Has results */}
            {hasSearched && results.length > 0 && (
              <>
                {/* Brand page link banner */}
                {matchedBrand && !isNoteSearch && (
                  <div className="mb-8 animate-fade-in-up">
                    <Link
                      href={`/brand/${encodeURIComponent(matchedBrand)}`}
                      className="block p-5 rounded-2xl border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
                          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-lg text-accent font-medium">
                            View all {matchedBrand} perfumes
                          </p>
                          <p className="text-sm text-gray-500">
                            Browse the complete {matchedBrand} collection
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )}

                <div className="text-center mb-12 space-y-1">
                  <p className="text-sm text-gray-400 uppercase tracking-widest font-serif">Results</p>
                  <p className="text-gray-600">
                    <span className="font-serif text-accent text-lg">{results.length}</span>{' '}
                    fragrance{results.length !== 1 ? 's' : ''}
                    {isNoteSearch && (
                      <> containing <span className="font-serif text-accent">&ldquo;{note}&rdquo;</span></>
                    )}
                    {query && !isNoteSearch && (
                      <> matching <span className="font-serif text-accent">&ldquo;{query}&rdquo;</span></>
                    )}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((perfume, idx) => {
                    const matched = isNoteSearch ? getMatchedNotes(perfume) : [];
                    return (
                      <div key={perfume.id || idx} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
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

            {/* No results */}
            {hasSearched && results.length === 0 && (
              <div className="text-center py-24 space-y-6 animate-fade-in-up">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl text-black">No Results</h2>
                  <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                    {isNoteSearch
                      ? `No fragrances found with the note "${note}". Try a different note or browse our gallery.`
                      : `Nothing matched "${query}". Try adjusting your search or explore our collection.`}
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-4">
                  <Link href="/gallery" className="btn-secondary text-sm">
                    Browse Gallery
                  </Link>
                  <Link href="/" className="btn-dark text-sm">
                    Back Home
                  </Link>
                </div>
              </div>
            )}

            {/* Default — no search yet */}
            {!hasSearched && (
              <div className="max-w-3xl mx-auto animate-fade-in-up delay-300">
                {/* Quick links */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <Link
                    href="/gallery"
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-gold transition-all duration-300 text-center space-y-3"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <span className="text-accent text-sm">★</span>
                    </div>
                    <h4 className="font-serif text-base text-gray-900">Top Rated</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">The highest rated fragrances in our collection.</p>
                  </Link>

                  <Link
                    href="/gallery?view=all"
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-gold transition-all duration-300 text-center space-y-3"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <span className="text-accent text-sm">♦</span>
                    </div>
                    <h4 className="font-serif text-base text-gray-900">All Perfumes</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Browse the full fragrance collection.</p>
                  </Link>

                  <Link
                    href="/gallery?view=newarrivals"
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-gold transition-all duration-300 text-center space-y-3"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <span className="text-accent text-sm">✦</span>
                    </div>
                    <h4 className="font-serif text-base text-gray-900">New Arrivals</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Recently added fragrances to discover.</p>
                  </Link>
                </div>

                <div className="text-center pt-10">
                  <Link href="/gallery" className="btn-primary text-sm">
                    Browse Full Gallery
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
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
    let matchedBrand = '';

    if (note) {
      results = await searchPerfumesByNote(note, 100);
    } else if (q) {
      results = await searchPerfumes(q, 50);

      // Detect if any results have a brand name matching the query
      const qLower = q.toLowerCase().trim();
      const brandCounts = {};
      results.forEach((p) => {
        if (p.brand && p.brand.toLowerCase().includes(qLower)) {
          const key = p.brand.toLowerCase();
          if (!brandCounts[key]) brandCounts[key] = { name: p.brand, count: 0 };
          brandCounts[key].count++;
        }
      });
      // Pick the brand with the most matches
      const topBrand = Object.values(brandCounts).sort((a, b) => b.count - a.count)[0];
      if (topBrand) {
        matchedBrand = topBrand.name;
      }
    }

    return {
      props: {
        results: results || [],
        query: q,
        note,
        matchedBrand,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        results: [],
        query: query.q || '',
        note: query.note || '',
        matchedBrand: '',
      },
    };
  }
}
