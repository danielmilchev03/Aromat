import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const themeConfig = {
  ivory: {
    label: 'Ivory',
    description: 'Light & warm',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  noir: {
    label: 'Noir',
    description: 'Dark & silver',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  midnight: {
    label: 'Midnight',
    description: 'Cool & steel',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
};

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const current = themeConfig[theme];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-accent transition-colors duration-200"
        aria-label="Change theme"
        title="Change theme"
      >
        {current.icon}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-gray-200/80 bg-white shadow-lg py-1.5 z-50 animate-scale-in origin-top-right">
          {Object.entries(themeConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setTheme(key); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors duration-150 ${
                theme === key
                  ? 'text-accent bg-accent/5'
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              <span className="flex-shrink-0 opacity-80">{cfg.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium leading-tight">{cfg.label}</span>
                <span className="block text-[11px] text-gray-400 leading-tight">{cfg.description}</span>
              </span>
              {theme === key && (
                <svg className="w-3.5 h-3.5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
