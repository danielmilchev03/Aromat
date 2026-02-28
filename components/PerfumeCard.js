import Image from 'next/image';
import Link from 'next/link';
import { cleanText } from '../lib/perfumeData';

export default function PerfumeCard({ perfume, featured = false }) {
  if (!perfume) return null;

  // Helper to parse notes from various formats
  const parseNotes = (notesData) => {
    if (!notesData) return [];
    if (Array.isArray(notesData)) {
      return notesData.map(cleanText).filter(n => n);
    }
    // If string representation of list like "['note1', 'note2', ...]"
    const noteString = String(notesData);
    const cleanedString = noteString.replace(/^\[|\]$/g, '');
    return cleanedString
      .split(',')
      .map(cleanText)
      .filter(n => n);
  };

  const rating = parseFloat(perfume.rating) || 0;
  const imageUrl = perfume.url || '/placeholder-perfume.png';

  return (
    <Link href={`/perfume/${encodeURIComponent(perfume.title)}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white border border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-300 overflow-hidden">
          
          {/* Image Container */}
          <div className="bg-gray-100 aspect-square overflow-hidden relative flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-sm font-serif">✦</p>
                <p className="text-gray-400 text-xs mt-2">Fragrance</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3 flex-grow flex flex-col">
            
            {/* Brand */}
            <p className="text-accent text-xs font-serif tracking-widest uppercase">
              {perfume.designer || 'Unknown Brand'}
            </p>

            {/* Title */}
            <h3 className="font-serif text-lg text-black line-clamp-2 group-hover:text-accent transition-colors">
              {perfume.title || 'Unknown Fragrance'}
            </h3>

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
              </div>
            )}

            {/* Notes Preview */}
            {perfume.notes && (
              <div className="pt-2 text-xs text-gray-500 space-y-1">
                <p className="font-serif font-semibold text-gray-700">Notes:</p>
                <p className="line-clamp-2">
                  {parseNotes(perfume.notes).slice(0, 3).join(', ')}
                </p>
              </div>
            )}

            {/* CTA */}
            <button className="w-full mt-auto py-2 border border-accent text-accent text-sm font-serif tracking-wide hover:bg-accent hover:text-white transition-colors">
              EXPLORE
            </button>
          </div>
        </div>
    </Link>
  );
}
