import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
  syncCart,
} from '../controllers/cartController.js';
import { protect, optionalAuth } from '../../../shared/middleware/auth.js';
import { validate } from '../../../shared/middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/sync', optionalAuth, syncCart);
router.post(
  '/items',
  optionalAuth,
  [body('productId').notEmpty(), body('quantity').optional().isInt({ min: 1 })],
  validate,
  addToCart
);
router.put('/items/:itemId', optionalAuth, updateCartItem);
router.delete('/items/:itemId', optionalAuth, removeFromCart);
router.delete('/', optionalAuth, clearCart);
router.post('/merge', protect, mergeCart);

export default router;
