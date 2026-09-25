import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, GraduationCap, LogOut, Plus, TrendingUp } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useSubjectStore } from './store/subjectStore';

function App() {
  const { user, token, login, register, logout, isLoading, error } = useAuthStore();
  const { dashboard, subjects, fetchDashboard, addSubject, addAttendance } = useSubjectStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('student@attendio.dev');
  const [password, setPassword] = useState('Password123!');
  const [firstName, setFirstName] = useState('Aadya');
  const [lastName, setLastName] = useState('Patel');
  const [institutionCode, setInstitutionCode] = useState('IITD');
  const [subjectCode, setSubjectCode] = useState('CS201');
  const [subjectName, setSubjectName] = useState('Operating Systems');
  const [subjectThreshold, setSubjectThreshold] = useState(75);
  const [attendanceForm, setAttendanceForm] = useState({
    attended: true,
    date: new Date().toISOString().slice(0, 10),
    type: 'LECTURE',
    remarks: 'Logged from dashboard',
  });

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token, fetchDashboard]);

  const safeSkip = useMemo(() => {
    const subject = subjects[0] ?? { attended: 42, total: 50, threshold: 75 };
    const percentage = (subject.attended / Math.max(subject.total, 1)) * 100;
    const safeSkips = Math.max(0, Math.floor((100 * subject.attended - subject.threshold * subject.total) / subject.threshold));
    const recoveryNeeded = Math.ceil((subject.threshold * subject.total - 100 * subject.attended) / (100 - subject.threshold));
    return {
      percentage,
      safeSkips,
      recoveryNeeded,
      status: percentage >= subject.threshold ? 'SAFE' : percentage >= subject.threshold - 5 ? 'CRITICAL' : 'DANGER',
    };
  }, [subjects]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (authMode === 'login') {
      await login(email, password);
      return;
    }

    await register({ email, password, firstName, lastName, institutionCode });
  }

  async function handleAddSubject(event: React.FormEvent) {
    event.preventDefault();
    await addSubject({ code: subjectCode, name: subjectName, threshold: subjectThreshold });
    setSubjectCode('');
    setSubjectName('');
  }

  async function handleLogAttendance(event: React.FormEvent) {
    event.preventDefault();
    if (!subjects[0]) return;
    await addAttendance(subjects[0].id, attendanceForm);
    await fetchDashboard();
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/30 lg:grid-cols-2">
            <div className="flex flex-col justify-between bg-gradient-to-br from-cyan-600 via-sky-700 to-indigo-900 p-10">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Attendio</div>
                <h1 className="text-4xl font-bold tracking-tight">Smart attendance management for students who want to stay ahead.</h1>
              </div>
              <div className="mt-10 space-y-4 text-sm text-cyan-50/90">
                <p>• Real-time attendance intelligence</p>
                <p>• Safe-skip and recovery projections</p>
                <p>• Live academic risk monitoring</p>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-6 flex gap-2 rounded-full bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${authMode === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${authMode === 'register' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="First name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0" />
                    <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Last name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0" />
                  </div>
                )}
                {authMode === 'register' && (
                  <input value={institutionCode} onChange={(event) => setInstitutionCode(event.target.value)} placeholder="Institution code" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0" />
                )}
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0" />
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0" />
                {error ? <p className="text-sm text-rose-300">{error}</p> : null}
                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoading ? 'Working...' : authMode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-400"><GraduationCap size={22} /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Attendio</p>
              <h1 className="text-lg font-semibold text-white">Academic risk dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm text-slate-300">
              <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
              <p>{user.institutionCode}</p>
            </div>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:border-slate-500">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <nav className="space-y-2 text-sm">
              {['Dashboard', 'Subjects', 'Calculator', 'Settings'].map((item, index) => (
                <button key={item} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 ${index === 0 ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Activity size={16} /> {item}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard title="Total subjects" value={dashboard?.overview.totalSubjects ?? subjects.length} icon={<GraduationCap />} accent="cyan" />
              <StatCard title="Average attendance" value={`${dashboard?.overview.avgPercentage ?? safeSkip.percentage.toFixed(1) ?? 0}%`} icon={<TrendingUp />} accent="emerald" />
              <StatCard title="At risk" value={dashboard?.overview.atRiskCount ?? 1} icon={<AlertTriangle />} accent="rose" />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Risk alerts</h2>
                  <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-300">Live</span>
                </div>
                <div className="space-y-3">
                  {(dashboard?.alerts?.length ? dashboard.alerts : [{ subjectId: 'demo', subjectCode: 'CS101', title: 'Attendance is slipping', message: 'You need 9 more classes to recover.' }]).map((alert) => (
                    <div key={alert.subjectId} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <p className="text-sm font-medium text-white">{alert.subjectCode}</p>
                      <p className="text-sm text-slate-200">{alert.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="mb-4 text-lg font-semibold text-white">Safe-skip calculator</h2>
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Current attendance</span>
                    <span className="font-semibold text-cyan-300">{safeSkip.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Safe skips</span>
                    <span className="font-semibold text-emerald-300">{safeSkip.safeSkips}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Recovery needed</span>
                    <span className="font-semibold text-amber-300">{safeSkip.recoveryNeeded} classes</span>
                  </div>
                  <div className="mt-2 inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">{safeSkip.status}</div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Subjects</h2>
                  <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950">
                    <Plus size={14} /> New subject
                  </button>
                </div>
                <div className="space-y-3">
                  {subjects.length ? subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <div>
                        <p className="font-medium text-white">{subject.code}</p>
                        <p className="text-sm text-slate-400">{subject.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-cyan-300">{subject.attended}/{subject.total}</p>
                        <p className="text-xs uppercase text-slate-400">{subject.status}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400">No subjects yet. Add your first course above.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="mb-4 text-lg font-semibold text-white">Quick actions</h2>
                <form onSubmit={handleAddSubject} className="space-y-3">
                  <input value={subjectCode} onChange={(event) => setSubjectCode(event.target.value)} placeholder="Course code" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                  <input value={subjectName} onChange={(event) => setSubjectName(event.target.value)} placeholder="Course name" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                  <input type="number" value={subjectThreshold} onChange={(event) => setSubjectThreshold(Number(event.target.value))} placeholder="Attendance threshold" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                  <button type="submit" className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950">Add subject</button>
                </form>

                <form onSubmit={handleLogAttendance} className="mt-6 space-y-3">
                  <label className="flex items-center justify-between text-sm text-slate-300">
                    <span>Attended</span>
                    <input type="checkbox" checked={attendanceForm.attended} onChange={(event) => setAttendanceForm((prev) => ({ ...prev, attended: event.target.checked }))} className="h-4 w-4" />
                  </label>
                  <input type="date" value={attendanceForm.date} onChange={(event) => setAttendanceForm((prev) => ({ ...prev, date: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                  <select value={attendanceForm.type} onChange={(event) => setAttendanceForm((prev) => ({ ...prev, type: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                    <option value="LECTURE">Lecture</option>
                    <option value="LAB">Lab</option>
                    <option value="TUTORIAL">Tutorial</option>
                  </select>
                  <textarea value={attendanceForm.remarks} onChange={(event) => setAttendanceForm((prev) => ({ ...prev, remarks: event.target.value }))} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                  <button type="submit" className="w-full rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950">Log attendance</button>
                </form>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, accent }: { title: string; value: string | number; icon: React.ReactNode; accent: 'cyan' | 'emerald' | 'rose' }) {
  const accentClasses = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className={`inline-flex rounded-xl border p-2 ${accentClasses[accent]}`}>{icon}</div>
      <p className="mt-4 text-sm text-slate-300">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default App;
