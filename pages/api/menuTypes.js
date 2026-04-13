import { connectToDatabase } from '@/lib/db'
import MenuItem from '@/lib/models/MenuItem'
import AdminMenuType from '@/lib/models/AdminMenuType'
import { verify } from '@/lib/auth'

export default async function handler(req, res) {
  await connectToDatabase()

  if (req.method === 'GET') {
    // public request returns only published menus (show: true)
    const isAdmin = (() => {
      try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return false
        verify(token)
        return true
      } catch {
        return false
      }
    })()

    if (isAdmin) {
      const docs = await AdminMenuType.find({}, { _id: 0, id: 1, name: 1, show: 1 }).lean()
      const inferred = await MenuItem.distinct('menuType')
      const set = new Set([...(docs?.map((x) => x.id) || []), ...(inferred || [])])
      const types = Array.from(set)
      // merge visibility: if doc exists use its show, otherwise default true
      const idToShow = new Map(docs.map((d) => [d.id, Boolean(d.show)]))
      const merged = types.map((id) => ({ id, show: idToShow.has(id) ? idToShow.get(id) : true }))
      types.sort()
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ types, admin: merged })
    }

    // Public: show items that either have show:true doc OR have no doc at all (default visible)
    const db = await connectToDatabase();
    
    if (!db) {
      // Fallback if DB is down
      const defaultTypes = ['uzbek', 'european', 'shashlik', 'bread', 'bar', 'hookah', 'businessLunch', 'garnish'];
      return res.status(200).json(defaultTypes);
    }

    const [docs, inferred] = await Promise.all([
      AdminMenuType.find({}, { _id: 0, id: 1, show: 1 }).lean(),
      MenuItem.distinct('menuType'),
    ])
    const idsWithDocs = new Set((docs || []).map((d) => d.id))
    const visibleFromDocs = (docs || []).filter((d) => d.show).map((d) => d.id)
    const visibleNoDoc = (inferred || []).filter((id) => !idsWithDocs.has(id))
    const types = Array.from(new Set([...visibleFromDocs, ...visibleNoDoc]))
    
    if (types.length === 0) {
      // Fallback if DB is empty
      const defaultTypes = ['uzbek', 'european', 'shashlik', 'bread', 'bar', 'hookah', 'businessLunch', 'garnish'];
      return res.status(200).json(defaultTypes);
    }

    types.sort()
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(types)
  }

  const token = req.headers.authorization?.split(' ')[1]
  try {
    verify(token)
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { id, name } = req.body || {}
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'id is required' })
    }
    const norm = id.trim()
    const created = await AdminMenuType.findOneAndUpdate(
      { id: norm },
      { $setOnInsert: { id: norm, name: name || null, show: false } },
      { upsert: true, new: true }
    ).lean()
    return res.status(201).json({ id: created.id, show: created.show })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ message: 'id required' })
    await AdminMenuType.deleteOne({ id: String(id) })
    return res.status(204).end()
  }

  if (req.method === 'PUT') {
    const { id, show, name } = req.body || {}
    if (!id) return res.status(400).json({ message: 'id required' })
    const update = {}
    if (typeof show !== 'undefined') update.show = Boolean(show)
    if (name) update.name = name
    const updated = await AdminMenuType.findOneAndUpdate(
      { id: String(id).trim() },
      { $set: { id: String(id).trim(), ...update } },
      { new: true, upsert: true }
    ).lean()
    if (!updated) return res.status(404).json({ message: 'Not found' })
    return res.status(200).json({ id: updated.id, show: updated.show, name: updated.name || null })
  }

  return res.status(405).end()
}


