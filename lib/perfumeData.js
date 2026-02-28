/**
 * Clean text by removing array notation and special characters
 * Handles string representations of Python lists like "['item1', 'item2', ...]"
 */
export const cleanText = (text) => {
  if (!text) return '';
  
  let cleaned = String(text);
  
  // Remove array brackets and all quote types
  cleaned = cleaned.replace(/[\[\]'"`]/g, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
};

/**
 * Get the path to perfumes.json
 * Note: fs is only required on the server side
 */
const getPerfumesPath = () => {
  // This ensures fs is only imported on server-side
  return require('path').join(process.cwd(), 'perfumes.json');
};

/**
 * Read all perfumes from JSON with caching
 */
let cachedPerfumes = null;

export const getAllPerfumes = (limit = null) => {
  try {
    const fs = require('fs');
    if (!cachedPerfumes) {
      let fileContent = fs.readFileSync(getPerfumesPath(), 'utf-8');
      // Remove BOM (Byte Order Mark) if present
      if (fileContent.charCodeAt(0) === 0xFEFF) {
        fileContent = fileContent.slice(1);
      }
      cachedPerfumes = JSON.parse(fileContent);
    }

    if (limit) {
      return cachedPerfumes.slice(0, limit);
    }
    return cachedPerfumes;
  } catch (error) {
    console.error('Error reading perfumes.json:', error);
    return [];
  }
};

/**
 * Search perfumes by name, brand, or notes
 */
export const searchPerfumes = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const perfumes = getAllPerfumes();
  const lowerQuery = query.toLowerCase();

  return perfumes.filter((perfume) => {
    const titleMatch = perfume.title?.toLowerCase().includes(lowerQuery);
    const designerMatch = perfume.designer?.toLowerCase().includes(lowerQuery);
    
    let notesMatch = false;
    if (perfume.notes && Array.isArray(perfume.notes)) {
      notesMatch = perfume.notes.some(note => 
        note.toLowerCase().includes(lowerQuery)
      );
    }

    return titleMatch || designerMatch || notesMatch;
  });
};

/**
 * Get a single perfume by title
 */
export const getPerfumeByTitle = (title) => {
  const perfumes = getAllPerfumes();
  return perfumes.find(p => p.title?.toLowerCase() === title.toLowerCase());
};

/**
 * Get perfumes by designer/brand
 */
export const getPerfumesByDesigner = (designer) => {
  const perfumes = getAllPerfumes();
  return perfumes.filter(p => 
    p.designer?.toLowerCase() === designer.toLowerCase()
  );
};

/**
 * Get top-rated perfumes
 */
export const getTopRatedPerfumes = (limit = 10) => {
  const perfumes = getAllPerfumes();
  return perfumes
    .filter(p => p.rating && parseFloat(p.rating) > 0)
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, limit);
};

/**
 * Get random perfumes for featured section
 */
export const getRandomPerfumes = (limit = 6) => {
  const perfumes = getAllPerfumes();
  const shuffled = [...perfumes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
};

/**
 * Get unique designers
 */
export const getUniqueBrands = () => {
  const perfumes = getAllPerfumes();
  const brands = new Set();
  
  perfumes.forEach(p => {
    if (p.designer) {
      brands.add(p.designer);
    }
  });
  
  return Array.from(brands).sort();
};

/**
 * Get unique notes
 */
export const getUniqueNotes = () => {
  const perfumes = getAllPerfumes();
  const notesSet = new Set();
  
  perfumes.forEach(p => {
    if (p.notes && Array.isArray(p.notes)) {
      p.notes.forEach(note => {
        if (note) notesSet.add(note);
      });
    }
  });
  
  return Array.from(notesSet).sort();
};
