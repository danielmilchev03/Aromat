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

            {/* Values */}
            <div className="border-t border-gray-100 pt-16">
              <h2 className="font-serif text-3xl text-black text-center mb-12">What Guides Us</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-card">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xl">◆</div>
                  <h3 className="font-serif text-xl text-black">Clean Design</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    No clutter, no noise. Every pixel serves a purpose, letting the beauty of fragrance data shine through.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-card">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xl">⟡</div>
                  <h3 className="font-serif text-xl text-black">Deep Data</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Scent pyramids, ratings, longevity, sillage — everything a fragrance enthusiast needs, at a glance.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 text-center space-y-4 shadow-card">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xl">★</div>
                  <h3 className="font-serif text-xl text-black">Community Driven</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Ratings and votes from a global community of fragrance lovers power our rankings and recommendations.
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="border-t border-gray-100 pt-16 text-center space-y-8">
              <h2 className="font-serif text-3xl text-black">Built With Care</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Aromat is a modern web application built with Next.js, styled with Tailwind CSS,
                and powered by the open-source PerfumAPI database. Fast, responsive, and free to explore.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="px-5 py-2.5 border border-gray-200 font-mono text-xs rounded-xl">Next.js</span>
                <span className="px-5 py-2.5 border border-gray-200 font-mono text-xs rounded-xl">Tailwind</span>
                <span className="px-5 py-2.5 border border-gray-200 font-mono text-xs rounded-xl">PerfumAPI</span>
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
