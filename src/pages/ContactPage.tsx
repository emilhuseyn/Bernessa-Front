import type { FC } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';

export const ContactPage: FC = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">Bizimlə Əlaqə</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Əlaqə Məlumatları</h3>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>Bakı şəhəri, Nizami küçəsi 123, AZ1000</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span>support@Barsense.az</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <span>+994 50 123 45 67</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">İş Saatları</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Bazar ertəsi - Cümə</span>
                      <span className="font-medium">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Şənbə</span>
                      <span className="font-medium">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bazar</span>
                      <span className="font-medium">İstirahət günü</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Müştəri Xidməti</h3>
                <p className="text-gray-600 leading-relaxed">
                  Komandamız bütün suallarınız üçün həftə içi günlərində sizinlədir. Qısa zamanda cavablandırılması üçün zəhmət olmasa telefon və ya email vasitəsilə əlaqə saxlayın. Sosial media kanallarımızdan da bizə yaza bilərsiniz.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Telefon</p>
                    <p className="mt-1 font-semibold text-gray-900">+994 50 123 45 67</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                    <p className="mt-1 font-semibold text-gray-900">support@Barsense.az</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Whatsapp / Telegram</p>
                    <p className="mt-1 font-semibold text-gray-900">+994 55 765 43 21</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Instagram</p>
                    <p className="mt-1 font-semibold text-primary-600">@Barsense.az</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
