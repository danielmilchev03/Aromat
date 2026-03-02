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
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400 overflow-hidden card-hover">
          
          {/* Image Container */}
          <div className="bg-gray-50 aspect-[4/5] overflow-hidden relative flex-shrink-0">
            {perfume.image_url ? (
              <Image
                src={perfume.image_url}
                alt={perfume.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent text-lg">✦</span>
                  </div>
                  <p className="text-gray-400 text-xs">No Image</p>
                </div>
              </div>
            )}

            {/* Rating Badge - overlaid on image */}
            {rating > 0 && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                <span className="text-accent text-sm">★</span>
                <span className="text-gray-800 text-xs font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-grow flex flex-col">
            
            {/* Info section */}
            <div className="space-y-2">
              {/* Brand */}
              <p className="text-accent text-[11px] font-serif tracking-[0.2em] uppercase font-medium">
                {perfume.brand || 'Unknown Brand'}
              </p>

              {/* Title */}
              <h3 className="font-serif text-lg text-gray-900 leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
                {perfume.name || 'Unknown Fragrance'}
              </h3>

              {/* Gender & Year */}
              {(perfume.gender || perfume.release_year) && (
                <p className="text-xs text-gray-400">
                  {[perfume.gender, perfume.release_year].filter(Boolean).join(' · ')}
                </p>
              )}

              {/* Notes Preview */}
              {allNotes.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {allNotes.slice(0, 3).map((note, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-medium rounded-full border border-gray-100">
                      {note}
                    </span>
                  ))}
                  {allNotes.length > 3 && (
                    <span className="px-2.5 py-1 text-gray-400 text-[10px] font-medium">
                      +{allNotes.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CTA - always pinned to bottom */}
            <div className="mt-auto pt-4">
              <div className="w-full py-2.5 text-center border border-gray-200 text-gray-600 text-xs font-serif tracking-wider uppercase rounded-lg group-hover:border-accent group-hover:text-accent group-hover:bg-accent/5 transition-all duration-300">
                Explore
              </div>
            </div>
          </div>
        </div>
    </Link>
  );
}
