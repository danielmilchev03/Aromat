import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getTopRatedPerfumes } from '../../lib/api';
import PerfumeCard from '../../components/PerfumeCard';
import FilterBar, { applyFilters, extractBrands } from '../../components/FilterBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TopRated({ perfumes = [] }) {
  const [filters, setFilters] = useState({ gender: 'all', brand: 'all', sort: 'default' });
  const [genderPerfumes, setGenderPerfumes] = useState(perfumes);
  const [loading, setLoading] = useState(false);

  // Re-fetch top-rated when gender filter changes so we get top 24 for that gender
  useEffect(() => {
    if (filters.gender === 'all') {
      setGenderPerfumes(perfumes);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/fragrances?type=toprated&limit=24&gender=${encodeURIComponent(filters.gender)}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setGenderPerfumes(data);
      })
      .catch(() => {
        if (!cancelled) setGenderPerfumes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters.gender, perfumes]);

  const brands = extractBrands(genderPerfumes);
  // Gender filtering already applied server-side; only apply brand/sort client-side
  const filtersForApply = { ...filters, gender: 'all' };
  const filtered = applyFilters(genderPerfumes, filtersForApply);
  return (
    <>
      <Head>
        <title>Top Rated Fragrances | Aromat</title>
        <meta name="description" content="The highest-rated fragrances according to the community." />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Header */}
        <section className="pt-28 pb-16 bg-pattern">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-5">
            <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Collection</p>
            <h1 className="font-serif text-5xl md:text-6xl text-black">Top Rated</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              The community's most celebrated fragrances — timeless masterpieces that have earned the highest acclaim.
            </p>
            <div className="text-accent text-3xl">★</div>
          </div>
        </section>

        {/* Filters */}
        <FilterBar
          brands={brands}
          filters={filters}
          onChange={setFilters}
        />

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {filtered.length > 0 ? (
              <>
                <p className="text-gray-500 text-sm mb-8 text-center">{filtered.length} fragrances ranked by rating</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((perfume, idx) => (
                    <div key={perfume.id || idx} className="relative">
                      {idx < 3 && (
                        <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-accent text-white text-sm font-serif flex items-center justify-center rounded-full shadow-md">
                          {idx + 1}
                        </div>
                      )}
                      <PerfumeCard perfume={perfume} featured={idx < 3} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">
                  {loading ? 'Loading top rated fragrances...' : 'No fragrances found'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Other Collections */}
        <section className="bg-light-bg py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore More Collections</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/collections/most-popular" className="btn-secondary">Most Popular</Link>
              <Link href="/collections/new-arrivals" className="btn-secondary">New Arrivals</Link>
              <Link href="/gallery" className="btn-primary">Full Gallery</Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const perfumes = await getTopRatedPerfumes(24);
    return { props: { perfumes } };
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return { props: { perfumes: [] } };
  }
}
