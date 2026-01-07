import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { EmptyState } from '../components/ui/EmptyState';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useTranslation } from '../hooks/useTranslation';

export const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      volume: item.volume,
    });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-[60vh] flex items-center justify-center">
            <EmptyState
              icon={
                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6 animate-float">
                  <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              }
              title={t('wishlist.empty')}
              description={t('wishlist.emptyDesc')}
              actionLabel={t('wishlist.startShopping')}
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">{t('wishlist.favorites')}</p>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">{t('wishlist.title')}</h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-red-600">{items.length} {t('wishlist.products')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map((item, index) => (
                <div
                  key={item.productId}
                  className="group bg-white rounded-[2rem] shadow-soft overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 group/btn"
                    >
                      <svg className="w-5 h-5 text-red-500 group-hover/btn:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6">
                    <h3
                      className="font-display font-bold text-lg text-gray-900 mb-2 cursor-pointer hover:text-primary-600 transition-colors line-clamp-2"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.name}
                    </h3>
                    {item.volume && (
                      <p className="text-sm text-gray-500 mb-2">Həcm: {item.volume}</p>
                    )}
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      {item.price.toFixed(2)} ₼
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {t('wishlist.moveToCart')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
