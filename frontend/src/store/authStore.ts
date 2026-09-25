import { create } from 'zustand';
import { authApi } from '../lib/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; firstName: string; lastName: string; institutionCode: string }) => Promise<void>;
  logout: () => void;
}

const storedToken = localStorage.getItem('attendio_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('attendio_token', response.token);
      set({ user: response.user, token: response.token, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(payload);
      localStorage.setItem('attendio_token', response.token);
      set({ user: response.user, token: response.token, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    localStorage.removeItem('attendio_token');
    set({ user: null, token: null });
  },
}));
