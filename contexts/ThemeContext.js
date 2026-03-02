import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEMES = ['ivory', 'noir', 'midnight'];

const ThemeContext = createContext({
  theme: 'ivory',
  setTheme: () => {},
  themes: THEMES,
  mounted: false,
});

/** Apply the correct CSS classes on <html> for the active theme.
 *  When `animate` is true, a temporary `theme-transition` class is added
 *  so all colour properties morph smoothly in both directions.
 */
function applyThemeClasses(theme, animate = false) {
  const root = document.documentElement;

  if (animate) {
    root.classList.add('theme-transition');
  }

  root.classList.remove('dark', 'midnight');
  if (theme === 'noir') {
    root.classList.add('dark');
  } else if (theme === 'midnight') {
    root.classList.add('dark', 'midnight');
  }

  if (animate) {
    // Remove the transition class after the animation completes
    // so it doesn't interfere with normal hover / interaction transitions.
    const id = setTimeout(() => root.classList.remove('theme-transition'), 500);
    // Store id so we can cancel if the user switches again quickly
    if (applyThemeClasses._tid) clearTimeout(applyThemeClasses._tid);
    applyThemeClasses._tid = id;
  }
}

/** Migrate legacy localStorage values ('light' / 'dark') to new names. */
function migrateTheme(saved) {
  if (saved === 'light') return 'ivory';
  if (saved === 'dark') return 'noir';
  if (THEMES.includes(saved)) return saved;
  return 'ivory';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('ivory');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('aromat-theme') || 'ivory';
    const resolved = migrateTheme(raw);
    setThemeState(resolved);
    applyThemeClasses(resolved);
    if (raw !== resolved) localStorage.setItem('aromat-theme', resolved);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
    localStorage.setItem('aromat-theme', next);
    applyThemeClasses(next, true);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
