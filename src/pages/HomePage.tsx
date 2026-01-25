import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/category/CategoryCard';
import { categoryService, productService, brandService, contactSettingService } from '../services';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';
import type { Category, Product, Brand, ContactSetting } from '../types';
import { handleApiError } from '../utils/errorHandler';
import { useTranslation } from '../hooks/useTranslation';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [contactSettings, setContactSettings] = useState<ContactSetting | null>(null);
  const [heroImageLoading, setHeroImageLoading] = useState(true);
  const allProductsRef = useRef<Product[] | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = apiBaseUrl.replace(/\/?api\/?$/, '');

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
      setBrandsLoading(true);

      // Fetch hero image first and in parallel with other data
      const heroImagePromise = (async () => {
        try {
          const contactData = await contactSettingService.getActiveContactSetting();
          if (contactData) {
            setContactSettings(contactData);
            // Preload the image immediately
            if (contactData.contactImage) {
              const img = new Image();
              img.src = `${mediaBaseUrl}${contactData.contactImage}`;
              img.onload = () => setHeroImageLoading(false);
              img.onerror = () => setHeroImageLoading(false);
            } else {
              setHeroImageLoading(false);
            }
          } else {
            setHeroImageLoading(false);
          }
        } catch (error) {
          console.error('Error fetching contact settings:', error);
          setHeroImageLoading(false);
        }
      })();

      // Fetch categories
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
        const brandsData = await brandService.getAll();
        setBrands(brandsData.slice(0, 8));
      } catch (brandsError) {
        const message = handleApiError(brandsError);
        if (message && message !== 'Məlumat tapılmadı') {
          toast.error(message);
        }
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }

      // Wait for hero image to be handled
      await heroImagePromise;
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <PageTransition>
        {/* Hero Banner */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden pt-16">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-white">
          </div>

          <div className="w-full h-full relative">
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-600">{t('home.hero.badge')}</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-display font-bold leading-[1.3] text-gray-900 pb-4 overflow-visible">
                  <span className="inline-block animate-float">{t('home.hero.title')}</span> <br/>
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 animate-float pb-3 mb-2">{t('home.hero.titleAccent')}</span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed mt-4">
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
              </div> */}

              {/* <div className="relative hidden lg:block"> */}
                <div className="w-full h-full">
                  {heroImageLoading ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  ) : contactSettings?.contactImage ? (
                    <img 
                      src={`${mediaBaseUrl}${contactSettings.contactImage}`}
                      alt="Luxury Perfume" 
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  ) : null}
                  
                  {/* Floating Cards */}
                  {/* <div className="absolute -left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
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
                  </div> */}
                </div>
              {/* </div> */}
            {/* </div> */}
          </div>
        </section>

        {/* Categories Section */}
        <section className="container-custom py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.categories.title')}</h2>
              <p className="text-gray-600 mt-2">{t('home.categories.subtitle')}</p>
            </div>
            <Link to="/categories" className="text-black font-medium hover:text-gray-700">
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

        {/* Brands Section */}
        <section className="container-custom py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.brands.title')}</h2>
              <p className="text-gray-600 mt-2">{t('home.brands.subtitle')}</p>
            </div>
            <Link
              to="/brands"
              className="text-black font-medium hover:text-gray-700"
            >
              {t('home.brands.viewAll')} →
            </Link>
          </div>

          {brandsLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-12 w-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brand/${brand.id}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                >
                  <div className="aspect-square w-full overflow-hidden bg-slate-50">
                    {brand.logo && (
                      <img
                        src={`${mediaBaseUrl}/${brand.logo?.replace(/^\/+/, '')}`}
                        alt={brand.name}
                        className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-2 md:p-3 text-center">
                    <h3 className="truncate text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                      {brand.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-10 text-center">
              <p className="text-gray-600 dark:text-slate-400">{t('home.brands.noBrands')}</p>
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section className="container-custom py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('home.featured.title')}</h2>
              <p className="text-gray-600 mt-2">{t('home.featured.subtitle')}</p>
            </div>
            <Link to="/search" className="text-black font-medium hover:text-gray-700">
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
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('home.features.freeShipping')}</h3>
                <p className="text-gray-600">{t('home.features.freeShippingDesc')}</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t('home.features.securePayment')}</h3>
                <p className="text-gray-600">{t('home.features.securePaymentDesc')}</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
