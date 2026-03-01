import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRandomPerfumes, getTopRatedPerfumes, getUniqueBrands } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Navbar from '../components/Navbar';
import FilterBar, { applyFilters, extractBrands } from '../components/FilterBar';
import Footer from '../components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_PERFUMAPI_URL || 'https://perfumapidatabase.onrender.com';

export default function Gallery({ featured = [], topRated = [], brands = [] }) {
  const [filters, setFilters] = useState({ gender: 'all', brand: 'all', sort: 'default' });
  const [displayMode, setDisplayMode] = useState('featured');
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
        <Navbar />

        {/* Header */}
        <section className="pt-28 pb-12 bg-pattern">
          <div className="max-w-6xl mx-auto px-6">
            <div className="space-y-4">
              <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Collection</p>
              <h1 className="font-serif text-5xl md:text-6xl text-black text-center">Fragrance Gallery</h1>
              <p className="text-gray-500 text-base text-center max-w-lg mx-auto">
                Explore our curated collection of exquisite fragrances
              </p>
            </div>
          </div>
        </section>

        {/* View Mode Tabs */}
        <section className="border-b border-gray-100 bg-white sticky top-[60px] z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-medium mr-2">View:</span>
              {[
                { id: 'featured', label: 'Featured' },
                { id: 'toprated', label: 'Top Rated' },
                ...(showAll ? [{ id: 'all', label: 'All Perfumes' }] : []),
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDisplayMode(mode.id)}
                  className={`px-5 py-2 text-sm rounded-full transition-all duration-200 ${
                    displayMode === mode.id
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
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
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {displayPerfumes.length > 0 ? (
              <>
                <p className="text-gray-400 text-sm mb-8 text-center">{displayPerfumes.length} fragrances</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="btn-secondary text-base disabled:opacity-50 disabled:cursor-wait"
                    >
                      {loadingAll ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          View All Perfumes
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {showAll && displayMode === 'all' && (
                  <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm">
                      Showing all {displayPerfumes.length} fragrances
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No fragrances found</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-light-bg py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Discover Your Signature Scent</h2>
            <p className="text-gray-500">Use our advanced search to find the perfect fragrance</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-secondary">Explore Fragrances</Link>
              <Link href="/search" className="btn-primary">Advanced Search</Link>
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
