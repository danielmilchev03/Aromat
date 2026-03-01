import { getPerfumes, getPerfumeById, getTopRatedPerfumes, getRandomPerfumes } from '../../lib/api';

export default async function handler(req, res) {
  const { type = 'featured', limit = 12, offset = 0, id, gender = 'all' } = req.query;

  try {
    // Single perfume lookup by id
    if (id) {
      const perfume = await getPerfumeById(id);
      if (!perfume) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(perfume);
    }

    let results;
    
    switch (type) {
      case 'toprated':
        results = await getTopRatedPerfumes(parseInt(limit), gender);
        res.status(200).json(results);
        break;
      case 'all': {
        const data = await getPerfumes(parseInt(limit), parseInt(offset));
        res.status(200).json(data);
        break;
      }
      case 'featured':
      default:
        results = await getRandomPerfumes(parseInt(limit));
        res.status(200).json(results);
    }
  } catch (error) {
    console.error('Error fetching fragrances:', error);
    res.status(500).json({ error: 'Failed to fetch fragrances from PerfumAPI' });
  }
}
