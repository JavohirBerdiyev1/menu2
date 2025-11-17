import mongoose from 'mongoose';

const AdminCategorySchema = new mongoose.Schema(
  {
    menuType: { type: String, required: true, index: true },
    // externalId identifies the category within a menuType; uniqueness is enforced per (menuType, externalId)
    externalId: { type: String, required: true, index: true },
    name: { type: mongoose.Schema.Types.Mixed, required: true },
    show: { type: Boolean, default: true },
    order: { type: Number, default: null },
  },
  { timestamps: true }
);

// Ensure we don't create multiple docs with the same (menuType, externalId) pair
AdminCategorySchema.index({ menuType: 1, externalId: 1 }, { unique: true });

export default mongoose.models.AdminCategory || mongoose.model('AdminCategory', AdminCategorySchema);


