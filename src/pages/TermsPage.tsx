import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';

export const TermsPage: React.FC = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">İstifadə Şərtləri</h1>
              
              <div className="space-y-6 text-gray-600">
                <p>Son yenilənmə tarixi: 1 Dekabr 2025</p>
                
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">1. Ümumi Müddəalar</h2>
                  <p>
                    Bu veb-saytdan istifadə etməklə siz aşağıdakı şərtləri qəbul etmiş olursunuz. Barsense bu şərtləri istənilən vaxt dəyişdirmək hüququnu özündə saxlayır.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">2. Sifariş və Ödəniş</h2>
                  <p>
                    Sifarişlər sayt vasitəsilə qəbul edilir. Ödənişlər bank kartı və ya nağd şəkildə həyata keçirilə bilər. Qiymətlərə ƏDV daxildir.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">3. Məhsul Məlumatları</h2>
                  <p>
                    Biz məhsul məlumatlarının dəqiqliyinə çalışırıq, lakin rənglər və ölçülərdə kiçik fərqlər ola bilər.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">4. Əqli Mülkiyyət</h2>
                  <p>
                    Saytdakı bütün məzmun (logo, mətnlər, şəkillər) Barsense-a məxsusdur və icazəsiz istifadəsi qadağandır.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
