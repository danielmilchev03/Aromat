import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prisma';

const RATING_FIELDS = ['sillage', 'longevity', 'priceValue', 'spring', 'summer', 'fall', 'winter', 'dayNight', 'rating'];

function validateRating(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5;
}

export default async function handler(req, res) {
  // GET — public, no auth needed
  if (req.method === 'GET') {
    const { perfumeId } = req.query;

    if (!perfumeId) {
      return res.status(400).json({ error: 'perfumeId required' });
    }

    const reviews = await prisma.review.findMany({
      where: { perfumeId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Compute aggregates
    if (reviews.length === 0) {
      return res.json({ reviews: [], aggregates: null, count: 0 });
    }

    const sums = {};
    for (const field of RATING_FIELDS) {
      sums[field] = 0;
    }
    for (const review of reviews) {
      for (const field of RATING_FIELDS) {
        sums[field] += review[field];
      }
    }

    const aggregates = {};
    for (const field of RATING_FIELDS) {
      aggregates[field] = +(sums[field] / reviews.length).toFixed(1);
    }

    return res.json({ reviews, aggregates, count: reviews.length });
  }

  // Auth required for POST / DELETE
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = session.user.id;

  // POST — create or update a review
  if (req.method === 'POST') {
    const { perfumeId, comment, ...ratings } = req.body;

    if (!perfumeId) {
      return res.status(400).json({ error: 'perfumeId required' });
    }

    // Validate all rating fields
    const data = { perfumeId, userId };
    for (const field of RATING_FIELDS) {
      if (!validateRating(ratings[field])) {
        return res.status(400).json({ error: `${field} must be an integer between 1 and 5` });
      }
      data[field] = Number(ratings[field]);
    }

    if (comment !== undefined && comment !== null) {
      // Limit comment length
      if (typeof comment !== 'string' || comment.length > 2000) {
        return res.status(400).json({ error: 'Comment must be a string under 2000 characters' });
      }
      data.comment = comment.trim() || null;
    }

    const review = await prisma.review.upsert({
      where: { userId_perfumeId: { userId, perfumeId } },
      update: { ...data, userId: undefined, perfumeId: undefined },
      create: data,
    });

    return res.json({ review });
  }

  // DELETE — remove user's review
  if (req.method === 'DELETE') {
    const { perfumeId } = req.body;

    if (!perfumeId) {
      return res.status(400).json({ error: 'perfumeId required' });
    }

    await prisma.review.deleteMany({
      where: { userId, perfumeId },
    });

    return res.json({ removed: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).end();
}
