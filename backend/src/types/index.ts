export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
export type SubjectStatus = 'SAFE' | 'CRITICAL' | 'DANGER';

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionCode: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AttendanceLog {
  id: string;
  subjectId: string;
  userId: string;
  date: string;
  attended: boolean;
  type: string;
  remarks?: string;
}

export interface SubjectRecord {
  id: string;
  code: string;
  name: string;
  userId: string;
  threshold: number;
  attended: number;
  total: number;
  status: SubjectStatus;
  createdAt: string;
  updatedAt: string;
}
