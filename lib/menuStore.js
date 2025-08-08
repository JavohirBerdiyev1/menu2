import fs from 'fs';
import path from 'path';
import { europeanDishes, uzbekDishes, shashlikItems, breadItems, garnishItems, businessLunchItems } from '../moke/data';
import { hookahItems } from '../moke/hookahItems';

const dataDir = path.join(process.cwd(), 'data');

// Store configurations for each menu type
const stores = {
  european: {
    path: path.join(dataDir, 'european.json'),
    seed: europeanDishes,
    categories: ['cold_appetizer', 'nuts', 'salad', 'second_course']
  },
  uzbek: {
    path: path.join(dataDir, 'uzbek.json'),
    seed: uzbekDishes,
    categories: ['cold_appetizer', 'salad', 'first_course', 'second_course']
  },
  shashlik: {
    path: path.join(dataDir, 'shashlik.json'),
    seed: shashlikItems,
    categories: ['shashlik']
  },
  bread: {
    path: path.join(dataDir, 'bread.json'),
    seed: breadItems,
    categories: ['bread']
  },
  garnish: {
    path: path.join(dataDir, 'garnish.json'),
    seed: garnishItems,
    categories: ['garnish']
  },
  hookah: {
    path: path.join(dataDir, 'hookah.json'),
    seed: hookahItems,
    categories: ['hookah']
  },
  businessLunch: {
    path: path.join(dataDir, 'businessLunch.json'),
    seed: businessLunchItems,
    categories: ['businessLunch']
  }
};

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function ensureMenuData(menuType) {
  const store = stores[menuType];
  if (!store) throw new Error(`Unknown menu type: ${menuType}`);
  
  if (!fs.existsSync(store.path)) {
    writeJSON(store.path, store.seed);
  }
}

export function getMenuData(menuType) {
  ensureMenuData(menuType);
  const store = stores[menuType];
  const data = readJSON(store.path);
  return data || store.seed;
}

export function saveMenuData(menuType, data) {
  const store = stores[menuType];
  if (!store) throw new Error(`Unknown menu type: ${menuType}`);
  writeJSON(store.path, data);
}

export function findItemById(menuType, itemId) {
  const data = getMenuData(menuType);
  const store = stores[menuType];
  
  for (const categoryKey of store.categories) {
    const items = data[categoryKey] || [];
    const index = items.findIndex((it) => it.id === itemId);
    if (index !== -1) {
      return { categoryKey, index };
    }
  }
  return null;
}

export function getMenuCategories(menuType) {
  const store = stores[menuType];
  if (!store) throw new Error(`Unknown menu type: ${menuType}`);
  return store.categories;
}

export function getAllMenuTypes() {
  return Object.keys(stores);
}
