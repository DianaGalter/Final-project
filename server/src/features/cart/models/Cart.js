import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true },
    guestId: { type: String, sparse: true, index: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { user: { $exists: true } } });

export const Cart = mongoose.model('Cart', cartSchema);
