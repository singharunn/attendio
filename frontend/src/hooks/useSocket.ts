import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useSubjectStore } from '../store/subjectStore';

export const useSocket = () => {
  const { token } = useAuthStore();
  const { syncSubject } = useSubjectStore();

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(import.meta.env.VITE_WEBSOCKET_URL ?? 'http://localhost:3001', {
      auth: { token },
      reconnection: true,
      transports: ['websocket'],
    });

    socket.on('subject:updated', (payload) => {
      syncSubject(payload);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return () => {
      socket.off('subject:updated');
      socket.disconnect();
    };
  }, [syncSubject, token]);
};
