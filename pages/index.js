import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PerfumeCard from '../components/PerfumeCard';
import Footer from '../components/Footer';
import { getRandomPerfumes } from '../lib/api';

export default function Home({ randomPerfumes = [] }) {
  return (
    <>
      <Head>
        <title>Aromat - Modern Fragrance Encyclopedia</title>
        <meta name="description" content="Discover the world's finest fragrances with Aromat - a sleek, modern fragrance encyclopedia." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-32 pb-24 min-h-[85vh] bg-pattern overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative max-w-4xl text-center space-y-10">
            {/* Logo/Branding */}
            <div className="space-y-6 animate-fade-in-up">
              <p className="text-accent text-sm font-serif tracking-[0.3em] uppercase">Olfactory Excellence</p>
              <h1 className="font-serif text-6xl md:text-8xl font-light text-black tracking-tight leading-none">
                Aromat
              </h1>
              <p className="text-gray-500 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
                Discover, explore, and experience the world&apos;s most exquisite fragrances.
              </p>
            </div>

            {/* Search Bar */}
            <div className="animate-fade-in-up delay-200 max-w-2xl mx-auto relative z-10">
              <SearchBar />
            </div>

            {/* Feature Pills */}
            <div className="animate-fade-in-up delay-300 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Vast Library
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Expert Reviews
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Visual Design
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-light-bg">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Why Choose Us</p>
              <h2 className="font-serif text-4xl md:text-5xl text-black">Why Aromat?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                  ✦
                </div>
                <h3 className="font-serif text-xl text-black">Clean Design</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Elegant minimalism. No clutter. Just the fragrances that matter.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                  ◆
                </div>
                <h3 className="font-serif text-xl text-black">Scent Pyramids</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Visualize how fragrances evolve from top to base notes.
                </p>
              </div>

              {/* Feature 3 */}
              <Link href="/search?note=" className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4 block">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                  ⟡
                </div>
                <h3 className="font-serif text-xl text-black group-hover:text-accent transition-colors">Search by Notes</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Find fragrances by notes like vanilla, rose, oud, musk, and more.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Random Recommendations Section */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Fresh Picks</p>
              <h2 className="font-serif text-4xl md:text-5xl text-black">Discover Something New</h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">
                Each visit brings a fresh selection of fragrances to explore.
              </p>
            </div>

            {randomPerfumes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {randomPerfumes.map((perfume, index) => (
                  <div key={perfume.id || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
                    <PerfumeCard perfume={perfume} featured={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading recommendations...</p>
              </div>
            )}

            {/* Browse All Button */}
            <div className="flex justify-center mt-14">
              <Link href="/gallery" className="btn-dark text-lg">
                Browse All Fragrances
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-light-bg bg-pattern">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl text-black">Find Your Signature Scent</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Search by brand, notes, ratings, or similarity. Your perfect match is waiting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/search" className="btn-primary text-base">
                Advanced Search
              </Link>
              <Link href="/gallery" className="btn-secondary text-base">
                View Gallery
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

/**
 * Generate random perfumes at build time for static generation
 * Revalidates every 1 hour (3600 seconds) for fresh recommendations
 */
export async function getServerSideProps() {
  try {
    const randomPerfumes = await getRandomPerfumes(6);
    
    return {
      props: {
        randomPerfumes: randomPerfumes || [],
      },
    };
  } catch (error) {
    console.error('Error fetching random perfumes:', error);
    return {
      props: {
        randomPerfumes: [],
      },
    };
  }
}
