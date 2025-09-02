/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const { MONGODB_URI = 'mongodb://localhost:27017/restaurant' } = process.env;

const dataDir = path.join(process.cwd(), 'data');

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

const MenuItemSchema = new mongoose.Schema(
  {
    menuType: { type: String, required: true, index: true },
    categoryKey: { type: String, required: true, index: true },
    externalId: { type: String, index: true },
    name: { type: mongoose.Schema.Types.Mixed },
    price: { type: Number, default: null },
    image: { type: String },
    weight: { type: String },
    unit: { type: String },
    volume: { type: Number },
    description: { type: mongoose.Schema.Types.Mixed },
    showDescription: { type: Boolean, default: false },
  },
  { timestamps: true }
);
MenuItemSchema.index({ menuType: 1, categoryKey: 1 });
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

async function seedMenu(menuType, filename) {
  const filePath = path.join(dataDir, filename);
  const json = readJSON(filePath);
  if (!json) {
    console.warn(`Skip ${menuType}: file not found or invalid (${filename})`);
    return;
  }

  const ops = [];
  for (const [categoryKey, items] of Object.entries(json)) {
    for (const item of items) {
      ops.push({
        updateOne: {
          filter: { menuType, categoryKey, externalId: String(item.id) },
          update: {
            $set: {
              name: item.name,
              price: item.price ?? null,
              image: item.image,
              weight: item.weight,
              unit: item.unit,
              volume: item.volume,
              description: item.description,
              showDescription: Boolean(item.showDescription),
            },
            $setOnInsert: { show: true },
          },
          upsert: true,
        },
      });
    }
  }
  if (ops.length) {
    await MenuItem.bulkWrite(ops);
    console.log(`Seeded ${menuType}: ${ops.length} ops`);
  }
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  await seedMenu('european', 'european.json');
  await seedMenu('uzbek', 'uzbek.json');
  await seedMenu('shashlik', 'shashlik.json');
  await seedMenu('bread', 'bread.json');
  await seedMenu('garnish', 'garnish.json');
  await seedMenu('hookah', 'hookah.json');
  await seedMenu('businessLunch', 'businessLunch.json');
  await seedMenu('bar', 'bar.json');
  await mongoose.disconnect();
  console.log('Seeding complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


