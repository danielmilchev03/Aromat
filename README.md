# Aromat - Modern Fragrance Encyclopedia

A sleek, minimalist fragrance encyclopedia built with Next.js and Tailwind CSS. Designed to be a more elegant alternative to Fragrantica with a focus on clean design and excellent user experience.

## Tech Stack

- **Framework**: Next.js (JavaScript, Pages Router)
- **Styling**: Tailwind CSS
- **Database**: Local JSON file (perfumes.json) - structured for easy migration to MongoDB/PostgreSQL
- **Design Philosophy**: Monochrome palette (Black/White/Gray) with Gold accent color, Serif typography

## Project Structure

```
aromat/
├── pages/
│   ├── api/
│   │   └── search.js                # Search API endpoint
│   ├── _app.js                      # Next.js app wrapper
│   └── index.js                     # Homepage
├── components/
│   └── SearchBar.js                 # Search component
├── lib/
│   └── perfumeData.js               # Data provider utility
├── styles/
│   └── globals.css                  # Global styles & Tailwind
├── perfumes.json                    # Fragrance database
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── .eslintrc.json
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

```bash
npm run build
npm start
```

## Features

### Data Handler (`lib/perfumeData.js`)

- `getAllPerfumes(limit)` - Get all perfumes or limited set
- `searchPerfumes(query)` - Search by name, brand, or notes
- `getPerfumeByTitle(title)` - Get single perfume
- `getPerfumesByDesigner(designer)` - Filter by brand
- `getTopRatedPerfumes(limit)` - Get highest-rated fragrances
- `getRandomPerfumes(limit)` - Get random selection
- `getUniqueBrands()` - Get all unique brands
- `getUniqueNotes()` - Get all unique fragrance notes

### API Endpoints

- `GET /api/search?q=query&limit=5` - Search perfumes with suggestions

## Perfumes.json Structure

Each perfume object contains:
```javascript
{
  "title": "Perfume Name Brand",
  "designer": "Brand Name",
  "description": "Detailed description",
  "notes": ["Top Notes", "Heart Notes", "Base Notes"],
  "rating": "4.5",
  "reviews": ["Review 1", "Review 2"],
  "url": "https://...",
  "image": "url_to_image"
}
```

## Design System

### Colors
- **Primary**: Black (#1a1a1a) and White (#ffffff)
- **Accent**: Gold (#D4AF37)
- **Neutral Backgrounds**: Light Gray (#f8f8f8)

### Typography
- **Titles & Headlines**: Georgia/Garamond (Serif)
- **Body**: System fonts (clean sans-serif)
- **Letter Spacing**: Added to headers for luxury feel

### Spacing & Layout
- Maximum content width: 72rem (6xl)
- Abundant white space for elegant feel
- Responsive grid layouts (mobile-first)

## Upcoming Features

- ✅ Homepage with hero & search
- Gallery with responsive perfume cards
- Product pages with scent pyramids
- Advanced search and filtering
- User ratings and reviews
- Wishlist functionality
- Comparison tool
- Brand pages

## Development Notes

- The `perfumes.json` file is 310MB+ and structured for caching
- Data is cached in memory after first load for performance
- All search operations are case-insensitive
- Use trailing `.js` in imports (Next.js Pages Router requirement)

## License

MIT
