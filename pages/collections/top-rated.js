import Head from 'next/head';
import Link from 'next/link';
import { getTopRatedPerfumes } from '../../lib/api';
import PerfumeCard from '../../components/PerfumeCard';
import Footer from '../../components/Footer';

export default function TopRated({ perfumes = [] }) {
  return (
    <>
      <Head>
        <title>Top Rated Fragrances | Aromat</title>
        <meta name="description" content="The highest-rated fragrances according to the community." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-black hover:text-accent transition-colors">
              Aromat
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/gallery" className="text-gray-600 hover:text-black transition-colors">Gallery</Link>
              <Link href="/search" className="text-gray-600 hover:text-black transition-colors">Search</Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-accent"></div>
              <p className="text-accent text-sm font-serif tracking-widest">COLLECTION</p>
              <div className="h-px w-12 bg-accent"></div>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-black">Top Rated</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The community's most celebrated fragrances — timeless masterpieces that have earned the highest acclaim.
            </p>
            <div className="text-accent text-4xl">★</div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {perfumes.length > 0 ? (
              <>
                <p className="text-gray-500 text-sm mb-8 text-center">{perfumes.length} fragrances ranked by rating</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {perfumes.map((perfume, idx) => (
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
                <p className="text-gray-600 text-lg">Loading top rated fragrances...</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Collections */}
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore More Collections</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/collections/most-popular" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Most Popular
              </Link>
              <Link href="/collections/new-arrivals" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                New Arrivals
              </Link>
              <Link href="/gallery" className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-serif hover:border-accent hover:text-accent transition-colors">
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

export async function getServerSideProps() {
  try {
    const perfumes = await getTopRatedPerfumes(24);
    return { props: { perfumes } };
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return { props: { perfumes: [] } };
  }
}
