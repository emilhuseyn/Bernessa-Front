import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { BrandCard } from '../components/brand/BrandCard';
import { brandService } from '../services';
import { handleApiError } from '../utils/errorHandler';
import type { Brand } from '../types';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export const BrandsPage: React.FC = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = useMemo(() => apiBaseUrl.replace(/\/api$/, ''), [apiBaseUrl]);

  const heroImages = useMemo(() => {
    const seen = new Set<string>();
    return brands.reduce<string[]>((list, brand) => {
      const rawImage = brand.logoUrl || brand.logo;
      if (!rawImage) {
        return list;
      }

      const imageUrl = rawImage.startsWith('http')
        ? rawImage
        : `${mediaBaseUrl}/${rawImage.replace(/^\/+/g, '')}`;

      if (!seen.has(imageUrl)) {
        seen.add(imageUrl);
        list.push(imageUrl);
      }
      return list;
    }, []);
  }, [brands, mediaBaseUrl]);

  const currentHeroImage = heroImages[currentHeroIndex] || '';

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const data = await brandService.getAll();
        setBrands(data);
      } catch (error) {
        const message = handleApiError(error);
        toast.error(message);
        setBrands([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (!heroImages.length) {
      setCurrentHeroIndex(0);
      return;
    }

    setCurrentHeroIndex(Math.floor(Math.random() * heroImages.length));

    const intervalId = window.setInterval(() => {
      setCurrentHeroIndex((prev) => {
        if (heroImages.length <= 1) {
          return prev;
        }

        let nextIndex = prev;
        while (nextIndex === prev) {
          nextIndex = Math.floor(Math.random() * heroImages.length);
        }
        return nextIndex;
      });
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [heroImages]);

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          <div className="relative pt-32 pb-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

            {/* Brand Logos Background */}
            {heroImages.length > 0 && (
              <div className="absolute inset-0 overflow-hidden">
                <div className={`grid grid-cols-6 gap-8 p-8 transition-opacity duration-1000 ease-in-out`}>
                  {[...Array(24)].map((_, i) => {
                    const imageUrl = heroImages[i % heroImages.length];
                    return (
                      <div key={i} className="flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt={t('brands.title')}
                          className="h-24 w-24 object-contain opacity-15 blur-[1px] filter brightness-200"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-50" />
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {t('brands.title')}
                </h1>
                <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
                  {t('brands.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 sm:py-12">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[280px] sm:h-[320px] bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('brands.noBrands')}
                </h3>
                <p className="text-gray-600">
                  {t('brands.noBrandsDescription')}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-gray-600">
                    {t('brands.showing')} {brands.length} {brands.length === 1 ? t('brands.brand') : t('brands.brands')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default BrandsPage;
