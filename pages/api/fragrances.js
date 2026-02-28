import { getRandomPerfumes, getTopRatedPerfumes } from '../../lib/perfumeData';

export default function handler(req, res) {
  const { type = 'featured', limit = 12 } = req.query;

  try {
    let results;
    
    switch (type) {
      case 'toprated':
        results = getTopRatedPerfumes(parseInt(limit));
        break;
      case 'featured':
      default:
        results = getRandomPerfumes(parseInt(limit));
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching fragrances:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
