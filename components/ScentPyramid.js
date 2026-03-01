export default function ScentPyramid({ notes_top = [], notes_middle = [], notes_base = [] }) {
  const hasNotes = notes_top.length > 0 || notes_middle.length > 0 || notes_base.length > 0;

  if (!hasNotes) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No scent information available</p>
      </div>
    );
  }

  const totalNotes = notes_top.length + notes_middle.length + notes_base.length;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="font-serif text-4xl text-black mb-2">Scent Pyramid</h2>
        <p className="text-gray-600 text-sm">The fragrance unfolds in three stages</p>
      </div>

      {/* Pyramid Visualization */}
      <div className="flex flex-col items-center space-y-8 py-12">
        
        {/* Top Notes */}
        {notes_top.length > 0 && (
          <div className="w-full">
            <div className="max-w-xs mx-auto">
              <div className="bg-gradient-to-b from-accent/10 to-accent/5 border-2 border-accent p-6 text-center">
                <h3 className="font-serif text-sm text-accent uppercase tracking-widest mb-3">Top Notes</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  The initial impression. Lasts 5-15 minutes.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {notes_top.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-accent px-3 py-1 text-xs text-accent font-serif rounded"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Arrow Down */}
        {notes_top.length > 0 && notes_middle.length > 0 && (
          <div className="text-2xl text-gray-300">↓</div>
        )}

        {/* Heart Notes */}
        {notes_middle.length > 0 && (
          <div className="w-full">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-b from-gray-100/50 to-gray-50/50 border-2 border-gray-400 p-8 text-center">
                <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-3">Heart / Middle Notes</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  The core of the fragrance. Emerges after top notes fade, lasts 2-8 hours.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {notes_middle.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-gray-400 px-4 py-2 text-xs text-gray-700 font-serif rounded"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Arrow Down */}
        {notes_middle.length > 0 && notes_base.length > 0 && (
          <div className="text-2xl text-gray-300">↓</div>
        )}

        {/* Base Notes */}
        {notes_base.length > 0 && (
          <div className="w-full">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-b from-gray-200/30 to-gray-300/20 border-2 border-gray-600 p-8 text-center">
                <h3 className="font-serif text-sm text-gray-800 uppercase tracking-widest mb-3">Base Notes</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  The final layers. Longer lasting, provides depth and warmth. Lasts 4-24 hours.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {notes_base.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-gray-600 px-4 py-2 text-xs text-gray-800 font-serif rounded"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Card */}
      <div className="bg-gray-50 border border-gray-200 p-8 text-center space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-serif font-semibold">Total Notes: </span>
          {totalNotes} fragrance components create this unique composition.
        </p>
        <p className="text-xs text-gray-500">
          The pyramid represents how a fragrance evolves over time as different notes become more prominent.
        </p>
      </div>
    </div>
  );
}
