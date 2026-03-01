import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getPerfumes, getTopRatedPerfumes, getUniqueBrands } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Navbar from '../components/Navbar';
import FilterBar, { applyFilters, extractBrands } from '../components/FilterBar';
import Footer from '../components/Footer';

export default function Gallery({ topRated = [], allPerfumes = [], brands = [] }) {
  const [filters, setFilters] = useState({ gender: 'all', brand: 'all', sort: 'default' });
  const [displayMode, setDisplayMode] = useState('toprated');
  const [genderTopRated, setGenderTopRated] = useState(topRated);
  const [loadingTopRated, setLoadingTopRated] = useState(false);

  // Re-fetch top-rated when gender filter changes so we get top 24 for that gender
  useEffect(() => {
    if (displayMode !== 'toprated') return;

    if (filters.gender === 'all') {
      setGenderTopRated(topRated);
      return;
    }

    let cancelled = false;
    setLoadingTopRated(true);
    fetch(`/api/fragrances?type=toprated&limit=24&gender=${encodeURIComponent(filters.gender)}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setGenderTopRated(data);
      })
      .catch(() => {
        if (!cancelled) setGenderTopRated([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingTopRated(false);
      });

    return () => { cancelled = true; };
  }, [filters.gender, displayMode, topRated]);

  const getDisplayPerfumes = () => {
    switch (displayMode) {
      case 'all':
        return allPerfumes;
      case 'toprated':
      default:
        return genderTopRated;
    }
  };

  const perfumesBeforeFilter = getDisplayPerfumes();
  const allBrands = extractBrands(perfumesBeforeFilter).length > 0
    ? extractBrands(perfumesBeforeFilter)
    : brands;
  // For top-rated mode, gender filtering is already done server-side; only apply brand/sort
  const filtersForApply = displayMode === 'toprated'
    ? { ...filters, gender: 'all' }
    : filters;
  const displayPerfumes = applyFilters(perfumesBeforeFilter, filtersForApply);

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
                { id: 'toprated', label: 'Top Rated' },
                { id: 'all', label: 'All Perfumes' },
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
                    <div key={perfume.id || idx} className="relative">
                      {displayMode === 'toprated' && idx < 3 && (
                        <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-accent text-white text-sm font-serif flex items-center justify-center rounded-full shadow-md">
                          {idx + 1}
                        </div>
                      )}
                      <PerfumeCard perfume={perfume} featured={displayMode === 'toprated' && idx < 3} />
                    </div>
                  ))}
                </div>


              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  {loadingTopRated && displayMode === 'toprated' ? 'Loading fragrances...' : 'No fragrances found'}
                </p>
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
    const topRated = await getTopRatedPerfumes(24);
    const allData = await getPerfumes(500, 0);
    const allPerfumes = allData.perfumes || [];
    const brands = await getUniqueBrands();

    return {
      props: {
        topRated,
        allPerfumes,
        brands,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        topRated: [],
        allPerfumes: [],
        brands: [],
      },
    };
  }
}
