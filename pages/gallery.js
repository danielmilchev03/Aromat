import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRandomPerfumes, getTopRatedPerfumes, getUniqueBrands } from '../lib/api';
import PerfumeCard from '../components/PerfumeCard';
import Footer from '../components/Footer';

export default function Gallery({ featured = [], topRated = [], brands = [] }) {
  const [filterBrand, setFilterBrand] = useState('all');
  const [displayMode, setDisplayMode] = useState('featured'); // featured, toprated, all

  const getDisplayPerfumes = () => {
    switch (displayMode) {
      case 'toprated':
        return topRated;
      case 'featured':
      default:
        return featured;
    }
  };

  const displayPerfumes = getDisplayPerfumes();

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

        {/* Filters */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* View Mode */}
            <div className="mb-8">
              <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-4">View</h3>
              <div className="flex gap-4 flex-wrap">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'toprated', label: 'Top Rated' },
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

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div>
                <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-4">Brands</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setFilterBrand('all')}
                    className={`px-4 py-2 text-sm font-serif transition-colors ${
                      filterBrand === 'all'
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setFilterBrand(brand)}
                      className={`px-4 py-2 text-sm font-serif transition-colors ${
                        filterBrand === brand
                          ? 'bg-accent text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {displayPerfumes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPerfumes.map((perfume, idx) => (
                  <PerfumeCard key={idx} perfume={perfume} featured={displayMode === 'featured'} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No fragrances found in this category</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white py-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <div>
              <h2 className="font-serif text-4xl mb-4">Discover Your Signature Scent</h2>
              <p className="text-gray-300 text-lg mb-8">
                Use our advanced search to find the perfect fragrance
              </p>
            </div>
            
            <Link href="/" className="inline-block px-8 py-3 bg-accent text-black font-serif hover:bg-yellow-600 transition-colors">
              Explore Fragrances
            </Link>
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
