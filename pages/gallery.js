import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRandomPerfumes, getTopRatedPerfumes, getUniqueBrands } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import FilterBar, { applyFilters, extractBrands } from '../components/FilterBar';
import Footer from '../components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_PERFUMAPI_URL || 'https://perfumapidatabase.onrender.com';

export default function Gallery({ featured = [], topRated = [], brands = [] }) {
  const [filters, setFilters] = useState({ gender: 'all', brand: 'all', sort: 'default' });
  const [displayMode, setDisplayMode] = useState('featured'); // featured, toprated, all
  const [allPerfumes, setAllPerfumes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const handleViewAll = async () => {
    if (allPerfumes.length > 0) {
      setShowAll(true);
      setDisplayMode('all');
      return;
    }
    setLoadingAll(true);
    try {
      const res = await fetch(`${API_BASE}/perfumes?limit=500&offset=0`);
      const data = await res.json();
      setAllPerfumes(data.perfumes || []);
      setShowAll(true);
      setDisplayMode('all');
    } catch (err) {
      console.error('Error fetching all perfumes:', err);
    } finally {
      setLoadingAll(false);
    }
  };

  const getDisplayPerfumes = () => {
    switch (displayMode) {
      case 'toprated':
        return topRated;
      case 'all':
        return allPerfumes;
      case 'featured':
      default:
        return featured;
    }
  };

  const perfumesBeforeFilter = getDisplayPerfumes();
  const allBrands = extractBrands(perfumesBeforeFilter).length > 0
    ? extractBrands(perfumesBeforeFilter)
    : brands;
  const displayPerfumes = applyFilters(perfumesBeforeFilter, filters);

  return (
    <>
      <Head>
        <title>Gallery | Aromat</title>
        <meta name="description" content="Browse our curated collection of finest fragrances" />
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

        {/* Header */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="font-serif text-5xl text-black mb-4">Fragrance Gallery</h1>
            <p className="text-gray-600 text-lg">
              Explore our curated collection of exquisite fragrances
            </p>
          </div>
        </section>

        {/* View Mode Tabs */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-4">View</h3>
            <div className="flex gap-4 flex-wrap">
              {[
                { id: 'featured', label: 'Featured' },
                { id: 'toprated', label: 'Top Rated' },
                ...(showAll ? [{ id: 'all', label: 'All Perfumes' }] : []),
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDisplayMode(mode.id)}
                  className={`px-6 py-2 border font-serif text-sm transition-colors ${
                    displayMode === mode.id
                      ? 'bg-accent text-white border-accent'
                      : 'border-gray-300 text-gray-700 hover:border-accent'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <FilterBar
          brands={allBrands}
          filters={filters}
          onChange={setFilters}
        />

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {displayPerfumes.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayPerfumes.map((perfume, idx) => (
                    <PerfumeCard key={perfume.id || idx} perfume={perfume} featured={displayMode === 'featured'} />
                  ))}
                </div>

                {/* View All Button */}
                {!showAll && displayMode !== 'all' && (
                  <div className="mt-16 text-center">
                    <button
                      onClick={handleViewAll}
                      disabled={loadingAll}
                      className="group inline-flex items-center gap-2 px-10 py-4 border-2 border-accent text-accent font-serif text-lg hover:bg-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                      {loadingAll ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Loading All Perfumes…
                        </>
                      ) : (
                        <>
                          View All Perfumes
                          <svg className="w-5 h-5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {showAll && displayMode === 'all' && (
                  <div className="mt-12 text-center">
                    <p className="text-gray-500 font-serif text-sm tracking-wide">
                      Showing all {displayPerfumes.length} fragrances
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No fragrances found in this category</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Discover Your Signature Scent</h2>
            <p className="text-gray-600 text-lg">
              Use our advanced search to find the perfect fragrance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Explore Fragrances
              </Link>
              <Link href="/search" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Advanced Search
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const featured = await getRandomPerfumes(12);
    const topRated = await getTopRatedPerfumes(12);
    const brands = await getUniqueBrands();

    return {
      props: {
        featured,
        topRated,
        brands,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        featured: [],
        topRated: [],
        brands: [],
      },
    };
  }
}
