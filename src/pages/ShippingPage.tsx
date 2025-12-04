import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';

export const ShippingPage: React.FC = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Çatdırılma Məlumatları</h1>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Çatdırılma Müddəti</h2>
                  <p className="mb-4">
                    Sifarişləriniz təsdiqləndikdən sonra 24 saat ərzində kuryerə təhvil verilir. Bakı daxili çatdırılma 1-2 iş günü, bölgələrə isə 3-5 iş günü ərzində həyata keçirilir.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Çatdırılma Qiymətləri</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Bakı daxili standart çatdırılma: <strong>5 AZN</strong></li>
                    <li>Bakı daxili sürətli çatdırılma (eyni gün): <strong>10 AZN</strong></li>
                    <li>Bölgələrə çatdırılma: <strong>8 AZN</strong></li>
                    <li><strong>50 AZN</strong>-dən yuxarı sifarişlərdə çatdırılma pulsuzdur.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Sifarişin İzlənməsi</h2>
                  <p>
                    Sifarişiniz kuryerə təhvil verildikdə sizə SMS və email vasitəsilə izləmə kodu göndəriləcək. Bu kod vasitəsilə sifarişinizin statusunu izləyə bilərsiniz.
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
