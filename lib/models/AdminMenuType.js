import mongoose from 'mongoose';

const AdminMenuTypeSchema = new mongoose.Schema(
  {
    // unique string key used in URLs, e.g., "fastFood", "desserts"
    id: { type: String, required: true, unique: true, index: true },
    // optional display names (not strictly required because Header has fallback)
    name: { type: mongoose.Schema.Types.Mixed, default: null },
    // visible to public header when true
    show: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdminMenuType || mongoose.model('AdminMenuType', AdminMenuTypeSchema);


