import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getPerfumeByTitle, searchPerfumes, cleanText } from '../../lib/perfumeData';
import ScentPyramid from '../../components/ScentPyramid';
import Footer from '../../components/Footer';

export default function PerfumePage({ perfume, suggestions }) {
  const [copied, setCopied] = useState(false);

  if (!perfume) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl text-black">Fragrance Not Found</h1>
          <p className="text-gray-600">We couldn't find the fragrance you're looking for.</p>
          <Link href="/" className="inline-block mt-6 px-8 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const rating = parseFloat(perfume.rating) || 0;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{perfume.title} | Aromat</title>
        <meta name="description" content={perfume.description || perfume.title} />
        <meta property="og:title" content={perfume.title} />
        <meta property="og:description" content={perfume.description} />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-black hover:text-accent transition-colors">
              Aromat
            </Link>
            <Link href="/" className="text-gray-600 hover:text-black transition-colors">
              ← Back
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="border-b border-gray-200 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              
              {/* Image Column */}
              <div className="flex flex-col items-center justify-center bg-gray-50 aspect-square rounded-lg">
                <div className="text-center">
                  <p className="text-4xl text-gray-300 mb-4">✦</p>
                  <p className="text-gray-400 font-serif">Fragrance Preview</p>
                </div>
              </div>

              {/* Info Column */}
              <div className="space-y-6">
                
                {/* Brand */}
                <div>
                  <p className="text-accent text-sm font-serif tracking-widest uppercase mb-2">Brand</p>
                  <h1 className="font-serif text-5xl text-black leading-tight">
                    {perfume.title}
                  </h1>
                  <p className="text-lg text-gray-600 mt-4">by {perfume.designer || 'Unknown'}</p>
                </div>

                {/* Rating & Stats */}
                <div className="space-y-4 py-6 border-t border-b border-gray-200">
                  {rating > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-serif text-gray-800">Rating</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${i < Math.floor(rating) ? 'text-accent' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-600 text-lg font-serif">{rating.toFixed(1)}/5</span>
                      </div>
                    </div>
                  )}

                  {perfume.reviews && (
                    <div className="text-sm text-gray-600">
                      <span className="font-serif text-gray-800">
                        {Array.isArray(perfume.reviews) ? perfume.reviews.length : 1}
                      </span> expert reviews
                    </div>
                  )}
                </div>

                {/* Description */}
                {perfume.description && (
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg text-black">About this Fragrance</h3>
                    <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                      {cleanText(perfume.description)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCopyUrl}
                    className="flex-1 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors"
                  >
                    {copied ? '✓ Copied' : 'Share'}
                  </button>
                  {perfume.url && (
                    <a
                      href={perfume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors text-center"
                    >
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scent Pyramid Section */}
        {perfume.notes && (Array.isArray(perfume.notes) ? perfume.notes.length > 0 : true) && (
          <section className="py-20 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <ScentPyramid notes={perfume.notes} />
            </div>
          </section>
        )}

        {/* Full Description Section */}
        {perfume.description && (
          <section className="py-16 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-3xl text-black mb-8">Full Description</h2>
              <p className="text-gray-700 leading-relaxed line-clamp-none max-w-3xl">
                {cleanText(perfume.description)}
              </p>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {perfume.reviews && (Array.isArray(perfume.reviews) ? perfume.reviews.length > 0 : true) && (
          <section className="py-16 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-3xl text-black mb-8">Community Reviews</h2>
              
              <div className="grid gap-6">
                {Array.isArray(perfume.reviews) ? (
                  perfume.reviews.slice(0, 3).map((review, idx) => {
                    const cleanedReview = cleanText(String(review));
                    return (
                      <div key={idx} className="border border-gray-200 p-6 bg-gray-50">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                          {cleanedReview.slice(0, 200)}
                        </p>
                        {cleanedReview.length > 150 && (
                          <p className="text-accent text-xs font-serif mt-4 cursor-pointer hover:text-yellow-600">
                            Read Full Review →
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-gray-200 p-6 bg-gray-50">
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {cleanText(String(perfume.reviews)).slice(0, 200)}
                    </p>
                  </div>
                )}
              </div>

              {Array.isArray(perfume.reviews) && perfume.reviews.length > 3 && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-sm">
                    + {perfume.reviews.length - 3} more reviews
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Fragrances */}
        {suggestions && suggestions.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-3xl text-black mb-8">Related Fragrances</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {suggestions.slice(0, 3).map((frag, idx) => (
                  <Link key={idx} href={`/perfume/${encodeURIComponent(frag.title)}`} className="group block border border-gray-200 hover:border-accent transition-colors bg-white">
                    <div className="bg-gray-100 aspect-square flex items-center justify-center">
                      <p className="text-gray-400 text-2xl">✦</p>
                    </div>
                    <div className="p-4">
                      <p className="text-accent text-xs font-serif uppercase mb-2">{frag.designer}</p>
                      <p className="font-serif text-sm text-black group-hover:text-accent transition-colors line-clamp-2">
                        {frag.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

export async function getStaticProps({ params }) {
  try {
    const perfume = getPerfumeByTitle(decodeURIComponent(params.title));
    
    if (!perfume) {
      return {
        notFound: true,
        revalidate: 86400, // Revalidate daily
      };
    }

    // Get related fragrances by brand
    const suggestions = searchPerfumes(perfume.designer || '').filter(
      p => p.title !== perfume.title
    );

    return {
      props: {
        perfume,
        suggestions: suggestions.slice(0, 6),
      },
      revalidate: 86400, // Revalidate daily
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
      revalidate: 3600,
    };
  }
}

export async function getStaticPaths() {
  // Generate paths for popular fragrances to optimize build time
  // For 300MB+ files, we'll use on-demand ISR instead of generating all paths
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand
  };
}
