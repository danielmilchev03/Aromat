import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Aromat</title>
        <meta name="description" content="Aromat — a modern fragrance encyclopedia built for the discerning nose." />
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

        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-accent"></div>
              <p className="text-accent text-sm font-serif tracking-widest">OUR STORY</p>
              <div className="h-px w-12 bg-accent"></div>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-black">About Aromat</h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
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
              <div className="bg-gray-50 p-12 text-center space-y-6 border border-gray-200">
                <div className="text-6xl text-accent">✦</div>
                <p className="font-serif text-lg text-gray-800 italic">
                  "Perfume is the art that makes memory speak."
                </p>
                <p className="text-gray-500 text-sm tracking-wider">— UNKNOWN</p>
              </div>
            </div>

            {/* Values */}
            <div className="border-t border-gray-200 pt-16">
              <h2 className="font-serif text-3xl text-black text-center mb-12">What Guides Us</h2>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center space-y-4">
                  <div className="text-4xl text-accent">◆</div>
                  <h3 className="font-serif text-xl text-black">Clean Design</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    No clutter, no noise. Every pixel serves a purpose, letting the beauty of fragrance data shine through.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-4xl text-accent">⟡</div>
                  <h3 className="font-serif text-xl text-black">Deep Data</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Scent pyramids, ratings, longevity, sillage — everything a fragrance enthusiast needs, at a glance.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="text-4xl text-accent">★</div>
                  <h3 className="font-serif text-xl text-black">Community Driven</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Ratings and votes from a global community of fragrance lovers power our rankings and recommendations.
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="border-t border-gray-200 pt-16 text-center space-y-8">
              <h2 className="font-serif text-3xl text-black">Built With Care</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Aromat is a modern web application built with Next.js, styled with Tailwind CSS,
                and powered by the open-source PerfumAPI database. Fast, responsive, and free to explore.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <span className="px-4 py-2 border border-gray-200 font-mono">Next.js</span>
                <span className="px-4 py-2 border border-gray-200 font-mono">Tailwind</span>
                <span className="px-4 py-2 border border-gray-200 font-mono">PerfumAPI</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Start Exploring</h2>
            <p className="text-gray-600 text-lg">Discover your next signature scent.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gallery" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Browse Gallery
              </Link>
              <Link href="/" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Go Home
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
