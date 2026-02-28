import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchPerfumes } from '../lib/perfumeData';
import PerfumeCard from '../components/PerfumeCard';
import Footer from '../components/Footer';

export default function SearchResults({ initialResults = [], query = '' }) {
  const router = useRouter();
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (router.query.q !== searchQuery) {
      setSearchQuery(router.query.q || '');
      handleSearch(router.query.q || '');
    }
  }, [router.query.q]);

  const handleSearch = (q) => {
    setLoading(true);
    try {
      const res = searchPerfumes(q);
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

  return (
    <>
      <Head>
        <title>Search Results for "{query}" | Aromat</title>
        <meta name="description" content={`Search results for ${query} on Aromat fragrance encyclopedia`} />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-black hover:text-accent transition-colors">
              Aromat
            </Link>
            <Link href="/" className="text-gray-600 hover:text-black transition-colors">
              ← Home
            </Link>
          </div>
        </nav>

        {/* Search Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <h1 className="font-serif text-4xl text-black text-center">Search Results</h1>
              
              <form onSubmit={handleNewSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search again..."
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

              <p className="text-center text-gray-600">
                {loading ? (
                  'Searching...'
                ) : results.length > 0 ? (
                  <>
                    Found <span className="font-serif text-accent">{results.length}</span> fragrance{results.length !== 1 ? 's' : ''}
                  </>
                ) : (
                  'No results found'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600">Loading results...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((perfume, idx) => (
                  <PerfumeCard key={idx} perfume={perfume} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-6">
                <h2 className="font-serif text-2xl text-black">No Fragrances Found</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any fragrances matching "{query}". Try searching with different keywords.
                </p>
                <Link href="/" className="inline-block mt-8 px-8 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors">
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Tips Section */}
        {results.length === 0 && (
          <section className="bg-gray-50 py-16 border-t border-gray-200">
            <div className="max-w-2xl mx-auto px-6 space-y-8">
              <h3 className="font-serif text-2xl text-black text-center">Search Tips</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl text-accent mb-3">✦</p>
                  <h4 className="font-serif text-black mb-2">By Brand</h4>
                  <p className="text-sm text-gray-600">Try searching "Dior" or "Chanel"</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl text-accent mb-3">◆</p>
                  <h4 className="font-serif text-black mb-2">By Note</h4>
                  <p className="text-sm text-gray-600">Search "rose", "vanilla", or "musk"</p>
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
    
    if (!q || q.trim() === '') {
      return {
        props: {
          initialResults: [],
          query: '',
        },
      };
    }

    const results = searchPerfumes(q);

    return {
      props: {
        initialResults: results.slice(0, 50), // Limit initial results
        query: q,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialResults: [],
        query: '',
      },
    };
  }
}
