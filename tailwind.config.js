/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#D4AF37', // Gold
        'dark-bg': '#1a1a1a',
        'light-bg': '#f8f8f8',
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'Garamond', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
