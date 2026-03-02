import { searchPerfumes, searchPerfumesByNote, getAllNotes } from '../../lib/api';

export default async function handler(req, res) {
  const { q, note, type, limit = 5 } = req.query;

  // Return all unique notes for autocomplete
  if (type === 'notes-list') {
    try {
      const notes = await getAllNotes();
      return res.status(200).json(notes);
    } catch (error) {
      console.error('Error listing notes:', error);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }

  // Search by note
  if (note) {
    try {
      const results = await searchPerfumesByNote(note, parseInt(limit));
      return res.status(200).json(results);
    } catch (error) {
      console.error('Note search error:', error);
      return res.status(500).json({ error: 'Failed to search by note' });
    }
  }

  // Search by name/brand
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
