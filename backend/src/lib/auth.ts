import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserRecord } from '../types/index.js';

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);

export const sanitizeUser = (user: UserRecord) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  institutionCode: user.institutionCode,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});

export const signToken = (user: UserRecord) => {
  const tokenOptions: jwt.SignOptions = {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      institutionCode: user.institutionCode,
    },
    String(env.jwtSecret),
    tokenOptions,
  );
};

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as {
  id: string;
  email: string;
  role: string;
  institutionCode: string;
};
