import Head from 'next/head';
import Link from 'next/link';
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
        {/* Hero Section */}
        <section className="hero-section w-full flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-gray-50 to-white min-h-[70vh]">
          <div className="max-w-4xl text-center space-y-12">
            {/* Logo/Branding */}
            <div className="space-y-2">
              <p className="text-accent text-lg font-serif tracking-widest">OLFACTORY EXCELLENCE</p>
              <h1 className="font-serif text-6xl md:text-7xl font-light text-black tracking-tight">
                Aromat
              </h1>
              <p className="text-gray-600 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
                Discover, explore, and experience the world's most exquisite fragrances with unparalleled elegance.
              </p>
            </div>

            {/* Accent Line */}
            <div className="flex items-center gap-4 justify-center">
              <div className="h-px w-12 bg-accent"></div>
              <p className="text-gray-500 text-sm font-serif tracking-widest">CURATED COLLECTION</p>
              <div className="h-px w-12 bg-accent"></div>
            </div>

            {/* Search Bar */}
            <div className="pt-8">
              <SearchBar />
            </div>

            {/* Tagline */}
            <div className="space-y-4 pt-8 text-gray-600">
              <p className="text-base font-light">
                More sophisticated than Fragrantica. Pure elegance. Zero clutter.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-2xl text-accent font-serif">∞</span>
                  <span className="text-gray-500 mt-1">Vast Library</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl text-accent font-serif">✓</span>
                  <span className="text-gray-500 mt-1">Expert Reviews</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl text-accent font-serif">◆</span>
                  <span className="text-gray-500 mt-1">Visual Design</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-4xl text-black mb-16 text-center">Why Aromat?</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="text-center space-y-4">
                <div className="text-5xl text-accent mb-4">✦</div>
                <h3 className="font-serif text-xl text-black">Clean Design</h3>
                <p className="text-gray-600">
                  Elegant minimalism. No clutter. Just the fragrances that matter.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center space-y-4">
                <div className="text-5xl text-accent mb-4">◆</div>
                <h3 className="font-serif text-xl text-black">Scent Pyramids</h3>
                <p className="text-gray-600">
                  Visualize how fragrances evolve from top to base notes.
                </p>
              </div>

              {/* Feature 3 */}
              <Link href="/search-notes" className="text-center space-y-4 group">
                <div className="text-5xl text-accent mb-4">⟡</div>
                <h3 className="font-serif text-xl text-black group-hover:text-accent transition-colors">Search by Notes</h3>
                <p className="text-gray-600">
                  Find fragrances by notes like vanilla, rose, oud, musk, and more.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Random Recommendations Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-6 mb-16">
              <h2 className="font-serif text-5xl text-black">Discover Collections</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore our handpicked selection. Each visit brings new fragrances to discover.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-accent"></div>
                <p className="text-gray-500 text-sm font-serif tracking-widest">FRESH RECOMMENDATIONS</p>
                <div className="h-px w-12 bg-accent"></div>
              </div>
            </div>

            {randomPerfumes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {randomPerfumes.map((perfume, index) => (
                  <div key={perfume.id || index}>
                    <PerfumeCard perfume={perfume} featured={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading recommendations...</p>
              </div>
            )}

            {/* Browse All Button */}
            <div className="flex justify-center mt-12">
              <Link href="/gallery" className="px-10 py-3 bg-black text-white font-serif text-lg hover:bg-gray-800 transition-colors inline-block">
                Browse All Fragrances
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-4xl text-black">Search Your Signature Scent</h2>
            <p className="text-gray-600 text-lg">
              Use our advanced search to find fragrances by brand, notes, ratings, or similarity. Discover your perfect match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/search" className="px-8 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors inline-block">
                Advanced Search
              </Link>
              <Link href="/search-notes" className="px-8 py-3 bg-black text-white font-serif hover:bg-gray-800 transition-colors inline-block">
                Search by Notes
              </Link>
              <Link href="/gallery" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors inline-block">
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
