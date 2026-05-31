import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, trim: true, default: 'general' },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
