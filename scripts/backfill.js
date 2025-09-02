/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URI = 'mongodb://localhost:27017/restaurant' } = process.env;

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
    show: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const res = await MenuItem.updateMany({ show: { $exists: false } }, { $set: { show: true } });
  console.log(`Backfilled show=true on ${res.modifiedCount} items`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


