import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getPerfumeById, searchPerfumes } from '../../lib/api';
import ScentPyramid from '../../components/ScentPyramid';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CollectionButtons from '../../components/CollectionButtons';

export default function PerfumePage({ perfume, suggestions }) {
  const [copied, setCopied] = useState(false);

  if (!perfume) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-gray-400 text-2xl">?</span>
          </div>
          <h1 className="font-serif text-4xl text-black">Fragrance Not Found</h1>
          <p className="text-gray-500">We couldn&apos;t find the fragrance you&apos;re looking for.</p>
          <Link href="/" className="btn-primary inline-flex mt-6">
            &larr; Back to Home
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
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link>
              <span>/</span>
              <span className="text-gray-600 truncate max-w-[200px]">{perfume.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Image Column */}
              <div className="animate-fade-in">
                <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square sticky top-24">
                  {perfume.image_url ? (
                    <img
                      src={perfume.image_url}
                      alt={perfume.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-3">
                          <span className="text-accent text-2xl">✦</span>
                        </div>
                        <p className="text-gray-400 font-serif text-sm">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Column */}
              <div className="space-y-6 animate-fade-in-up">

                {/* Brand & Name */}
                <div className="space-y-3">
                  <p className="text-accent text-xs font-serif tracking-[0.25em] uppercase font-medium">
                    {perfume.brand || 'Brand'}
                  </p>
                  <h1 className="font-serif text-4xl md:text-5xl text-black leading-tight">
                    {perfume.name}
                  </h1>
                </div>

                {/* Meta Pills */}
                {(perfume.gender || perfume.release_year) && (
                  <div className="flex gap-2.5 flex-wrap">
                    {perfume.gender && (
                      <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-100 font-serif">{perfume.gender}</span>
                    )}
                    {perfume.release_year && (
                      <span className="px-4 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-100 font-serif">{perfume.release_year}</span>
                    )}
                  </div>
                )}

                {/* Rating & Stats */}
                <div className="space-y-5 py-6 border-t border-b border-gray-100">
                  {rating > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < Math.floor(rating) ? 'text-accent' : 'text-gray-200'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-800 text-lg font-serif ml-2">{rating.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm">/ 5</span>
                      </div>
                      {perfume.votes > 0 && (
                        <span className="text-gray-400 text-sm">
                          ({perfume.votes.toLocaleString()} votes)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Longevity & Sillage */}
                  <div className="flex gap-8">
                    {perfume.longevity && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-medium mb-1">Longevity</p>
                        <p className="text-sm text-gray-800 font-medium">{perfume.longevity}</p>
                      </div>
                    )}
                    {perfume.sillage && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-medium mb-1">Sillage</p>
                        <p className="text-sm text-gray-800 font-medium">{perfume.sillage}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {perfume.description && (
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg text-black">About this Fragrance</h3>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-4">
                      {perfume.description}
                    </p>
                  </div>
                )}

                {/* Collection Buttons */}
                <CollectionButtons perfumeId={perfume.id} />

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCopyUrl}
                    className="flex-1 btn-secondary text-sm"
                  >
                    {copied ? (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> Share</>
                    )}
                  </button>
                  {perfume.perfume_url && (
                    <a
                      href={perfume.perfume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-primary text-sm"
                    >
                      View Source
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scent Pyramid Section */}
        {hasNotes && (
          <section className="py-20 bg-light-bg">
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
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="font-serif text-3xl text-black mb-6">Full Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {perfume.description}
              </p>
            </div>
          </section>
        )}

        {/* Related Fragrances */}
        {suggestions && suggestions.length > 0 && (
          <section className="py-20 bg-light-bg">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center space-y-3 mb-12">
                <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">More to Explore</p>
                <h2 className="font-serif text-3xl text-black">Related Fragrances</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {suggestions.slice(0, 3).map((frag, idx) => (
                  <Link key={frag.id || idx} href={`/perfume/${frag.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 card-hover">
                    <div className="bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
                      {frag.image_url ? (
                        <img
                          src={frag.image_url}
                          alt={frag.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-accent">✦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-accent text-[10px] font-serif uppercase tracking-[0.2em] mb-1.5">{frag.brand}</p>
                      <p className="font-serif text-sm text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
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
