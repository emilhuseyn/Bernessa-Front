import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/category/CategoryCard';
import { categoryService, productService } from '../services';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';
import type { Category, Product } from '../types';
import { handleApiError } from '../utils/errorHandler';
import { useTranslation } from '../hooks/useTranslation';

export const HomePage: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const allProductsRef = useRef<Product[] | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = apiBaseUrl.replace(/\/?api\/?$/, '');
  const fallbackDealImage = 'https://via.placeholder.com/400x500?text=Endirimli+M%C9%99hsul';

  const sanitizeMediaPath = (value: string) =>
    value
      ? value.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+/, '')
      : '';

  const resolveProductImage = (product: Product) => {
    const raw = product.images?.[0] || product.imageUrls?.[0] || '';

    if (!raw) {
      return fallbackDealImage;
    }

    if (/^https?:/i.test(raw)) {
      return raw;
    }

    const normalized = sanitizeMediaPath(raw);
    if (!normalized) {
      return fallbackDealImage;
    }

    return `${mediaBaseUrl}/${normalized}`;
  };

  const computeDiscount = (product: Product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return 0;
    }
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const computeTopDiscounts = (products: Product[], limit = 4) => {
    return products
      .filter((product) => computeDiscount(product) > 0)
      .sort((a, b) => computeDiscount(b) - computeDiscount(a))
      .slice(0, limit);
  };

  const ensureAllProducts = async (): Promise<Product[]> => {
    if (allProductsRef.current) {
      return allProductsRef.current;
    }
    const allProducts = await productService.getAll({ includeInactive: true });
    allProductsRef.current = allProducts;
    return allProducts;
  };

  useEffect(() => {
    const fetchData = async () => {
      setCategoriesLoading(true);
      setFeaturedLoading(true);
      setDealsLoading(true);

      try {
        const categoriesData = await categoryService.getAll();
        setCategories(categoriesData);
      } catch (error) {
        const message = handleApiError(error);
        if (message && message !== 'Məlumat tapılmadı') {
          toast.error(message);
        }
        setCategories(mockCategories);
      } finally {
        setCategoriesLoading(false);
      }

      try {
        let featuredData = await productService.getFeatured();

        if (!featuredData || featuredData.length === 0) {
          try {
            const allProducts = await ensureAllProducts();
            const featuredFromAll = allProducts.filter((product) => product.isFeatured);
            const fallbackFeatured = featuredFromAll.length > 0 ? featuredFromAll : computeTopDiscounts(allProducts, 8);
            featuredData = fallbackFeatured.slice(0, 8);
          } catch (fallbackError) {
            const message = handleApiError(fallbackError);
            if (message && message !== 'Məlumat tapılmadı') {
              toast.error(message);
            }
            featuredData = mockProducts.slice(0, 8);
          }
        }

        setFeaturedProducts(featuredData.slice(0, 8));
      } catch (featuredError) {
        const message = handleApiError(featuredError);
        if (message && message !== 'Məlumat tapılmadı') {
          toast.error(message);
        }
        setFeaturedProducts(mockProducts.slice(0, 8));
      } finally {
        setFeaturedLoading(false);
      }

      try {
        let dealsData = await productService.getDeals();

        if (!dealsData || dealsData.length === 0) {
          try {
            const allProducts = await ensureAllProducts();
            const topDiscounts = computeTopDiscounts(allProducts, 4);
            dealsData = (topDiscounts.length > 0 ? topDiscounts : allProducts.slice(0, 4)).slice(0, 4);
          } catch (fallbackError) {
            const message = handleApiError(fallbackError);
            if (message && message !== 'Məlumat tapılmadı') {
              toast.error(message);
            }
            let fallbackDeals = computeTopDiscounts(mockProducts, 4);
            if (fallbackDeals.length === 0) {
              fallbackDeals = mockProducts.slice(0, 4);
            }
            dealsData = fallbackDeals;
          }
        }

        setDealsProducts(dealsData.slice(0, 4));
      } catch (dealsError) {
        const message = handleApiError(dealsError);
        if (message && message !== 'Məlumat tapılmadı') {
          toast.error(message);
        }
        let fallbackDeals = computeTopDiscounts(mockProducts, 4);
        if (fallbackDeals.length === 0) {
          fallbackDeals = mockProducts.slice(0, 4);
        }
        setDealsProducts(fallbackDeals);
      } finally {
        setDealsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <PageTransition>
        {/* Hero Banner */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden pt-24">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          </div>

          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-600">{t('home.hero.badge')}</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-gray-900">
                  <span className="inline-block animate-float">{t('home.hero.title')}</span> <br/>
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 animate-float">{t('home.hero.titleAccent')}</span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  {t('home.hero.subtitle')}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/categories">
                    <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
                      {t('home.hero.cta')}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                  </Link>
                
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">10k+</p>
                    <p className="text-sm text-gray-500">{t('home.stats.customers')}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">500+</p>
                    <p className="text-sm text-gray-500">{t('home.stats.products')}</p>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative z-10 animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Luxury Perfume" 
                    className="rounded-[2.5rem] shadow-2xl w-full max-w-md mx-auto object-cover aspect-[3/4]"
                  />
                  
                  {/* Floating Cards */}
                  <div className="absolute -left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t('home.floatingCard.original')}</p>
                        <p className="text-xs text-gray-500">{t('home.floatingCard.guaranteed')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t('home.floatingCard.freeShipping')}</p>
                        <p className="text-xs text-gray-500">{t('home.floatingCard.over50')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-200 rounded-full opacity-50 animate-spin-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-gray-100 rounded-full opacity-30 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container-custom py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.categories.title')}</h2>
              <p className="text-gray-600 mt-2">{t('home.categories.subtitle')}</p>
            </div>
            <Link to="/categories" className="text-primary-600 font-medium hover:text-primary-700">
              {t('home.featured.viewAll')} →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categoriesLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-600">
                {t('home.categories.noCategories')}
              </div>
            ) : (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </section>

        {/* Flash Sale Banner */}
        <section className="text-white relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
          <div className="container-custom py-12 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{t('home.deals.flashSale')}</h2>
                <p className="text-lg text-gray-300 drop-shadow">{t('home.deals.upTo50')}</p>
              </div>
              <Link to="/deals" className="self-start lg:self-auto">
                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  {t('home.deals.viewDeals')}
                </button>
              </Link>
            </div>

            <div className="mt-10">
              {dealsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-12 w-12 border-4 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              ) : dealsProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {dealsProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white/10 p-10 text-center">
                  <p className="text-sm font-medium text-white/80">{t('home.deals.noDeals')}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container-custom py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.featured.title')}</h2>
              <p className="text-gray-600 mt-2">{t('home.featured.subtitle')}</p>
            </div>
            <Link to="/search" className="text-primary-600 font-medium hover:text-primary-700">
              {t('home.featured.viewAll')} →
            </Link>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-12 w-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft p-10 text-center">
              <p className="text-gray-600 mb-4">{t('home.featured.noProducts')}</p>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                {t('home.featured.goToCategories')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
          <div className="container-custom py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('home.features.freeShipping')}</h3>
                <p className="text-gray-600">{t('home.features.freeShippingDesc')}</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('home.features.securePayment')}</h3>
                <p className="text-gray-600">{t('home.features.securePaymentDesc')}</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('home.features.easyReturns')}</h3>
                <p className="text-gray-600">{t('home.features.easyReturnsDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};
