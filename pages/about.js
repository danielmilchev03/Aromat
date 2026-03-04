import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Aromat</title>
        <meta name="description" content="Aromat — a modern fragrance encyclopedia built for the discerning nose." />
      </Head>

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-16 bg-pattern">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-5">
            <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Our Story</p>
            <h1 className="font-serif text-5xl md:text-6xl text-black">About Aromat</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              A love letter to the world of fine fragrance, distilled into a modern digital experience.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 space-y-16">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl text-black">Elegant. Minimal. Pure.</h2>
                <p className="text-gray-600 leading-relaxed">
                  Aromat was born from a simple frustration: most fragrance databases feel cluttered, dated,
                  and overwhelming. We believe the art of perfumery deserves a platform as refined as the
                  scents themselves.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every detail — from our typography to our scent pyramids — is thoughtfully crafted
                  to let the fragrances take center stage.
                </p>
              </div>
              <div className="bg-light-bg rounded-2xl p-12 text-center space-y-6 border border-gray-100">
                <div className="text-5xl text-accent animate-float">✦</div>
                <p className="font-serif text-lg text-gray-800 italic">
                  "Perfume is the art that makes memory speak."
                </p>
                <p className="text-gray-500 text-sm tracking-wider">— UNKNOWN</p>
              </div>
            </div>

            {/* What Sets Us Apart */}
            <div className="border-t border-gray-100 pt-16">
              <div className="text-center space-y-4 mb-14">
                <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Why Choose Us</p>
                <h2 className="font-serif text-3xl text-black">What Sets Us Apart</h2>
              </div>

              {/* Top row — 3 feature cards */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                    ✦
                  </div>
                  <h3 className="font-serif text-xl text-black">Clean Design</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Elegant minimalism. No clutter, no noise — every pixel serves a purpose so fragrances take center stage.
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                    ◆
                  </div>
                  <h3 className="font-serif text-xl text-black">Scent Pyramids</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Visualize how fragrances evolve from top to base notes with elegant, interactive pyramids.
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                    ⟡
                  </div>
                  <h3 className="font-serif text-xl text-black">Search by Notes</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Find fragrances by notes like vanilla, rose, oud, musk, and more.
                  </p>
                </div>
              </div>

              {/* Bottom row — 2 wider cards, centered */}
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                    ❖
                  </div>
                  <h3 className="font-serif text-xl text-black">Deep Data</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Ratings, longevity, sillage — everything a fragrance enthusiast needs, all at a glance.
                  </p>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl group-hover:scale-110 transition-transform duration-300">
                    ★
                  </div>
                  <h3 className="font-serif text-xl text-black">Community Driven</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Ratings and votes from a global community of fragrance lovers power our rankings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-light-bg py-16">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Start Exploring</h2>
            <p className="text-gray-500 text-base">Discover your next signature scent.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/gallery" className="btn-primary">Browse Gallery</Link>
              <Link href="/" className="btn-primary">Go Home</Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
