import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../../../shared/middleware/auth.js';
import { validate } from '../../../shared/middleware/validate.js';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('orderItems').isArray({ min: 1 }),
    body('shippingAddress.street').notEmpty(),
    body('shippingAddress.city').notEmpty(),
    body('shippingAddress.state').notEmpty(),
    body('shippingAddress.zip').notEmpty(),
    body('shippingAddress.country').notEmpty(),
  ],
  validate,
  createOrder
);

router.get('/my', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, [body('status').notEmpty()], validate, updateOrderStatus);

export default router;
