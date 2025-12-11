import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { useTranslation } from '../hooks/useTranslation';

export const ReturnsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">{t('returns.title')}</h1>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('returns.policy')}</h2>
                  <p className="mb-4">
                    {t('returns.period')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('returns.conditions')}</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>{t('returns.condition1')}</li>
                    <li>{t('returns.condition2')}</li>
                    <li>{t('returns.condition3')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('returns.howto')}</h2>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>{t('returns.step1')}</li>
                    <li>{t('returns.step2')}</li>
                    <li>{t('returns.step3')}</li>
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
