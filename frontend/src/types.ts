export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  institutionCode: string;
  lastLoginAt?: string;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  threshold: number;
  attended: number;
  total: number;
  status: 'SAFE' | 'CRITICAL' | 'DANGER';
};

export type AlertItem = {
  subjectId: string;
  subjectCode: string;
  title: string;
  message: string;
};

export type DashboardResponse = {
  overview: {
    totalSubjects: number;
    avgPercentage: number;
    atRiskCount: number;
  };
  subjects: Subject[];
  alerts: AlertItem[];
  predictions: Record<string, unknown>;
};
