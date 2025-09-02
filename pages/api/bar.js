import { verify } from '@/lib/auth';
 import { connectToDatabase } from '@/lib/db';
import MenuItem from '@/lib/models/MenuItem';

export default function handler(req, res) { res.setHeader('Cache-Control', 'no-store'); return _handler(req, res); }

async function _handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const isAdmin = isAuthorized(req);
    const query = isAdmin ? { menuType: 'bar' } : { menuType: 'bar', show: { $ne: false } };
    const docs = await MenuItem.find(query).lean();
    const grouped = {};
    for (const doc of docs) {
      const key = doc.categoryKey;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(toClientShape(doc));
    }
    return res.status(200).json(grouped);
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
    const created = await MenuItem.create({
      menuType: 'bar',
      categoryKey,
      externalId: String(item.id),
      name: item.name,
      price: item.price ?? null,
      image: item.image,
      weight: item.weight,
      unit: item.unit,
      volume: item.volume,
      description: item.description,
      showDescription: Boolean(item.showDescription),
      show: item.show !== false,
    });
    return res.status(201).json(toClientShape(created.toObject()));
  }

  if (req.method === 'PUT') {
    const { id, updates } = req.body;
    if (!id || !updates) return res.status(400).json({ message: 'id and updates required' });
    await MenuItem.updateMany(
      { menuType: 'bar', externalId: String(id) },
      { $set: normalizeUpdates(updates) }
    );
    const updated = await MenuItem.findOne({ menuType: 'bar', externalId: String(id) }).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(toClientShape(updated));
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'id required' });
    const deleted = await MenuItem.findOneAndDelete({ menuType: 'bar', externalId: String(id) }).lean();
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.status(204).end();
  }

  return res.status(405).end();
}

function toClientShape(doc) {
  return {
    id: doc.externalId,
    name: doc.name,
    price: doc.price,
    image: doc.image,
    weight: doc.weight,
    unit: doc.unit,
    volume: doc.volume,
    description: doc.description,
    showDescription: doc.showDescription,
    show: doc.show !== false,
  };
}

function normalizeUpdates(updates) {
  const out = {};
  if ('name' in updates) out.name = updates.name;
  if ('price' in updates) out.price = updates.price ?? null;
  if ('image' in updates) out.image = updates.image;
  if ('weight' in updates) out.weight = updates.weight;
  if ('unit' in updates) out.unit = updates.unit;
  if ('volume' in updates) out.volume = updates.volume;
  if ('description' in updates) out.description = updates.description;
  if ('showDescription' in updates) out.showDescription = Boolean(updates.showDescription);
  if ('show' in updates) out.show = Boolean(updates.show);
  return out;
}

function isAuthorized(req) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
    return true;
  } catch (e) {
    return false;
  }
}


