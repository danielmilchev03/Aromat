import { searchPerfumes } from '../../lib/api';

export default async function handler(req, res) {
  const { q, limit = 5 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const results = await searchPerfumes(q, parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search PerfumAPI' });
  }
}
