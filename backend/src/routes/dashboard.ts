import { Router } from 'express';
import { z } from 'zod';
import { attendanceLogs, subjects, users } from '../data/store.js';
import { attendanceCalculator } from '../lib/calculationEngine.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = users.find((entry) => entry.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userSubjects = subjects.filter((subject) => subject.userId === user.id);
  const average =
    userSubjects.length > 0
      ? userSubjects.reduce((total, subject) => {
          if (subject.total === 0) return total;
          return total + (subject.attended / subject.total) * 100;
        }, 0) / userSubjects.length
      : 0;

  const alerts = userSubjects
    .filter((subject) => subject.status !== 'SAFE')
    .map((subject) => ({
      subjectId: subject.id,
      subjectCode: subject.code,
      title: `${subject.name} needs attention`,
      message: `Current attendance is ${((subject.attended / Math.max(subject.total, 1)) * 100).toFixed(1)}%`,
    }));

  return res.json({
    overview: {
      totalSubjects: userSubjects.length,
      avgPercentage: Number(average.toFixed(1)),
      atRiskCount: alerts.length,
    },
    subjects: userSubjects,
    alerts,
    predictions: {},
  });
});

router.get('/me/dashboard', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.redirect(307, `/api/v1/users/me`);
});

const safeSkipSchema = z.object({
  attended: z.coerce.number().min(0),
  total: z.coerce.number().min(1),
  threshold: z.coerce.number().min(1).max(99),
});

router.get('/:subjectId/safe-skip', requireAuth, (req, res) => {
  const subject = subjects.find((entry) => entry.id === req.params.subjectId);
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const parsed = safeSkipSchema.safeParse({
    attended: subject.attended,
    total: subject.total,
    threshold: subject.threshold,
  });

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid calculation input' });
  }

  const result = parsed.data;
  const percentage = attendanceCalculator.calculatePercentage(result.attended, result.total);
  const safeSkips = attendanceCalculator.calculateSafeSkips(result.attended, result.total, result.threshold);
  const recoveryNeeded = attendanceCalculator.calculateRecovery(result.attended, result.total, result.threshold);
  const status = attendanceCalculator.getStatus(percentage, result.threshold);

  return res.json({
    subjectId: subject.id,
    safeSkips,
    recoveryNeeded,
    percentage,
    status,
    details: {
      attended: result.attended,
      total: result.total,
      threshold: result.threshold,
    },
  });
});

router.get('/me/reports/summary', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = users.find((entry) => entry.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userSubjects = subjects.filter((subject) => subject.userId === user.id);
  const report = {
    generatedAt: new Date().toISOString(),
    totalSubjects: userSubjects.length,
    averageAttendance: userSubjects.length
      ? Number(
          (
            userSubjects.reduce((sum, subject) => sum + (subject.total ? (subject.attended / subject.total) * 100 : 0), 0) /
            userSubjects.length
          ).toFixed(1),
        )
      : 0,
    subjects: userSubjects.map((subject) => ({
      code: subject.code,
      name: subject.name,
      percentage: subject.total ? ((subject.attended / subject.total) * 100).toFixed(1) : '0.0',
      status: subject.status,
    })),
  };

  return res.json({ report });
});

router.get('/subjects/:subjectId/attendance', requireAuth, (req, res) => {
  const subject = subjects.find((entry) => entry.id === req.params.subjectId);
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const subjectLogs = attendanceLogs.filter((entry) => entry.subjectId === req.params.subjectId);
  return res.json({ records: subjectLogs, total: subjectLogs.length, statistics: { totalClasses: subject.total, attended: subject.attended } });
});

export default router;
