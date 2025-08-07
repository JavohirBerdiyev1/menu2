import { items } from '@/lib/dataStore';
import { verify } from '@/lib/auth';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(items);
  }

  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, name, categoryId } = req.body;

  if (req.method === 'POST') {
    items.push({ id, name, categoryId });
    return res.status(201).json({ id, name, categoryId });
  }

  if (req.method === 'PUT') {
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    item.name = name;
    item.categoryId = categoryId;
    return res.status(200).json(item);
  }

  if (req.method === 'DELETE') {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    items.splice(idx, 1);
    return res.status(204).end();
  }

  res.status(405).end();
}