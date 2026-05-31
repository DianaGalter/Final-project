import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../../../shared/middleware/auth.js';
import { validate } from '../../../shared/middleware/validate.js';
import { upload } from '../../../shared/middleware/upload.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  admin,
  upload.array('images', 5),
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
  ],
  validate,
  createProduct
);

router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
