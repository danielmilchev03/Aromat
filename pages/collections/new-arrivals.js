import Head from 'next/head';
import Link from 'next/link';
import { getNewArrivals } from '../../lib/api';
import PerfumeCard from '../../components/PerfumeCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function NewArrivals({ perfumes = [] }) {
  return (
    <>
      <Head>
        <title>New Arrivals | Aromat</title>
        <meta name="description" content="The latest fragrance releases — fresh from the world's top perfume houses." />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Header */}
        <section className="pt-28 pb-16 bg-pattern">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-5">
            <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Collection</p>
            <h1 className="font-serif text-5xl md:text-6xl text-black">New Arrivals</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              The freshest additions to the world of fine fragrance — the newest releases from legendary and emerging houses alike.
            </p>
            <div className="text-accent text-3xl">✧</div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {perfumes.length > 0 ? (
              <>
                <p className="text-gray-500 text-sm mb-8 text-center">{perfumes.length} fragrances sorted by release year</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <section className="bg-light-bg py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore More Collections</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/collections/top-rated" className="btn-primary">Top Rated</Link>
              <Link href="/collections/most-popular" className="btn-primary">Most Popular</Link>
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
    const perfumes = await getNewArrivals(24);
    return { props: { perfumes } };
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return { props: { perfumes: [] } };
  }
}
