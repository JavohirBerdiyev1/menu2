import { verify } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import MenuItem from '@/lib/models/MenuItem';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return _handler(req, res);
}

async function _handler(req, res) {
  const { menuType } = req.query;
  if (!menuType) return res.status(400).json({ message: 'menuType query parameter is required' });

  const db = await connectToDatabase();
  
  if (req.method === 'GET') {
    if (!db) {
      // Fallback to mock data if DB is down
      try {
        const mockData = require('@/moke/data');
        const keyMap = {
          uzbek: mockData.uzbekDishes,
          european: mockData.europeanDishes,
          bar: mockData.barItems,
          hookah: require('@/moke/hookahItems').hookahItems,
        };
        const items = keyMap[menuType] || {};
        return res.status(200).json(items);
      } catch (err) {
        console.error('Mock data fallback failed:', err.message);
        return res.status(200).json({});
      }
    }

    const isAdmin = isAuthorized(req);
    const query = isAdmin ? { menuType } : { menuType, show: { $ne: false } };
    const docs = await MenuItem.find(query).lean();
    // Group by categoryKey to keep the same response shape as JSON files
    const grouped = {};
    for (const doc of docs) {
      const key = doc.categoryKey;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(toClientShape(doc));
    }
    
    if (Object.keys(grouped).length === 0) {
      // Fallback to mock data if DB is empty
      try {
        const mockData = require('@/moke/data');
        const keyMap = {
          uzbek: mockData.uzbekDishes,
          european: mockData.europeanDishes,
          bar: mockData.barItems,
          hookah: require('@/moke/hookahItems').hookahItems,
        };
        return res.status(200).json(keyMap[menuType] || {});
      } catch (err) {
        return res.status(200).json({});
      }
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
      menuType,
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
    // Update all matching docs (in case same externalId exists in multiple categories)
    await MenuItem.updateMany(
      { menuType, externalId: String(id) },
      { $set: normalizeUpdates(updates) }
    );
    const updated = await MenuItem.findOne({ menuType, externalId: String(id) }).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(toClientShape(updated));
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'id required' });
    const deleted = await MenuItem.findOneAndDelete({ menuType, externalId: String(id) }).lean();
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
