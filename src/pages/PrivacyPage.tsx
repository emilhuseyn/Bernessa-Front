import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';

export const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Məxfilik Siyasəti</h1>
              
              <div className="space-y-6 text-gray-600">
                <p>Son yenilənmə tarixi: 1 Dekabr 2025</p>
                
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">1. Məlumatların Toplanması</h2>
                  <p>
                    Biz sizin adınız, email ünvanınız, telefon nömrəniz və çatdırılma ünvanınız kimi şəxsi məlumatları yalnız sifarişlərinizi yerinə yetirmək məqsədilə toplayırıq.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">2. Məlumatların İstifadəsi</h2>
                  <p>
                    Toplanan məlumatlar aşağıdakı məqsədlər üçün istifadə olunur:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Sifarişlərin emalı və çatdırılması</li>
                    <li>Müştəri dəstəyinin təmin edilməsi</li>
                    <li>Kampaniyalar haqqında məlumatlandırma (istəyə bağlı)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">3. Məlumatların Qorunması</h2>
                  <p>
                    Sizin şəxsi məlumatlarınızın təhlükəsizliyi bizim üçün prioritetdir. Biz məlumatlarınızı qorumaq üçün müasir şifrələmə texnologiyalarından istifadə edirik.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">4. Üçüncü Tərəflər</h2>
                  <p>
                    Biz sizin məlumatlarınızı heç bir halda üçüncü tərəflərə satmırıq. Yalnız çatdırılma xidməti kimi tərəfdaşlarımızla zəruri məlumatlar paylaşılır.
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
