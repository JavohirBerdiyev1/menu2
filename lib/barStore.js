import fs from 'fs';
import path from 'path';
import { barItems as seedBarItems } from '../moke/data';

const dataDir = path.join(process.cwd(), 'data');
const barDataPath = path.join(dataDir, 'bar.json');

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

export function ensureBarData() {
  if (!fs.existsSync(barDataPath)) {
    // Seed from existing mock data on first run
    writeJSON(barDataPath, seedBarItems);
  }
}

export function getBarData() {
  ensureBarData();
  const data = readJSON(barDataPath);
  return data || {};
}

export function saveBarData(data) {
  writeJSON(barDataPath, data);
}

export function findItemById(barData, itemId) {
  for (const categoryKey of Object.keys(barData)) {
    const items = barData[categoryKey] || [];
    const index = items.findIndex((it) => it.id === itemId);
    if (index !== -1) {
      return { categoryKey, index };
    }
  }
  return null;
}


