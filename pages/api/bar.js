import { verify } from '@/lib/auth';
import { getBarData, saveBarData, findItemById } from '@/lib/barStore';

export default function handler(req, res) {
  const barData = getBarData();

  if (req.method === 'GET') {
    return res.status(200).json(barData);
  }

  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { categoryKey, item } = req.body;
    if (!categoryKey || !item || !item.id) {
      return res.status(400).json({ message: 'categoryKey and item with id are required' });
    }
    barData[categoryKey] = barData[categoryKey] || [];
    barData[categoryKey].push(item);
    saveBarData(barData);
    return res.status(201).json(item);
  }

  if (req.method === 'PUT') {
    const { id, updates } = req.body;
    if (!id || !updates) return res.status(400).json({ message: 'id and updates required' });
    const found = findItemById(barData, id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    const { categoryKey, index } = found;
    barData[categoryKey][index] = { ...barData[categoryKey][index], ...updates };
    saveBarData(barData);
    return res.status(200).json(barData[categoryKey][index]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'id required' });
    const found = findItemById(barData, id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    const { categoryKey, index } = found;
    barData[categoryKey].splice(index, 1);
    saveBarData(barData);
    return res.status(204).end();
  }

  res.status(405).end();
}


