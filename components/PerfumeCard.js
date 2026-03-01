import Image from 'next/image';
import Link from 'next/link';

export default function PerfumeCard({ perfume, featured = false }) {
  if (!perfume) return null;

  const rating = parseFloat(perfume.rating) || 0;
  const allNotes = [
    ...(perfume.notes_top || []),
    ...(perfume.notes_middle || []),
    ...(perfume.notes_base || []),
  ];

  return (
    <Link href={`/perfume/${perfume.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white border border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-300 overflow-hidden">
          
          {/* Image Container */}
          <div className="bg-gray-100 aspect-square overflow-hidden relative flex-shrink-0">
            {perfume.image_url ? (
              <img
                src={perfume.image_url}
                alt={perfume.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-sm font-serif">✦</p>
                  <p className="text-gray-400 text-xs mt-2">Fragrance</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-grow flex flex-col">
            
            {/* Info section */}
            <div className="space-y-3">
              {/* Brand */}
              <p className="text-accent text-xs font-serif tracking-widest uppercase">
                {perfume.brand || 'Unknown Brand'}
              </p>

              {/* Title */}
              <h3 className="font-serif text-lg text-black line-clamp-2 group-hover:text-accent transition-colors">
                {perfume.name || 'Unknown Fragrance'}
              </h3>

              {/* Gender & Year */}
              {(perfume.gender || perfume.release_year) && (
                <p className="text-xs text-gray-500">
                  {[perfume.gender, perfume.release_year].filter(Boolean).join(' · ')}
                </p>
              )}

              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(rating) ? 'text-accent' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">{rating.toFixed(1)}</span>
                  {perfume.votes > 0 && (
                    <span className="text-gray-400 text-xs">({perfume.votes})</span>
                  )}
                </div>
              )}

              {/* Notes Preview */}
              {allNotes.length > 0 && (
                <div className="pt-2 text-xs text-gray-500 space-y-1">
                  <p className="font-serif font-semibold text-gray-700">Notes:</p>
                  <p className="line-clamp-2">
                    {allNotes.slice(0, 4).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* CTA - always pinned to bottom */}
            <div className="mt-auto pt-4">
              <button className="w-full py-2 border border-accent text-accent text-sm font-serif tracking-wide hover:bg-accent hover:text-white transition-colors">
                EXPLORE
              </button>
            </div>
          </div>
        </div>
    </Link>
  );
}
