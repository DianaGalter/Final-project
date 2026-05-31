import { Order } from '../../orders/models/Order.js';
import { User } from '../../users/models/User.js';
import { Product } from '../../products/models/Product.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [userCount, productCount, orderCount, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find().select('totalPrice status createdAt'),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const statusBreakdown = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  const lowStock = await Product.find({ stock: { $lte: 10 } })
    .select('name stock')
    .sort({ stock: 1 })
    .limit(5);

  res.json({
    userCount,
    productCount,
    orderCount,
    totalRevenue,
    statusBreakdown,
    recentOrders,
    lowStock,
  });
});
