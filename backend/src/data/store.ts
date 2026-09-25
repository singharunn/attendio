import bcrypt from 'bcryptjs';
import { AttendanceLog, SubjectRecord, UserRecord } from '../types/index.js';

export const users: UserRecord[] = [];
export const subjects: SubjectRecord[] = [];
export const attendanceLogs: AttendanceLog[] = [];

export const createDemoData = () => {
  if (users.length) return;

  users.push({
    id: 'u_demo_1',
    email: 'student@attendio.dev',
    password: bcrypt.hashSync('Password123!', 10),
    firstName: 'Aadya',
    lastName: 'Patel',
    role: 'STUDENT',
    institutionCode: 'IITD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  subjects.push({
    id: 's_demo_1',
    code: 'CS101',
    name: 'Data Structures',
    userId: 'u_demo_1',
    threshold: 75,
    attended: 42,
    total: 50,
    status: 'CRITICAL',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  subjects.push({
    id: 's_demo_2',
    code: 'EE210',
    name: 'Signals and Systems',
    userId: 'u_demo_1',
    threshold: 75,
    attended: 64,
    total: 75,
    status: 'SAFE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  attendanceLogs.push({
    id: 'r_demo_1',
    subjectId: 's_demo_1',
    userId: 'u_demo_1',
    date: new Date().toISOString(),
    attended: true,
    type: 'LECTURE',
    remarks: 'Present'
  });
};
