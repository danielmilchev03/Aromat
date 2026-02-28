# Aromat - Quick Start Guide

## 🚀 Getting Started

### 1. **Run the Development Server**
```bash
npm run dev
```
Visit: **http://localhost:3000**

### 2. **Navigate the Application**

#### Homepage (`/`)
- Elegant hero section with search bar
- Click "View Gallery" to browse all fragrances

#### Gallery (`/gallery`)
- Browse featured and top-rated fragrances
- Filter by brand
- Click any fragrance to view details

#### Product Page (`/perfume/[title]`)
- Full fragrance details
- Scent pyramid visualization
- Community reviews
- Related fragrances

#### Search (`/search?q=query`)
- Dynamic search results
- Click suggestions from search bar
- Or submit search form

---

## 🎨 Key Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage with hero and search |
| `/gallery` | Browse all fragrances |
| `/perfume/[title]` | Individual fragrance page |
| `/search?q=query` | Search results |
| `/api/search` | API endpoint for search |
| `/api/fragrances` | API endpoint for featured fragrances |
| `/api/brands` | API endpoint for brands list |

---

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Project Structure Tree
```
Aromat/
├── pages/              # Next.js pages & routes
├── components/         # React components
├── lib/               # Utility functions
├── styles/            # Global CSS & Tailwind
├── public/            # Static assets
├── perfumes.json      # Fragrance database
└── [config files]     # Configuration
```

---

## 🎯 Use Cases

### Search for a Fragrance
1. Go to homepage
2. Type fragrance name, brand, or note in search bar
3. Click a suggestion or press Search
4. View results in gallery view

### Browse Collections
1. Click "View Gallery" from homepage
2. Select "Featured" or "Top Rated"
3. Optionally filter by brand
4. Click a fragrance to view details

### View Fragrance Details
1. Click any fragrance card
2. See full product page with:
   - Fragrance details
   - Scent pyramid
   - Community reviews
   - Related fragrances

### Share a Fragrance
1. On product page, click "Share" button
2. Fragrance URL is copied to clipboard
3. Share with friends

---

## 📊 Data Insights

**Fragrance Database:**
- **File**: perfumes.json
- **Size**: ~310MB (very large!)
- **Format**: JSON array of fragrance objects
- **Caching**: In-memory after first load

**Available Information per Fragrance:**
- Title (Name + Brand)
- Designer/Brand
- Description
- Notes (Top, Heart, Base)
- Rating (1-5 stars)
- Community Reviews
- Source URL

---

## 🎨 Customization

### Change Accent Color
Edit `tailwind.config.js`:
```javascript
colors: {
  'accent': '#D4AF37', // Change this to a new hex color
}
```

### Change Serif Font
Edit `tailwind.config.js`:
```javascript
fontFamily: {
  serif: ['Your Font', 'serif'],
}
```

### Adjust Spacing
Edit responsive breakpoints in `tailwind.config.js`

### Modify Colors
Edit colors in `tailwind.config.js`

---

## 💾 Data Handler Functions

Located in `lib/perfumeData.js`:

```javascript
// Get all fragrances (optional: limit)
getAllPerfumes(10)

// Search by query
searchPerfumes("rose")

// Get by title
getPerfumeByTitle("Perfume Name")

// Get by brand
getPerfumesByDesigner("Dior")

// Get top rated
getTopRatedPerfumes(10)

// Get random selection
getRandomPerfumes(6)

// Get all brands
getUniqueBrands()

// Get all notes
getUniqueNotes()
```

---

## 🔍 Search Tips

### Search by Fragrance Name
```
"Aqua di Gio"
"Chanel No. 5"
```

### Search by Brand
```
"Dior"
"Chanel"
"Calvin Klein"
```

### Search by Note
```
"rose"
"vanilla"
"musk"
"citrus"
```

### Combined Search
Results match ANY of:
- Fragrance title
- Brand name
- Fragrance notes

---

## 📱 Responsive Design

Fully responsive across:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

---

## 🚀 Deployment

### Quick Deploy to Vercel
1. Push code to GitHub
2. Connect repo to Vercel
3. Vercel auto-deploys on push

### Deploy to Other Platforms
Requirements:
- Node.js 18+
- 512MB+ RAM
- npm packages installed

Commands:
```bash
npm install
npm run build
npm start
```

---

## 🐛 Troubleshooting

### Dev server not starting
```bash
# Clear Next.js cache
rm -r .next
npm run dev
```

### Build errors
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

### Large file performance issues
- First load may be slow due to 310MB perfumes.json
- Subsequent loads are cached
- Consider migrating to database for production

---

## 📚 Component Reference

### PerfumeCard
```jsx
<PerfumeCard perfume={perfume} featured={true} />
```

### ScentPyramid
```jsx
<ScentPyramid notes={perfume.notes} />
```

### SearchBar
```jsx
<SearchBar />
```

### Footer
```jsx
<Footer />
```

---

## 🎯 Next Steps

1. **Customize Design**: Modify tailwind.config.js
2. **Add More Data**: Update perfumes.json
3. **Create User Accounts**: Add authentication
4. **Migrate Database**: Move to MongoDB/PostgreSQL
5. **Add Images**: Integrate CDN for fragrance images
6. **Deploy**: Push to production

---

## 📞 Support Resources

- **Files**: Check inline comments in code
- **Documentation**: Read IMPLEMENTATION.md
- **Examples**: Review existing components

---

## Welcome to Aromat! 🌹

Your modern fragrance encyclopedia is ready to launch. Happy fragrance shopping! ✨
