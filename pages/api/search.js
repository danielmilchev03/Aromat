import { searchPerfumes } from '../../lib/perfumeData';

export default function handler(req, res) {
  const { q, limit = 5 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const results = searchPerfumes(q);
    const limitedResults = results.slice(0, parseInt(limit));
    res.status(200).json(limitedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
