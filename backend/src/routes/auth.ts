import { Router } from 'express';
import { z } from 'zod';
import { users } from '../data/store.js';
import { hashPassword, sanitizeUser, signToken, verifyPassword } from '../lib/auth.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  institutionCode: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const router = Router();

router.post('/register', (req, res) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parseResult.error.flatten() });
  }

  const { email, password, firstName, lastName, institutionCode } = parseResult.data;
  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password: hashPassword(password),
    firstName,
    lastName,
    role: 'STUDENT' as const,
    institutionCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  const token = signToken(newUser);

  return res.status(201).json({
    token,
    user: sanitizeUser(newUser),
    expiresIn: '24h',
  });
});

router.post('/login', (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid login payload', issues: parseResult.error.flatten() });
  }

  const { email, password } = parseResult.data;
  const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  user.lastLoginAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();

  return res.json({
    token: signToken(user),
    user: sanitizeUser(user),
    expiresIn: '24h',
  });
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = users.find((entry) => entry.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: sanitizeUser(user) });
});

export default router;
