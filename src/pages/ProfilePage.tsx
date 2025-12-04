import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <PageTransition>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute left-[12%] top-[18%] h-64 w-64 rounded-full bg-primary-500/25 blur-[160px]" />
            <div className="absolute right-[5%] top-[30%] h-80 w-80 rounded-full bg-secondary-500/20 blur-[180px]" />
            <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] backdrop-blur">
              Barsense
            </div>

            <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
              Müştəri hesabı funksiyası hazırda aktiv deyil
            </h1>

            <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
              Barsense onlayn mağazasında alış-veriş etmək üçün ayrıca istifadəçi hesabı tələb olunmur. Sifarişlərinizi checkout zamanı daxil etdiyiniz məlumatlar əsasında emal edirik.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
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
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Bizimlə əlaqə saxla
              </Link>
            </div>

            <div className="mt-12 grid w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-primary-500/10 backdrop-blur-sm sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-white/90">Sifariş izləmə</h2>
                <p className="text-xs text-white/70">
                  Tamamlama zamanı əldə etdiyiniz sifariş nömrəsi və e-poçtla dəstək komandamızla əlaqə saxlayın.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-white/90">Bonuslar & kampaniyalar</h2>
                <p className="text-xs text-white/70">
                  Xüsusi təkliflər haqqında məlumat almaq üçün e-poçtunuzu checkout-da qeyd edin.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-white/90">Admin giriş</h2>
                <Link to="/admin/login" className="text-xs font-semibold text-primary-300 transition hover:text-primary-200">
                  İdarə panelinə daxil olmaq
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};
