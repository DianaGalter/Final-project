import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../../../shared/middleware/auth.js';
import { validate } from '../../../shared/middleware/validate.js';

const router = Router();

router.put(
  '/profile',
  protect,
  [body('name').optional().trim().notEmpty()],
  validate,
  updateProfile
);

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
