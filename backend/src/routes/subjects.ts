import { Router } from 'express';
import { z } from 'zod';
import { attendanceLogs, subjects } from '../data/store.js';
import { attendanceCalculator } from '../lib/calculationEngine.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const subjectSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  threshold: z.coerce.number().min(1).max(99).optional(),
});

const attendanceSchema = z.object({
  date: z.string().or(z.date()).optional(),
  attended: z.boolean(),
  type: z.string().default('LECTURE'),
  remarks: z.string().optional(),
});

const router = Router();

router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const userSubjects = subjects.filter((subject) => subject.userId === req.user?.id);
  return res.json({ subjects: userSubjects });
});

router.post('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const parsed = subjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid subject payload', issues: parsed.error.flatten() });
  }

  const { code, name, threshold = 75 } = parsed.data;
  const existing = subjects.find((subject) => subject.userId === req.user?.id && subject.code.toLowerCase() === code.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Subject already exists' });
  }

  const newSubject = {
    id: `subject_${Date.now()}`,
    code,
    name,
    userId: req.user!.id,
    threshold,
    attended: 0,
    total: 0,
    status: 'SAFE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  subjects.push(newSubject);
  return res.status(201).json({ subject: newSubject });
});

router.post('/:subjectId/attendance', requireAuth, (req: AuthenticatedRequest, res) => {
  const subject = subjects.find((entry) => entry.id === req.params.subjectId);
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const payload = attendanceSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: 'Invalid attendance payload', issues: payload.error.flatten() });
  }

  const record = {
    id: `attendance_${Date.now()}`,
    subjectId: subject.id,
    userId: req.user!.id,
    date: (payload.data.date ? new Date(payload.data.date).toISOString() : new Date().toISOString()),
    attended: payload.data.attended,
    type: payload.data.type,
    remarks: payload.data.remarks,
  };

  attendanceLogs.push(record);
  subject.total += 1;
  if (payload.data.attended) {
    subject.attended += 1;
  }
  subject.updatedAt = new Date().toISOString();
  subject.status = attendanceCalculator.getStatus(
    subject.total > 0 ? (subject.attended / subject.total) * 100 : 0,
    subject.threshold,
  );

  return res.status(201).json({ record, subject });
});

router.get('/:subjectId', requireAuth, (req: AuthenticatedRequest, res) => {
  const subject = subjects.find((entry) => entry.id === req.params.subjectId && entry.userId === req.user?.id);
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const records = attendanceLogs.filter((entry) => entry.subjectId === subject.id);
  return res.json({ subject, attendanceRecords: records });
});

export default router;
