import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getMostPopularPerfumes } from '../../lib/api';
import PerfumeCard from '../../components/PerfumeCard';
import FilterBar, { applyFilters, extractBrands } from '../../components/FilterBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function MostPopular({ perfumes = [] }) {
  const [filters, setFilters] = useState({ gender: 'all', brand: 'all', sort: 'default' });
  const brands = extractBrands(perfumes);
  const filtered = applyFilters(perfumes, filters);
  return (
    <>
      <Head>
        <title>Most Popular Fragrances | Aromat</title>
        <meta name="description" content="The most talked-about and widely loved fragrances in the world." />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Header */}
        <section className="pt-28 pb-16 bg-pattern">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-5">
            <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Collection</p>
            <h1 className="font-serif text-5xl md:text-6xl text-black">Most Popular</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              The fragrances captivating the most hearts — beloved by thousands and voted on by the global community.
            </p>
            <div className="text-accent text-3xl">♥</div>
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
                <p className="text-gray-500 text-sm mb-8 text-center">{filtered.length} fragrances ranked by popularity</p>
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
                <p className="text-gray-600 text-lg">Loading popular fragrances...</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Collections */}
        <section className="bg-light-bg py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore More Collections</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/collections/top-rated" className="btn-primary">Top Rated</Link>
              <Link href="/collections/new-arrivals" className="btn-primary">New Arrivals</Link>
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
    const perfumes = await getMostPopularPerfumes(24);
    return { props: { perfumes } };
  } catch (error) {
    console.error('Error fetching most popular:', error);
    return { props: { perfumes: [] } };
  }
}
