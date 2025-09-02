import mongoose from 'mongoose';

const AdminItemSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    categoryExternalId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdminItem || mongoose.model('AdminItem', AdminItemSchema);


