/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent': {
          DEFAULT: '#D4AF37',
          50: '#fdf8e8',
          100: '#faf0c8',
          200: '#f0d060',
          300: '#e4c444',
          400: '#D4AF37',
          500: '#c9a42f',
          600: '#b8942e',
          700: '#8a6f22',
          800: '#5c4a17',
          900: '#2e250b',
        },
        'dark-bg': '#1a1a1a',
        'light-bg': '#fafaf9',
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'Garamond', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'gold': '0 4px 14px -2px rgba(212, 175, 55, 0.25)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
