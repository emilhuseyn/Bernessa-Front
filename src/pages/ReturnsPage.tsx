import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';

export const ReturnsPage: React.FC = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Qaytarma və Dəyişdirmə</h1>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Qaytarma Şərtləri</h2>
                  <p className="mb-4">
                    Məhsulu təhvil aldığınız tarixdən etibarən 14 gün ərzində qaytara və ya dəyişdirə bilərsiniz. Qaytarılan məhsul istifadə olunmamış, etiketi qoparılmamış və orijinal qablaşdırmada olmalıdır.
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
