import { verify } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import AdminCategory from '@/lib/models/AdminCategory';

export default function handler(req, res) { return _handler(req, res); }

async function _handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const docs = await AdminCategory.find().lean();
    return res.status(200).json(docs.map((d) => ({ id: d.externalId, name: d.name })));
  }

  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, name } = req.body;

  if (req.method === 'POST') {
    const created = await AdminCategory.create({ externalId: String(id), name });
    return res.status(201).json({ id: created.externalId, name: created.name });
  }

  if (req.method === 'PUT') {
    const updated = await AdminCategory.findOneAndUpdate({ externalId: String(id) }, { name }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json({ id: updated.externalId, name: updated.name });
  }

  if (req.method === 'DELETE') {
    const deleted = await AdminCategory.findOneAndDelete({ externalId: String(id) }).lean();
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.status(204).end();
  }

  return res.status(405).end();
}