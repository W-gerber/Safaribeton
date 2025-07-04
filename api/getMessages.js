import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  // Set CORS headers for browser access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET.' });
  }

  const prisma = new PrismaClient();
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
