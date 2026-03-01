import { searchPerfumesByNote, getAllNotes } from '../../lib/api';

export default async function handler(req, res) {
  const { note, limit = 50, list } = req.query;

  // Return all unique notes for autocomplete/suggestions
  if (list === 'true') {
    try {
      const notes = await getAllNotes();
      return res.status(200).json(notes);
    } catch (error) {
      console.error('Error listing notes:', error);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }

  if (!note) {
    return res.status(400).json({ error: 'Note parameter required' });
  }

  try {
    const results = await searchPerfumesByNote(note, parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error('Note search error:', error);
    res.status(500).json({ error: 'Failed to search by note' });
  }
}
