import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute left-[12%] top-[18%] h-64 w-64 rounded-full bg-primary-500/25 blur-[160px]" />
          <div className="absolute right-[5%] top-[30%] h-80 w-80 rounded-full bg-secondary-500/20 blur-[180px]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center text-white">
          <div className="flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.4em] backdrop-blur">
              404
            </span>

            <div className="flex flex-col items-center gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">Səhifə tapılmadı</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Ups! Bu ünvan artıq mövcud deyil
              </h1>
              <p className="max-w-2xl text-base text-white/70 sm:text-lg">
                Narahat olmayın, sizi doğru istiqamətə yönləndirək. Aşağıdakı seçimlərlə Barsense dünyasını kəşf etməyə davam edə bilərsiniz.
              </p>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-primary-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Əsas səhifəyə qayıt
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Kateqoriyalara bax
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white/70 transition hover:text-white"
              >
                Geri qayıt
              </button>
            </div>

            <div className="mt-10 grid w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-primary-500/10 backdrop-blur-sm sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-white/90">Populyar istiqamətlər</h2>
                <Link to="/deals" className="text-xs text-white/70 transition hover:text-white">
                  Endirimli məhsullar
                </Link>
                <Link to="/faq" className="text-xs text-white/70 transition hover:text-white">
                  Tez-tez soruşulanlar
                </Link>
                <Link to="/contact" className="text-xs text-white/70 transition hover:text-white">
                  Bizimlə əlaqə
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-white/90">Məlumat</h2>
                <Link to="/shipping" className="text-xs text-white/70 transition hover:text-white">
                  Çatdırılma qaydaları
                </Link>
                <Link to="/returns" className="text-xs text-white/70 transition hover:text-white">
                  Qaytarılma siyasəti
                </Link>
                <Link to="/terms" className="text-xs text-white/70 transition hover:text-white">
                  Şərtlər və qaydalar
                </Link>
              </div>
               
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
