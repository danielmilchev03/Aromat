import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPerfumesByBrand } from '../../lib/api';
import PerfumeCard from '../../components/PerfumeCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'year', label: 'Newest First' },
  { value: 'votes', label: 'Most Popular' },
];

const GENDER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Women', label: 'Women' },
  { value: 'Men', label: 'Men' },
  { value: 'Unisex', label: 'Unisex' },
];

export default function BrandPage({ brand = '', perfumes = [], total = 0 }) {
  const router = useRouter();
  const [sort, setSort] = useState('name');
  const [gender, setGender] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Client-side sorting and filtering
  const displayPerfumes = useMemo(() => {
    let filtered = [...perfumes];

    // Gender filter
    if (gender !== 'all') {
      filtered = filtered.filter((p) => p.gender === gender);
    }

    // Name search within brand
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        (p.name || '').toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'year':
        filtered.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
        break;
      case 'votes':
        filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    return filtered;
  }, [perfumes, sort, gender, searchFilter]);

  // Compute stats
  const stats = useMemo(() => {
    const avgRating = perfumes.length > 0
      ? (perfumes.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / perfumes.filter(p => p.rating > 0).length).toFixed(1)
      : '0';
    const years = perfumes.map(p => p.release_year).filter(Boolean);
    const yearRange = years.length > 0
      ? `${Math.min(...years)} – ${Math.max(...years)}`
      : 'N/A';
    const genders = {};
    perfumes.forEach(p => {
      if (p.gender) genders[p.gender] = (genders[p.gender] || 0) + 1;
    });
    return { avgRating, yearRange, genders };
  }, [perfumes]);

  if (router.isFallback) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading brand...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{brand} Perfumes | Aromat</title>
        <meta
          name="description"
          content={`Explore all ${total} fragrances by ${brand}. Browse the complete ${brand} perfume collection on Aromat.`}
        />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Brand Hero */}
        <section className="relative pt-32 pb-16 bg-pattern overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-16 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6 animate-fade-in-up">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link>
              <span>/</span>
              <span className="text-gray-600">{brand}</span>
            </nav>

            <p className="text-accent text-sm font-serif tracking-[0.3em] uppercase">Brand Collection</p>

            <h1 className="font-serif text-5xl md:text-6xl font-light text-black tracking-tight">
              {brand}
            </h1>

            <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              Explore the complete collection of {total} fragrance{total !== 1 ? 's' : ''} by {brand}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="text-center">
                <p className="font-serif text-2xl text-accent">{total}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest">Fragrances</p>
              </div>
              {stats.avgRating !== 'NaN' && stats.avgRating !== '0' && (
                <div className="text-center">
                  <p className="font-serif text-2xl text-accent">
                    <span className="text-sm mr-1">★</span>{stats.avgRating}
                  </p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest">Avg Rating</p>
                </div>
              )}
              <div className="text-center">
                <p className="font-serif text-2xl text-accent">{stats.yearRange}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest">Year Range</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="border-b border-gray-100 bg-white sticky top-[60px] z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search within brand */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search within ${brand}...`}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-full focus:border-accent focus:ring-1 focus:ring-accent/15 focus:outline-none transition-all"
                />
              </div>

              {/* Gender pills */}
              <div className="flex gap-1.5">
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGender(opt.value)}
                    className={`px-4 py-2 text-xs rounded-full transition-all duration-200 ${
                      gender === opt.value
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {opt.label}
                    {opt.value !== 'all' && stats.genders[opt.value]
                      ? ` (${stats.genders[opt.value]})`
                      : ''}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 text-xs bg-gray-50 border border-gray-100 rounded-full focus:border-accent focus:ring-1 focus:ring-accent/15 focus:outline-none transition-all cursor-pointer appearance-none pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Perfume Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {displayPerfumes.length > 0 ? (
              <>
                <p className="text-gray-400 text-sm mb-8 text-center">
                  Showing {displayPerfumes.length} of {total} fragrance{total !== 1 ? 's' : ''}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayPerfumes.map((perfume, idx) => (
                    <div
                      key={perfume.id || idx}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(idx * 40, 600)}ms` }}
                    >
                      <PerfumeCard perfume={perfume} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 space-y-6 animate-fade-in-up">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl text-black">No Perfumes Found</h2>
                  <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                    {searchFilter
                      ? `No "${brand}" fragrances match "${searchFilter}". Try a different search.`
                      : `No fragrances found for "${brand}".`}
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-4">
                  <Link href="/gallery" className="btn-secondary text-sm">
                    Browse Gallery
                  </Link>
                  <Link href="/search" className="btn-dark text-sm">
                    Search All
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related section */}
        <section className="bg-light-bg py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore More</h2>
            <p className="text-gray-500 text-sm">Discover fragrances from other brands and collections</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/search" className="btn-primary text-sm">
                Search Fragrances
              </Link>
              <Link href="/gallery" className="btn-secondary text-sm">
                Full Gallery
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const brandName = decodeURIComponent(params.name || '');
    const perfumes = await getPerfumesByBrand(brandName);

    if (perfumes.length === 0) {
      // Brand not found — still render the page (shows empty state)
    }

    // Use the canonical brand name from the first perfume (proper casing)
    const canonicalBrand = perfumes.length > 0 ? perfumes[0].brand : brandName;

    return {
      props: {
        brand: canonicalBrand,
        perfumes,
        total: perfumes.length,
      },
    };
  } catch (error) {
    console.error('Error in brand getServerSideProps:', error);
    return {
      props: {
        brand: decodeURIComponent(params.name || ''),
        perfumes: [],
        total: 0,
      },
    };
  }
}
