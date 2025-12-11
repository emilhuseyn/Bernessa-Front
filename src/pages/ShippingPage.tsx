import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { useTranslation } from '../hooks/useTranslation';

export const ShippingPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">{t('shipping.title')}</h1>
              
              <div className="space-y-8 text-gray-600">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('shipping.deliveryTime')}</h2>
                  <p className="mb-4">
                    {t('shipping.deliveryTimeDesc')}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('shipping.pricing')}</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{t('shipping.bakuStandard')}: <strong>5 AZN</strong></li>
                    <li>{t('shipping.bakuExpress')}: <strong>10 AZN</strong></li>
                    <li>{t('shipping.regionsPrice')}: <strong>8 AZN</strong></li>
                    <li><strong>50 AZN</strong>{t('shipping.freeShippingNote')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('shipping.tracking')}</h2>
                  <p>
                    {t('shipping.trackingDesc')}
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
