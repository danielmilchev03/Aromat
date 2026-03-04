/**
 * PerfumAPI Client
 * Connects to the PerfumAPI (https://github.com/seccaz/PerfumAPI)
 * 
 * API Base URL is configured via NEXT_PUBLIC_PERFUMAPI_URL env variable.
 */

const API_BASE = process.env.NEXT_PUBLIC_PERFUMAPI_URL || 'https://perfumapidatabase.onrender.com';

/**
 * Simple in-memory cache with TTL
 * Prevents redundant API calls for frequently requested data.
 */
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Generic fetch wrapper with error handling and caching
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();

  // Only cache GET requests
  if (method === 'GET') {
    const cached = getCached(url);
    if (cached) return cached;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (method === 'GET') {
      setCache(url, data);
    }

    return data;
  } catch (error) {
    console.error(`PerfumAPI fetch error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Get paginated list of perfumes
 * GET /perfumes?limit=100&offset=0
 * Returns: { total, limit, offset, perfumes[] }
 */
export async function getPerfumes(limit = 100, offset = 0) {
  const data = await apiFetch(`/perfumes?limit=${limit}&offset=${offset}`);
  return data;
}

/**
 * Get a single perfume by UUID
 * GET /perfumes/{perfume_id}
 */
export async function getPerfumeById(id) {
  const data = await apiFetch(`/perfumes/${id}`);
  return data;
}

/**
 * Search perfumes by name or brand
 * GET /perfumes/search/{query}?limit=50
 * Returns: PerfumeResponse[]
 */
export async function searchPerfumes(query, limit = 50) {
  const data = await apiFetch(`/perfumes/search/${encodeURIComponent(query)}?limit=${limit}`);
  return data;
}

/**
 * Get database statistics
 * GET /stats
 * Returns: { total_perfumes, database, source }
 */
export async function getStats() {
  const data = await apiFetch('/stats');
  return data;
}

/**
 * Get random perfumes (fetches a larger set and shuffles client-side)
 * PerfumAPI doesn't have a random endpoint, so we fetch and shuffle.
 */
export async function getRandomPerfumes(count = 6) {
  try {
    // Fetch a larger pool and pick random ones
    const data = await getPerfumes(200, 0);
    const perfumes = data.perfumes || [];
    
    // Fisher-Yates shuffle
    const shuffled = [...perfumes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error getting random perfumes:', error);
    return [];
  }
}

/**
 * Get top-rated perfumes (fetches and sorts by rating)
 * @param {number} count - Number of perfumes to return
 * @param {string} gender - Filter by gender: 'all', 'Women', 'Men', 'Unisex'
 */
export async function getTopRatedPerfumes(count = 12, gender = 'all') {
  try {
    const data = await getPerfumes(500, 0);
    let perfumes = data.perfumes || [];
    
    // Filter by gender before ranking
    if (gender && gender !== 'all') {
      perfumes = perfumes.filter(p => p.gender === gender);
    }

    return perfumes
      .filter(p => p.rating && p.rating > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, count);
  } catch (error) {
    console.error('Error getting top rated perfumes:', error);
    return [];
  }
}

/**
 * Get most popular perfumes (sorted by number of votes)
 */
export async function getMostPopularPerfumes(count = 24) {
  try {
    const data = await getPerfumes(500, 0);
    const perfumes = data.perfumes || [];

    return perfumes
      .filter(p => p.votes && p.votes > 0)
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, count);
  } catch (error) {
    console.error('Error getting most popular perfumes:', error);
    return [];
  }
}

/**
 * Get newest arrivals (sorted by release year, descending)
 */
export async function getNewArrivals(count = 24) {
  try {
    const data = await getPerfumes(500, 0);
    const perfumes = data.perfumes || [];

    return perfumes
      .filter(p => p.release_year && p.release_year > 0)
      .sort((a, b) => (b.release_year || 0) - (a.release_year || 0))
      .slice(0, count);
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    return [];
  }
}

/**
 * Get all perfumes by a specific brand name (case-insensitive)
 * @param {string} brandName - The brand name to filter by
 * @param {string} sort - Sort field: 'name', 'rating', 'year', 'votes' (default: 'name')
 */
export async function getPerfumesByBrand(brandName, sort = 'name') {
  try {
    const data = await getPerfumes(500, 0);
    const perfumes = data.perfumes || [];
    const query = brandName.toLowerCase().trim();

    const filtered = perfumes.filter(
      (p) => p.brand && p.brand.toLowerCase().trim() === query
    );

    // Sort results
    switch (sort) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'year':
        filtered.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
        break;
      case 'votes':
        filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    return filtered;
  } catch (error) {
    console.error('Error getting perfumes by brand:', error);
    return [];
  }
}

/**
 * Get unique brands from the database
 */
export async function getUniqueBrands() {
  try {
    const data = await getPerfumes(500, 0);
    const perfumes = data.perfumes || [];
    
    const brands = new Set();
    perfumes.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    
    return Array.from(brands).sort();
  } catch (error) {
    console.error('Error getting unique brands:', error);
    return [];
  }
}

/**
 * Search perfumes by note name
 * Fetches all perfumes and filters by matching notes (top, middle, base).
 */
export async function searchPerfumesByNote(note, limit = 50) {
  try {
    const data = await getPerfumes(500, 0);
    const perfumes = data.perfumes || [];
    const query = note.toLowerCase().trim();

    return perfumes
      .filter((p) => {
        const allNotes = [
          ...(p.notes_top || []),
          ...(p.notes_middle || []),
          ...(p.notes_base || []),
        ];
        return allNotes.some((n) => n.toLowerCase().includes(query));
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching perfumes by note:', error);
    return [];
  }
}

/**
 * Get all unique notes from the database
 */
export async function getAllNotes() {
  try {
    const data = await getPerfumes(500, 0);
    const perfumes = data.perfumes || [];
    const noteSet = new Set();

    perfumes.forEach((p) => {
      [...(p.notes_top || []), ...(p.notes_middle || []), ...(p.notes_base || [])].forEach((n) =>
        noteSet.add(n)
      );
    });

    return Array.from(noteSet).sort();
  } catch (error) {
    console.error('Error getting all notes:', error);
    return [];
  }
}

/**
 * Normalize a PerfumAPI perfume object to a consistent shape
 * This helps components reference fields consistently.
 */
export function normalizePerfume(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name || 'Unknown Fragrance',
    brand: p.brand || 'Unknown Brand',
    release_year: p.release_year,
    gender: p.gender,
    notes_top: p.notes_top || [],
    notes_middle: p.notes_middle || [],
    notes_base: p.notes_base || [],
    rating: p.rating ? parseFloat(p.rating) : 0,
    votes: p.votes || 0,
    description: p.description || '',
    longevity: p.longevity,
    sillage: p.sillage,
    image_url: p.image_url,
    perfume_url: p.perfume_url,
    created_at: p.created_at,
  };
}
