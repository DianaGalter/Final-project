import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, admin } from '../../../shared/middleware/auth.js';

const router = Router();

router.get('/dashboard', protect, admin, getDashboardStats);

export default router;
