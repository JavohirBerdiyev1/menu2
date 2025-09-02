import { verify } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import AdminItem from '@/lib/models/AdminItem';

export default function handler(req, res) { return _handler(req, res); }

async function _handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const docs = await AdminItem.find().lean();
    return res.status(200).json(
      docs.map((d) => ({ id: d.externalId, name: d.name, categoryId: d.categoryExternalId }))
    );
  }

  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, name, categoryId } = req.body;

  if (req.method === 'POST') {
    const created = await AdminItem.create({
      externalId: String(id),
      name,
      categoryExternalId: String(categoryId),
    });
    return res.status(201).json({ id: created.externalId, name: created.name, categoryId: created.categoryExternalId });
  }

  if (req.method === 'PUT') {
    const updated = await AdminItem.findOneAndUpdate(
      { externalId: String(id) },
      { name, categoryExternalId: String(categoryId) },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json({ id: updated.externalId, name: updated.name, categoryId: updated.categoryExternalId });
  }

  if (req.method === 'DELETE') {
    const deleted = await AdminItem.findOneAndDelete({ externalId: String(id) }).lean();
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.status(204).end();
  }

  return res.status(405).end();
}