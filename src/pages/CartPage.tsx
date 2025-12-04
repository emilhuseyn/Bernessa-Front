import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { EmptyState } from '../components/ui/EmptyState';
import { useCartStore } from '../store/cartStore';
import { useTranslation } from '../hooks/useTranslation';

export const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-[60vh] flex items-center justify-center">
            <EmptyState
              icon={
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-float">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              }
              title={t('cart.empty')}
              description={t('cart.emptyDesc')}
              actionLabel={t('cart.startShopping')}
              onAction={() => navigate('/')}
            />
          </div>
        </PageTransition>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
          <div className="container-custom">
            <h1 className="text-4xl font-display font-bold mb-8 text-gray-900">{t('cart.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-6">
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="flex gap-3 text-sm text-gray-500 mb-4">
                            {item.size && <span className="bg-gray-100 px-2 py-1 rounded-md">{t('cart.size')}: {item.size}</span>}
                            {item.color && <span className="bg-gray-100 px-2 py-1 rounded-md">{t('cart.color')}: {item.color}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-xl font-bold text-gray-900">
                            {(item.price * item.quantity).toFixed(2)} ₼
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('cart.orderSummary')}</h2>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('cart.total')}</span>
                        <span className="text-3xl font-bold text-primary-600">{total.toFixed(2)} ₼</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all duration-300"
                    >
                      {t('cart.checkout')}
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      className="w-full mt-4 py-3 text-gray-500 font-medium hover:text-gray-900 transition-colors"
                    >
                      {t('cart.continueShopping')}
                    </button>
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
