import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { env } from './shared/config/env.js';
import { configurePassport } from './features/auth/config/passport.js';
import { notFound, errorHandler } from './shared/middleware/errorHandler.js';
import authRoutes from './features/auth/routes/authRoutes.js';
import userRoutes from './features/users/routes/userRoutes.js';
import productRoutes from './features/products/routes/productRoutes.js';
import orderRoutes from './features/orders/routes/orderRoutes.js';
import cartRoutes from './features/cart/routes/cartRoutes.js';
import statsRoutes from './features/stats/routes/statsRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const allowedOrigins = [env.storefrontUrl, env.crmUrl].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' },
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again later' },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

configurePassport();
app.use(passport.initialize());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
