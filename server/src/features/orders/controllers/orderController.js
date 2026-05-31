import { Order } from '../models/Order.js';
import { Product } from '../../products/models/Product.js';
import { User } from '../../users/models/User.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { sendEmail } from '../../../shared/utils/sendEmail.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!orderItems?.length) {
    res.status(400);
    throw new Error('No order items');
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.name || 'product'}`);
    }
  }

  const itemsPrice = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'mock',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    status: 'paid',
    isPaid: true,
    paidAt: new Date(),
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('inventory:update', {
        productId: product._id,
        stock: product.stock,
        name: product.name,
      });
    }
  }

  const customer = await User.findById(req.user._id);
  if (customer?.email) {
    const itemsList = orderItems
      .map((i) => `<li>${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}</li>`)
      .join('');
    try {
      await sendEmail({
        to: customer.email,
        subject: `Order Confirmation #${order._id.toString().slice(-6)}`,
        html: `
          <h2>Thank you for your order, ${customer.name}!</h2>
          <p>Order ID: <strong>#${order._id.toString().slice(-6)}</strong></p>
          <ul>${itemsList}</ul>
          <p><strong>Total: $${totalPrice.toFixed(2)}</strong></p>
          <p>Status: ${order.status}</p>
        `,
      });
    } catch (err) {
      console.warn('Order confirmation email failed:', err.message);
    }
  }

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { status } = req.body;
  if (!['paid', 'shipped', 'pending', 'delivered', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  order.status = status;
  if (status === 'paid') {
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
  }
  if (status === 'shipped') {
    order.isDelivered = false;
  }
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }
  const updated = await order.save();

  if (status === 'shipped') {
    const customer = await User.findById(order.user);
    if (customer?.email) {
      try {
        await sendEmail({
          to: customer.email,
          subject: `Your order #${order._id.toString().slice(-6)} has shipped`,
          html: `<p>Hi ${customer.name},</p><p>Your order has been shipped. Thank you for shopping with us!</p>`,
        });
      } catch (err) {
        console.warn('Shipped notification email failed:', err.message);
      }
    }
  }

  res.json(updated);
});
