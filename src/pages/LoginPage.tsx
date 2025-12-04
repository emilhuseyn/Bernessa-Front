import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';

export const LoginPage: React.FC = () => {
  return (
    <PageTransition>
      <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute left-[20%] top-[18%] h-56 w-56 rounded-full bg-primary-500/25 blur-[150px]" />
          <div className="absolute right-[12%] top-[40%] h-72 w-72 rounded-full bg-secondary-500/15 blur-[170px]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] backdrop-blur">
            Barsense
          </span>

          <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
            Müştəri girişi mövcud deyil
          </h1>

          <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
            Barsense mağazasında alış-veriş zamanı ayrıca istifadəçi hesabı tələb olunmur. Sifarişləriniz checkout prosesində daxil etdiyiniz məlumatlarla emal edilir və təsdiq e-poçt ünvanınıza göndərilir.
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
              Sifarişim barədə soruş
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-primary-300 transition hover:text-primary-200"
            >
              Admin giriş
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};
