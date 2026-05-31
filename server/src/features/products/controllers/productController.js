import { Product } from '../models/Product.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

const emitInventoryUpdate = (req, product) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('inventory:update', {
      productId: product._id,
      stock: product.stock,
      name: product.name,
    });
  }
};

export const getProducts = asyncHandler(async (req, res) => {
  const { category, featured, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const images = req.files?.map((f) => `/uploads/${f.filename}`) || req.body.images || [];
  const product = await Product.create({ ...req.body, images });
  emitInventoryUpdate(req, product);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (req.files?.length) {
    product.images = [...(product.images || []), ...req.files.map((f) => `/uploads/${f.filename}`)];
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  emitInventoryUpdate(req, updated);
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});
