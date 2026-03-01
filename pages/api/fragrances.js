import { getPerfumes, getTopRatedPerfumes, getRandomPerfumes } from '../../lib/api';

export default async function handler(req, res) {
  const { type = 'featured', limit = 12, offset = 0 } = req.query;

  try {
    let results;
    
    switch (type) {
      case 'toprated':
        results = await getTopRatedPerfumes(parseInt(limit));
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
