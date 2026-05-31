import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../features/users/models/User.js';
import { Product } from '../features/products/models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30h battery life.',
    price: 149.99,
    stock: 50,
    category: 'electronics',
    featured: true,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS.',
    price: 299.99,
    stock: 30,
    category: 'electronics',
    featured: true,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
  },
  {
    name: 'Leather Backpack',
    description: 'Handcrafted genuine leather backpack for daily commute.',
    price: 89.99,
    stock: 25,
    category: 'accessories',
    featured: true,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes with cushioned sole.',
    price: 119.99,
    stock: 40,
    category: 'footwear',
    featured: false,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
  },
  {
    name: 'Ceramic Mug Set',
    description: 'Set of 4 minimalist ceramic mugs, dishwasher safe.',
    price: 34.99,
    stock: 100,
    category: 'home',
    featured: false,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600'],
  },
  {
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with warm and cool light modes.',
    price: 49.99,
    stock: 35,
    category: 'home',
    featured: false,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  await mongoose.connect(uri);

  await Product.deleteMany();
  await Product.insertMany(products);

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error('ADMIN_EMAIL is required in .env');
    process.exit(1);
  }
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      twoFactorEnabled: true,
    });
  } else {
    admin.role = 'admin';
    admin.twoFactorEnabled = true;
    await admin.save();
  }

  console.log('Seed complete');
  console.log('Admin:', adminEmail, '/ admin123');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
