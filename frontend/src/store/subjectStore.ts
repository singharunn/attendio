import { create } from 'zustand';
import { dashboardApi, subjectApi } from '../lib/api';
import type { DashboardResponse, Subject } from '../types';

interface SubjectState {
  dashboard: DashboardResponse | null;
  subjects: Subject[];
  loading: boolean;
  fetchDashboard: () => Promise<void>;
  addSubject: (payload: { code: string; name: string; threshold?: number }) => Promise<void>;
  addAttendance: (subjectId: string, payload: { attended: boolean; date?: string; type?: string; remarks?: string }) => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  dashboard: null,
  subjects: [],
  loading: false,
  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const response = await dashboardApi.get();
      set({ dashboard: response, subjects: response.subjects ?? [], loading: false });
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
      set({ loading: false });
    }
  },
  addSubject: async (payload) => {
    const subject = await subjectApi.create(payload);
    set((state) => ({
      subjects: [...state.subjects, subject],
    }));
  },
  addAttendance: async (subjectId, payload) => {
    const response = await subjectApi.addAttendance(subjectId, payload);
    const updatedSubject = response.subject;
    set((state) => ({
      subjects: state.subjects.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject)),
    }));
  },
}));
