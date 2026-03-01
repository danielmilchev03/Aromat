/**
 * @deprecated This file is kept for backwards compatibility.
 * All data now comes from PerfumAPI via lib/api.js
 * 
 * See: https://github.com/seccaz/PerfumAPI
 */

export {
  getPerfumes as getAllPerfumes,
  searchPerfumes,
  getRandomPerfumes,
  getTopRatedPerfumes,
  getUniqueBrands,
  normalizePerfume,
} from './api';

// No-op cleanText (PerfumAPI data is already clean)
export const cleanText = (text) => {
  if (!text) return '';
  return String(text).trim();
};
