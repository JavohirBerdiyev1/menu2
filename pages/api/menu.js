import { verify } from '@/lib/auth';
import { getMenuData, saveMenuData, findItemById } from '@/lib/menuStore';

export default function handler(req, res) {
  const { menuType } = req.query;
  
  if (!menuType) {
    return res.status(400).json({ message: 'menuType query parameter is required' });
  }

  const menuData = getMenuData(menuType);

  if (req.method === 'GET') {
    return res.status(200).json(menuData);
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
    menuData[categoryKey] = menuData[categoryKey] || [];
    menuData[categoryKey].push(item);
    saveMenuData(menuType, menuData);
    return res.status(201).json(item);
  }

  if (req.method === 'PUT') {
    const { id, updates } = req.body;
    if (!id || !updates) return res.status(400).json({ message: 'id and updates required' });
    const found = findItemById(menuType, id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    const { categoryKey, index } = found;
    menuData[categoryKey][index] = { ...menuData[categoryKey][index], ...updates };
    saveMenuData(menuType, menuData);
    return res.status(200).json(menuData[categoryKey][index]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'id required' });
    const found = findItemById(menuType, id);
    if (!found) return res.status(404).json({ message: 'Not found' });
    const { categoryKey, index } = found;
    menuData[categoryKey].splice(index, 1);
    saveMenuData(menuType, menuData);
    return res.status(204).end();
  }

  res.status(405).end();
}
