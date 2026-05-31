import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateToken = (userId, role) =>
  jwt.sign({ id: userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
