import { categories } from '@/lib/dataStore';
import { verify } from '@/lib/auth';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(categories);
  }

  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, name } = req.body;

  if (req.method === 'POST') {
    categories.push({ id, name });
    return res.status(201).json({ id, name });
  }

  if (req.method === 'PUT') {
    const cat = categories.find(c => c.id === id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    cat.name = name;
    return res.status(200).json(cat);
  }

  if (req.method === 'DELETE') {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    categories.splice(idx, 1);
    return res.status(204).end();
  }

  res.status(405).end();
}