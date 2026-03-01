export default function ScentPyramid({ notes_top = [], notes_middle = [], notes_base = [] }) {
  const hasNotes = notes_top.length > 0 || notes_middle.length > 0 || notes_base.length > 0;

  if (!hasNotes) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-400">No scent information available</p>
      </div>
    );
  }

  const layers = [
    {
      title: 'Top Notes',
      subtitle: 'The opening. First 5–15 minutes.',
      notes: notes_top,
      color: 'accent',
      bgClass: 'bg-accent/5 border-accent/20',
      tagClass: 'bg-accent/10 text-accent border-accent/20',
      icon: '△',
      width: 'max-w-sm',
    },
    {
      title: 'Heart Notes',
      subtitle: 'The core. Emerges after 15 min, lasts 2–4 hours.',
      notes: notes_middle,
      color: 'gray-600',
      bgClass: 'bg-gray-50 border-gray-200',
      tagClass: 'bg-white text-gray-700 border-gray-200',
      icon: '◇',
      width: 'max-w-md',
    },
    {
      title: 'Base Notes',
      subtitle: 'The foundation. Rich, warm, lasting 4–24 hours.',
      notes: notes_base,
      color: 'gray-800',
      bgClass: 'bg-gray-100/50 border-gray-300',
      tagClass: 'bg-white text-gray-800 border-gray-300',
      icon: '▽',
      width: 'max-w-lg',
    },
  ].filter(layer => layer.notes.length > 0);

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Composition</p>
        <h2 className="font-serif text-3xl md:text-4xl text-black">Scent Pyramid</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">How this fragrance unfolds over time</p>
      </div>

      {/* Pyramid Layers */}
      <div className="flex flex-col items-center gap-4 py-8">
        {layers.map((layer, layerIdx) => (
          <div key={layer.title} className={`w-full ${layer.width} mx-auto animate-fade-in-up`} style={{ animationDelay: `${layerIdx * 150}ms` }}>
            <div className={`rounded-2xl border ${layer.bgClass} p-6 md:p-8 text-center transition-all duration-300 hover:shadow-soft`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`text-${layer.color} text-sm`}>{layer.icon}</span>
                <h3 className={`font-serif text-sm text-${layer.color} uppercase tracking-[0.2em]`}>
                  {layer.title}
                </h3>
              </div>
              <p className="text-xs text-gray-400 mb-5">{layer.subtitle}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {layer.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className={`${layer.tagClass} border px-3.5 py-1.5 text-xs font-serif rounded-full transition-all duration-200 hover:scale-105`}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Connector */}
            {layerIdx < layers.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-px h-4 bg-gray-200" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
