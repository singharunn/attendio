import { createServer, type Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { verifyToken } from './lib/auth.js';
import type { SubjectRecord } from './types/index.js';

export type SubjectUpdatePayload = {
  subjectId: string;
  attended: number;
  total: number;
  percentage: number;
  threshold: number;
  status: SubjectRecord['status'];
};

let io: Server | null = null;

export const buildSubjectUpdate = (subject: SubjectRecord): SubjectUpdatePayload => {
  const percentage = subject.total > 0 ? Number(((subject.attended / subject.total) * 100).toFixed(1)) : 0;

  return {
    subjectId: subject.id,
    attended: subject.attended,
    total: subject.total,
    percentage,
    threshold: subject.threshold,
    status: subject.status,
  };
};

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const authToken = socket.handshake.auth?.token as string | undefined;
    const headerToken = typeof socket.handshake.headers.authorization === 'string'
      ? socket.handshake.headers.authorization.replace('Bearer ', '')
      : undefined;
    const token = authToken ?? headerToken;

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    try {
      const decoded = verifyToken(token);
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = String(socket.data.userId ?? '');
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.emit('connected', { userId, connected: true });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected for user ${userId}`);
    });
  });

  return io;
};

export const getSocketServer = () => io;

export const broadcastSubjectUpdate = (userId: string, subject: SubjectRecord) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('subject:updated', buildSubjectUpdate(subject));
};

export const createSocketServer = () => createServer();
