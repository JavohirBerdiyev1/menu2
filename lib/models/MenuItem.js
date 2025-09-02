import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    menuType: { type: String, required: true, index: true },
    categoryKey: { type: String, required: true, index: true },
    // original JSON sometimes uses string or number ids; store as string
    externalId: { type: String, index: true },
    // can be string (bar) or localized object (menus)
    name: { type: mongoose.Schema.Types.Mixed },
    price: { type: Number, default: null },
    image: { type: String },
    weight: { type: String },
    unit: { type: String },
    volume: { type: Number },
    // can be string (bar) or localized object (menus)
    description: { type: mongoose.Schema.Types.Mixed },
    showDescription: { type: Boolean, default: false },
    // visibility toggle for item
    show: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

MenuItemSchema.index({ menuType: 1, categoryKey: 1 });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);


