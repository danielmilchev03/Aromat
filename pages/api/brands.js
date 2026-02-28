import { getUniqueBrands } from '../../lib/perfumeData';

export default function handler(req, res) {
  try {
    const brands = getUniqueBrands();
    res.status(200).json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
