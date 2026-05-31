import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import {
  register,
  login,
  verify2FA,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
} from '../controllers/authController.js';
import { protect } from '../../../shared/middleware/auth.js';
import { validate } from '../../../shared/middleware/validate.js';
import { env } from '../../../shared/config/env.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/verify-2fa',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('code').notEmpty().withMessage('Code is required'),
  ],
  validate,
  verify2FA
);

router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);

if (env.google.clientId && env.google.clientSecret) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: env.storefrontUrl }),
    googleCallback
  );
}

export default router;
