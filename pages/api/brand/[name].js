import { getPerfumesByBrand } from '../../../lib/api';

export default async function handler(req, res) {
  const { name, sort = 'name' } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Brand name is required' });
  }

  try {
    const perfumes = await getPerfumesByBrand(decodeURIComponent(name), sort);
    res.status(200).json({ brand: decodeURIComponent(name), perfumes, total: perfumes.length });
  } catch (error) {
    console.error('Error fetching brand perfumes:', error);
    res.status(500).json({ error: 'Failed to fetch brand perfumes' });
  }
}
