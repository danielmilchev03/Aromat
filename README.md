# Aromat — Modern Fragrance Encyclopedia

A sleek, high-end fragrance encyclopedia built with Next.js, Tailwind CSS, and PostgreSQL. Designed as an elegant alternative to Fragrantica with a focus on clean design, personal collections, and an excellent user experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (JavaScript, Pages Router) |
| **Styling** | Tailwind CSS 3 + Google Fonts (EB Garamond / Inter) |
| **Database** | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| **Auth** | NextAuth.js 4 (Google OAuth) with Prisma Adapter |
| **Perfume Data** | [PerfumAPI](https://perfumapidatabase.onrender.com) (external REST API) |
| **Design** | 3-theme system (Ivory / Noir / Midnight), serif typography, luxury aesthetic |

## Project Structure

```
aromat/
├── pages/
│   ├── _app.js                      # Root component + providers
│   ├── _document.js                 # Custom HTML document
│   ├── index.js                     # Homepage with hero & search
│   ├── gallery.js                   # Browse fragrances
│   ├── search.js                    # Search results
│   ├── about.js                     # About Aromat
│   ├── contact.js                   # Contact form
│   ├── privacy.js                   # Privacy policy
│   ├── profile.js                   # User profile & collection
│   ├── auth/
│   │   ├── signin.js               # Custom sign-in page
│   │   └── error.js                # Auth error page
│   ├── collections/
│   │   ├── most-popular.js         # Most popular fragrances
│   │   ├── new-arrivals.js         # New arrivals
│   │   └── top-rated.js            # Top rated fragrances
│   ├── perfume/
│   │   └── [id].js                 # Individual perfume page
│   └── api/
│       ├── search.js               # Search API
│       ├── brands.js               # Brands API
│       ├── fragrances.js           # Fragrances API
│       ├── collection.js           # Collection CRUD API
│       └── auth/
│           └── [...nextauth].js    # NextAuth config
├── components/
│   ├── Navbar.js                   # Sticky nav with mobile menu
│   ├── Footer.js                   # Site footer
│   ├── PerfumeCard.js              # Fragrance card component
│   ├── ScentPyramid.js             # Top/Heart/Base notes viz
│   ├── SearchBar.js                # Search with auto-suggestions
│   ├── CollectionButtons.js        # Have It / Want It / Had It
│   ├── FilterBar.js                # Gender, brand & sort filters
│   └── ThemeToggle.js              # 3-theme switcher
├── contexts/
│   └── ThemeContext.js             # Theme state + localStorage
├── lib/
│   ├── api.js                      # PerfumAPI client functions
│   ├── perfumeData.js              # Data utilities & text cleaning
│   └── prisma.js                   # Prisma client singleton
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── prisma.config.ts            # Prisma config
│   └── migrations/                 # Database migrations
├── styles/
│   └── globals.css                 # Global styles & Tailwind
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)
- Google OAuth credentials (for authentication)

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host:5432/aromat?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Installation

```bash
npm install
npx prisma migrate deploy
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production

```bash
npm run build
npm start
```

The build script automatically runs `prisma generate` and `prisma migrate deploy` before `next build`.

## Features

### Fragrance Browsing
- **Gallery** — responsive grid with brand & rating display
- **Search** — by name, brand, or fragrance notes with real-time suggestions
- **Perfume Detail** — full info, scent pyramid visualization, related fragrances

### Curated Collections
- **Most Popular** — sorted by community votes
- **Top Rated** — sorted by rating
- **New Arrivals** — sorted by release year

### Filtering & Sorting
- Gender filter (All / Women / Men / Unisex)
- Brand dropdown filter
- Sort by rating, votes, name, or year

### Authentication
- Google OAuth sign-in via NextAuth.js
- Custom sign-in and error pages
- Session-aware navigation with profile dropdown

### Personal Collection
- **I Have It / I Want It / I've Had It** — track fragrances per user
- Collection stored in PostgreSQL via Prisma
- Manage from perfume pages or the profile page

### Theming
- **Ivory** — warm light theme
- **Noir** — dark theme with silver accents
- **Midnight** — cool dark steel theme
- Persisted to `localStorage`, applied via CSS classes

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/search?q=query&limit=5` | Search perfumes with suggestions |
| `GET /api/fragrances?type=featured&limit=12` | Featured or top-rated fragrances |
| `GET /api/brands` | All unique brands |
| `GET/POST/PUT/DELETE /api/collection` | User collection CRUD (authenticated) |

### Static Pages
- **About** — philosophy and mission
- **Contact** — contact form
- **Privacy** — privacy policy

## Database Schema

Managed by Prisma with PostgreSQL:

- **User** — id, name, email, image, timestamps
- **Account** — OAuth account linking (NextAuth)
- **Session** — session management (NextAuth)
- **Collection** — user fragrance shelf (`perfumeId`, `status`: HAVE / WANT / HAD)
- **VerificationToken** — NextAuth verification

## Design System

### Themes
| Theme | Background | Accent | Feel |
|-------|-----------|--------|------|
| Ivory | Warm white | Gold (#D4AF37) | Light, luxurious |
| Noir | Dark (#1a1a1a) | Silver | Dark, elegant |
| Midnight | Cool dark | Steel blue | Cool, modern |

### Typography
- **Headers**: EB Garamond (serif) — full Cyrillic + Latin support
- **Body**: Inter (sans-serif) — clean readability

### Layout
- Mobile-first responsive design
- Sticky scroll-aware navbar with hamburger menu
- Max content width: 72rem
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
