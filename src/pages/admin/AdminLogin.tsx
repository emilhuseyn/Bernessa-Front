import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { PageTransition } from '../../components/layout/PageTransition';
import { handleApiError } from '../../utils/errorHandler';
import { LoadingSpinner } from '../../components/ui/Loading';

export default function AdminLogin() {
  const navigate = useNavigate();
  const adminLogin = useAdminStore((state) => state.adminLogin);
  const adminLogout = useAdminStore((state) => state.adminLogout);

  useEffect(() => {
    adminLogout();
  }, [adminLogout]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insights = useMemo(
    () => [
      { title: 'Real-time nəzarət', description: 'Sifarişləri və satışları canlı izləyin' },
      { title: 'Təhlükəsiz giriş', description: 'JWT əsaslı autentifikasiya ilə qorunur' },
      { title: 'Çevik idarəetmə', description: 'Məhsul və kateqoriyaları saniyələr içində yeniləyin' },
    ],
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute -left-16 top-[-10%] h-[420px] w-[420px] rounded-full bg-primary-500/30 blur-[140px]" />
          <div className="absolute right-[-10%] top-[20%] h-[520px] w-[520px] rounded-full bg-secondary-500/25 blur-[160px]" />
          <div className="absolute inset-x-0 bottom-[-30%] h-[460px] bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.035]" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-16 lg:flex-row lg:items-center lg:px-8">
          <div className="mb-12 flex flex-1 flex-col justify-between gap-12 text-white lg:mb-0 lg:pr-12">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Barsense Admin
              </div>
              <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">Müasir idarəetmə panelinə xoş gəldiniz</h1>
              <p className="mt-5 max-w-lg text-base text-slate-200/80 sm:text-lg">
                Satış performansınızı izləyin, komandaya nəzarət edin və biznesinizin hər detalını bir paneldən idarə edin.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {insights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-primary-500/5 backdrop-blur">
                  <p className="text-sm font-semibold text-white/90">{item.title}</p>
                  <p className="mt-2 text-xs text-white/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 justify-end">
            <div className="glass-panel relative w-full max-w-md rounded-[32px] border border-white/20 bg-white/80 p-10 shadow-2xl shadow-primary-500/20 backdrop-blur">
              <div className="absolute -top-10 right-10 hidden h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/40 sm:flex">
                <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div className="mb-8 space-y-2">
                <h2 className="text-3xl font-semibold text-slate-900">Admin giriş</h2>
                <p className="text-sm text-slate-500">Panelə daxil olmaq üçün hesab məlumatlarınızı daxil edin.</p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-600 shadow-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-600">
                    Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-600">
                    Şifrə
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    Məni xatırla
                  </label>
                
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/50 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Giriş edilir...
                    </div>
                  ) : (
                    <>
                      Daxil ol
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400">
                <span>© {new Date().getFullYear()} Barsense Commerce</span>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 font-medium text-primary-500 transition hover:text-primary-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Sayta qayıt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
