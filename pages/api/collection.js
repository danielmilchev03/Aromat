import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prisma';

const VALID_STATUSES = ['HAVE', 'WANT', 'HAD'];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = session.user.id;

  // GET — list user's collection, optionally filtered by ?status=HAVE
  if (req.method === 'GET') {
    const { status, perfumeId } = req.query;

    // If perfumeId is given, return status for that single perfume
    if (perfumeId) {
      const entry = await prisma.collection.findUnique({
        where: { userId_perfumeId: { userId, perfumeId } },
      });
      return res.json({ entry });
    }

    const where = { userId };
    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    const items = await prisma.collection.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ items });
  }

  // PUT — add or update a perfume in collection
  if (req.method === 'PUT') {
    const { perfumeId, status } = req.body;

    if (!perfumeId || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'perfumeId and valid status (HAVE, WANT, HAD) required' });
    }

    const entry = await prisma.collection.upsert({
      where: { userId_perfumeId: { userId, perfumeId } },
      update: { status },
      create: { userId, perfumeId, status },
    });

    return res.json({ entry });
  }

  // DELETE — remove a perfume from collection
  if (req.method === 'DELETE') {
    const { perfumeId } = req.body;

    if (!perfumeId) {
      return res.status(400).json({ error: 'perfumeId required' });
    }

    await prisma.collection.deleteMany({
      where: { userId, perfumeId },
    });

    return res.json({ removed: true });
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).end();
}
