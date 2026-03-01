import { useState } from 'react';

const GENDER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'Women', label: 'Women' },
  { id: 'Men', label: 'Men' },
  { id: 'Unisex', label: 'Unisex' },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'rating-desc', label: 'Highest Rated' },
  { id: 'rating-asc', label: 'Lowest Rated' },
  { id: 'votes-desc', label: 'Most Votes' },
  { id: 'name-asc', label: 'Name A–Z' },
  { id: 'name-desc', label: 'Name Z–A' },
  { id: 'year-desc', label: 'Newest First' },
  { id: 'year-asc', label: 'Oldest First' },
];

/**
 * Reusable filter bar for perfume lists.
 *
 * Props:
 *  - brands: string[]           – list of unique brands
 *  - filters: object            – current filter state { gender, brand, sort }
 *  - onChange: (filters) => void – called whenever any filter changes
 *  - showSort: boolean          – whether to show sort dropdown (default true)
 */
export default function FilterBar({ brands = [], filters, onChange, showSort = true }) {
  const [expanded, setExpanded] = useState(false);

  const { gender = 'all', brand = 'all', sort = 'default' } = filters;

  const update = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const activeCount = [gender !== 'all', brand !== 'all', sort !== 'default'].filter(Boolean).length;

  return (
    <section className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Toggle button for mobile */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="md:hidden flex items-center gap-2 text-sm font-serif text-gray-700 mb-4"
        >
          <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        <div className={`${expanded ? 'block' : 'hidden'} md:block space-y-6`}>
          {/* Gender Filter */}
          <div>
            <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-3">Gender</h3>
            <div className="flex gap-3 flex-wrap">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => update('gender', opt.id)}
                  className={`px-5 py-2 text-sm font-serif transition-colors ${
                    gender === opt.id
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div>
              <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-3">Brand</h3>
              <select
                value={brand}
                onChange={(e) => update('brand', e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 text-sm font-serif text-gray-700 bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort */}
          {showSort && (
            <div>
              <h3 className="font-serif text-sm text-gray-700 uppercase tracking-widest mb-3">Sort By</h3>
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 text-sm font-serif text-gray-700 bg-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters */}
          {activeCount > 0 && (
            <button
              onClick={() => onChange({ gender: 'all', brand: 'all', sort: 'default' })}
              className="text-sm text-accent hover:underline font-serif"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Apply filters and sorting to a perfume array.
 * Use this helper in pages alongside <FilterBar />.
 */
export function applyFilters(perfumes, filters) {
  const { gender = 'all', brand = 'all', sort = 'default' } = filters;

  let result = [...perfumes];

  // Gender filter
  if (gender !== 'all') {
    result = result.filter((p) => p.gender === gender);
  }

  // Brand filter
  if (brand !== 'all') {
    result = result.filter((p) => p.brand === brand);
  }

  // Sort
  switch (sort) {
    case 'rating-desc':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'rating-asc':
      result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      break;
    case 'votes-desc':
      result.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      break;
    case 'name-asc':
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'name-desc':
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'year-desc':
      result.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
      break;
    case 'year-asc':
      result.sort((a, b) => (a.release_year || 0) - (b.release_year || 0));
      break;
    default:
      break;
  }

  return result;
}

/**
 * Extract unique brands from a perfumes array.
 */
export function extractBrands(perfumes) {
  const brands = new Set();
  perfumes.forEach((p) => {
    if (p.brand) brands.add(p.brand);
  });
  return Array.from(brands).sort();
}
