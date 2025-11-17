import { verify } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import AdminCategory from '@/lib/models/AdminCategory';

export default function handler(req, res) {
  return _handler(req, res);
}

const toClient = (doc, fallbackMenuType) => ({
  id: doc.externalId,
  name: doc.name,
  menuType: doc.menuType || fallbackMenuType,
  show: doc.show !== false,
  order: typeof doc.order === 'number' ? doc.order : null,
});

async function findCategory(menuType, id) {
  return AdminCategory.findOne({
    $or: [
      { menuType, externalId: String(id) },
      { menuType: { $exists: false }, externalId: String(id) },
    ],
  });
}

async function _handler(req, res) {
  await connectToDatabase();

  const menuType = req.method === 'GET' ? req.query.menuType : req.body?.menuType;
  if (!menuType) {
    return res.status(400).json({ message: 'menuType is required' });
  }

  if (req.method === 'GET') {
    const docs = await AdminCategory.find({
      $or: [{ menuType }, { menuType: { $exists: false } }],
    })
      .sort({ order: 1, externalId: 1 })
      .lean();
    return res.status(200).json(docs.map((doc) => toClient(doc, menuType)));
  }

  const token = req.headers.authorization?.split(' ')[1];
  try {
    verify(token);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, name, show, order } = req.body;
  if (!id) return res.status(400).json({ message: 'id is required' });

  if (req.method === 'POST') {
    if (!name) return res.status(400).json({ message: 'name required' });
    let existing = await findCategory(menuType, id);
    if (existing) {
      existing.menuType = menuType;
      existing.name = name;
      existing.show = show !== false;
      if (order !== undefined) existing.order = order;
      await existing.save();
      return res.status(200).json(toClient(existing.toObject(), menuType));
    }
    const created = await AdminCategory.create({
      menuType,
      externalId: String(id),
      name,
      show: show !== false,
      order: typeof order === 'number' ? order : null,
    });
    return res.status(201).json(toClient(created.toObject(), menuType));
  }

  if (req.method === 'PUT') {
    const updates = {};
    if (name) updates.name = name;
    if (show !== undefined) updates.show = !!show;
    if (order !== undefined) updates.order = order;
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'Nothing to update' });
    }
    let existing = await findCategory(menuType, id);
    if (!existing) {
      existing = await AdminCategory.create({
        menuType,
        externalId: String(id),
        name: name || {},
        show: show !== false,
        order: typeof order === 'number' ? order : null,
      });
      return res.status(201).json(toClient(existing.toObject(), menuType));
    }
    existing.menuType = menuType;
    if (updates.name) existing.name = updates.name;
    if (updates.show !== undefined) existing.show = updates.show;
    if (updates.order !== undefined) existing.order = updates.order;
    await existing.save();
    return res.status(200).json(toClient(existing.toObject(), menuType));
  }

  if (req.method === 'DELETE') {
    const deleted = await AdminCategory.findOneAndDelete({
      $or: [
        { menuType, externalId: String(id) },
        { menuType: { $exists: false }, externalId: String(id) },
      ],
    }).lean();
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.status(204).end();
  }

  return res.status(405).end();
}