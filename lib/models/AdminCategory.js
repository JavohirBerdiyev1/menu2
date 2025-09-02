import mongoose from 'mongoose';

const AdminCategorySchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdminCategory || mongoose.model('AdminCategory', AdminCategorySchema);


