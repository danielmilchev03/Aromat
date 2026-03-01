import Head from 'next/head';
import Link from 'next/link';
import { getNewArrivals } from '../../lib/api';
import PerfumeCard from '../../components/PerfumeCard';
import Footer from '../../components/Footer';

export default function NewArrivals({ perfumes = [] }) {
  return (
    <>
      <Head>
        <title>New Arrivals | Aromat</title>
        <meta name="description" content="The latest fragrance releases — fresh from the world's top perfume houses." />
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
            <h1 className="font-serif text-5xl md:text-6xl text-black">New Arrivals</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The freshest additions to the world of fine fragrance — the newest releases from legendary and emerging houses alike.
            </p>
            <div className="text-accent text-4xl">✧</div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {perfumes.length > 0 ? (
              <>
                <p className="text-gray-500 text-sm mb-8 text-center">{perfumes.length} fragrances sorted by release year</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {perfumes.map((perfume, idx) => (
                    <PerfumeCard key={perfume.id || idx} perfume={perfume} featured={false} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">Loading new arrivals...</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Collections */}
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore More Collections</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/collections/top-rated" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Top Rated
              </Link>
              <Link href="/collections/most-popular" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Most Popular
              </Link>
              <Link href="/gallery" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
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
    const perfumes = await getNewArrivals(24);
    return { props: { perfumes } };
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return { props: { perfumes: [] } };
  }
}
