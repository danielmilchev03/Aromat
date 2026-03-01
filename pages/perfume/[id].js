import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getPerfumeById, searchPerfumes } from '../../lib/api';
import ScentPyramid from '../../components/ScentPyramid';
import Footer from '../../components/Footer';

export default function PerfumePage({ perfume, suggestions }) {
  const [copied, setCopied] = useState(false);

  if (!perfume) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl text-black">Fragrance Not Found</h1>
          <p className="text-gray-600">We couldn&apos;t find the fragrance you&apos;re looking for.</p>
          <Link href="/" className="inline-block mt-6 px-8 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const rating = parseFloat(perfume.rating) || 0;
  const allNotes = [
    ...(perfume.notes_top || []),
    ...(perfume.notes_middle || []),
    ...(perfume.notes_base || []),
  ];
  const hasNotes = allNotes.length > 0;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{perfume.name} by {perfume.brand} | Aromat</title>
        <meta name="description" content={perfume.description || `${perfume.name} by ${perfume.brand}`} />
        <meta property="og:title" content={`${perfume.name} by ${perfume.brand}`} />
        <meta property="og:description" content={perfume.description} />
        {perfume.image_url && <meta property="og:image" content={perfume.image_url} />}
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
              <div className="flex flex-col items-center justify-center bg-gray-50 aspect-square rounded-lg overflow-hidden">
                {perfume.image_url ? (
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-4xl text-gray-300 mb-4">✦</p>
                    <p className="text-gray-400 font-serif">Fragrance Preview</p>
                  </div>
                )}
              </div>

              {/* Info Column */}
              <div className="space-y-6">
                
                {/* Brand & Name */}
                <div>
                  <p className="text-accent text-sm font-serif tracking-widest uppercase mb-2">
                    {perfume.brand || 'Brand'}
                  </p>
                  <h1 className="font-serif text-5xl text-black leading-tight">
                    {perfume.name}
                  </h1>
                  <p className="text-lg text-gray-600 mt-4">by {perfume.brand || 'Unknown'}</p>
                </div>

                {/* Meta Info */}
                {(perfume.gender || perfume.release_year) && (
                  <div className="flex gap-4 text-sm text-gray-600">
                    {perfume.gender && (
                      <span className="px-3 py-1 bg-gray-100 rounded font-serif">{perfume.gender}</span>
                    )}
                    {perfume.release_year && (
                      <span className="px-3 py-1 bg-gray-100 rounded font-serif">{perfume.release_year}</span>
                    )}
                  </div>
                )}

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

                  {perfume.votes > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-serif text-gray-800">{perfume.votes.toLocaleString()}</span> votes
                    </div>
                  )}

                  {/* Longevity & Sillage */}
                  <div className="flex gap-6">
                    {perfume.longevity && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-serif tracking-wide">Longevity</p>
                        <p className="text-sm text-gray-800 font-serif">{perfume.longevity}</p>
                      </div>
                    )}
                    {perfume.sillage && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-serif tracking-wide">Sillage</p>
                        <p className="text-sm text-gray-800 font-serif">{perfume.sillage}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {perfume.description && (
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg text-black">About this Fragrance</h3>
                    <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                      {perfume.description}
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
                  {perfume.perfume_url && (
                    <a
                      href={perfume.perfume_url}
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
        {hasNotes && (
          <section className="py-20 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <ScentPyramid
                notes_top={perfume.notes_top || []}
                notes_middle={perfume.notes_middle || []}
                notes_base={perfume.notes_base || []}
              />
            </div>
          </section>
        )}

        {/* Full Description Section */}
        {perfume.description && (
          <section className="py-16 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-3xl text-black mb-8">Full Description</h2>
              <p className="text-gray-700 leading-relaxed line-clamp-none max-w-3xl">
                {perfume.description}
              </p>
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
                  <Link key={frag.id || idx} href={`/perfume/${frag.id}`} className="group block border border-gray-200 hover:border-accent transition-colors bg-white">
                    <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                      {frag.image_url ? (
                        <img
                          src={frag.image_url}
                          alt={frag.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <p className="text-gray-400 text-2xl">✦</p>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-accent text-xs font-serif uppercase mb-2">{frag.brand}</p>
                      <p className="font-serif text-sm text-black group-hover:text-accent transition-colors line-clamp-2">
                        {frag.name}
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

export async function getServerSideProps({ params }) {
  try {
    const perfume = await getPerfumeById(params.id);
    
    if (!perfume) {
      return { notFound: true };
    }

    // Get related fragrances by the same brand
    let suggestions = [];
    try {
      if (perfume.brand) {
        const related = await searchPerfumes(perfume.brand, 10);
        suggestions = (related || []).filter(p => p.id !== perfume.id).slice(0, 6);
      }
    } catch (e) {
      // Suggestions are non-critical
      console.error('Error fetching suggestions:', e);
    }

    return {
      props: {
        perfume,
        suggestions,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}
