import { useState } from 'react';
import { useSubjectStore } from '../store/subjectStore';

export function AttendanceLogger({ subjectId }: { subjectId?: string }) {
  const { addAttendance, fetchDashboard } = useSubjectStore();
  const [attended, setAttended] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!subjectId) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await addAttendance(subjectId, {
        attended,
        date: new Date().toISOString().slice(0, 10),
        type: 'LECTURE',
        remarks: 'Logged from live dashboard',
      });
      await fetchDashboard();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <label className="flex items-center justify-between text-sm text-slate-300">
        <span>Attended</span>
        <input type="checkbox" checked={attended} onChange={(event) => setAttended(event.target.checked)} className="h-4 w-4" />
      </label>
      <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
        {isLoading ? 'Saving...' : 'Log attendance'}
      </button>
    </form>
  );
}
