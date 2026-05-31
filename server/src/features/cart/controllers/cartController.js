import { Cart } from '../models/Cart.js';
import { Product } from '../../products/models/Product.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

const populateCart = async (cart) => {
  if (!cart) return { items: [] };
  await cart.populate({
    path: 'items.product',
    select: 'name price images stock description',
  });
  return cart;
};

const getOrCreateCart = async (userId, guestId) => {
  if (userId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    return cart;
  }
  if (guestId) {
    let cart = await Cart.findOne({ guestId });
    if (!cart) cart = await Cart.create({ guestId, items: [] });
    return cart;
  }
  return null;
};

export const getCart = asyncHandler(async (req, res) => {
  const guestId = req.headers['x-guest-id'];
  const cart = await getOrCreateCart(req.user?._id, guestId);
  if (!cart) {
    return res.json({ items: [] });
  }
  await populateCart(cart);
  res.json(cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const guestId = req.headers['x-guest-id'];
  const cart = await getOrCreateCart(req.user?._id, guestId);
  if (!cart) {
    res.status(400);
    throw new Error('Guest ID required for guest cart');
  }

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  await populateCart(cart);
  res.json(cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const guestId = req.headers['x-guest-id'];
  const cart = await getOrCreateCart(req.user?._id, guestId);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (quantity <= 0) {
    item.deleteOne();
  } else {
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      res.status(400);
      throw new Error('Insufficient stock');
    }
    item.quantity = quantity;
  }
  await cart.save();
  await populateCart(cart);
  res.json(cart);
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const guestId = req.headers['x-guest-id'];
  const cart = await getOrCreateCart(req.user?._id, guestId);
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  item.deleteOne();
  await cart.save();
  await populateCart(cart);
  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const guestId = req.headers['x-guest-id'];
  const cart = await getOrCreateCart(req.user?._id, guestId);
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ items: [] });
});

export const mergeCart = asyncHandler(async (req, res) => {
  const guestId = req.headers['x-guest-id'] || req.body.guestId;
  if (!req.user || !guestId) {
    res.status(400);
    throw new Error('User and guest ID required for merge');
  }

  const userCart = await getOrCreateCart(req.user._id, null);
  const guestCart = await Cart.findOne({ guestId });

  if (guestCart?.items?.length) {
    for (const guestItem of guestCart.items) {
      const existing = userCart.items.find(
        (i) => i.product.toString() === guestItem.product.toString()
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        userCart.items.push({ product: guestItem.product, quantity: guestItem.quantity });
      }
    }
    await userCart.save();
    await guestCart.deleteOne();
  }

  await populateCart(userCart);
  res.json(userCart);
});

export const syncCart = asyncHandler(async (req, res) => {
  const guestId = req.headers['x-guest-id'];
  const { items } = req.body;
  const cart = await getOrCreateCart(req.user?._id, guestId);
  if (!cart) {
    res.status(400);
    throw new Error('Cart context required');
  }

  cart.items = [];
  for (const item of items || []) {
    const product = await Product.findById(item.productId || item.product);
    if (product) {
      cart.items.push({
        product: product._id,
        quantity: item.quantity || 1,
      });
    }
  }
  await cart.save();
  await populateCart(cart);
  res.json(cart);
});
