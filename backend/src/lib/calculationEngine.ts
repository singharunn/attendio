export type SubjectStatus = 'SAFE' | 'CRITICAL' | 'DANGER';

export class AttendanceCalculator {
  calculatePercentage(attended: number, total: number): number {
    if (total === 0) throw new Error('Total cannot be zero');
    if (attended > total) throw new Error('Attended exceeds total');
    return (attended / total) * 100;
  }

  calculateSafeSkips(attended: number, total: number, threshold: number): number {
    if (threshold >= 100) return 0;
    const numerator = 100 * attended - threshold * total;
    return Math.floor(numerator / threshold);
  }

  calculateRecovery(attended: number, total: number, threshold: number): number {
    if (threshold <= 0 || threshold >= 100) throw new Error('Invalid threshold');
    const numerator = threshold * total - 100 * attended;
    const denominator = 100 - threshold;
    return Math.ceil(numerator / denominator);
  }

  getStatus(percentage: number, threshold: number): SubjectStatus {
    if (percentage >= threshold) return 'SAFE';
    if (percentage >= threshold - 5) return 'CRITICAL';
    return 'DANGER';
  }

  predictFuturePercentage(attended: number, total: number, absenceDays: number): number {
    const futureTotal = total + absenceDays;
    return (attended / futureTotal) * 100;
  }
}

export const attendanceCalculator = new AttendanceCalculator();
