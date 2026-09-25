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
  syncSubject: (payload: {
    subjectId: string;
    attended: number;
    total: number;
    percentage: number;
    threshold: number;
    status: Subject['status'];
  }) => void;
}

const buildDashboardSnapshot = (nextSubjects: Subject[]): DashboardResponse => ({
  overview: {
    totalSubjects: nextSubjects.length,
    avgPercentage: nextSubjects.length
      ? Number(
          (
            nextSubjects.reduce((sum, subject) => {
              if (!subject.total) return sum;
              return sum + (subject.attended / subject.total) * 100;
            }, 0) / nextSubjects.length
          ).toFixed(1),
        )
      : 0,
    atRiskCount: nextSubjects.filter((subject) => subject.status !== 'SAFE').length,
  },
  subjects: nextSubjects,
  alerts: nextSubjects
    .filter((subject) => subject.status !== 'SAFE')
    .map((subject) => ({
      subjectId: subject.id,
      subjectCode: subject.code,
      title: `${subject.name} needs attention`,
      message: `Current attendance is ${subject.total ? ((subject.attended / subject.total) * 100).toFixed(1) : '0.0'}%`,
    })),
  predictions: {},
});

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
      dashboard: state.dashboard ? buildDashboardSnapshot([...state.subjects, subject]) : null,
    }));
  },
  addAttendance: async (subjectId, payload) => {
    const response = await subjectApi.addAttendance(subjectId, payload);
    const updatedSubject = response.subject;
    set((state) => {
      const nextSubjects = state.subjects.map((subject) => (subject.id === updatedSubject.id ? updatedSubject : subject));
      return {
        subjects: nextSubjects,
        dashboard: state.dashboard ? buildDashboardSnapshot(nextSubjects) : null,
      };
    });
  },
  syncSubject: (payload) => {
    set((state) => {
      const nextSubjects = state.subjects.map((subject) =>
        subject.id === payload.subjectId
          ? {
              ...subject,
              attended: payload.attended,
              total: payload.total,
              threshold: payload.threshold,
              status: payload.status,
            }
          : subject,
      );

      return {
        subjects: nextSubjects,
        dashboard: state.dashboard ? buildDashboardSnapshot(nextSubjects) : null,
      };
    });
  },
}));
