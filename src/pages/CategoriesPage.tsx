import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { CategoryCard } from '../components/category/CategoryCard';
import { categoryService } from '../services';
import { categories as mockCategories } from '../data/mockData';
import { handleApiError } from '../utils/errorHandler';
import type { Category } from '../types';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = useMemo(() => apiBaseUrl.replace(/\/api$/, ''), [apiBaseUrl]);

  const heroImages = useMemo(() => {
    const seen = new Set<string>();
    return categories.reduce<string[]>((list, cat) => {
      const rawImage = cat.imageUrl || cat.image;
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
  }, [categories, mediaBaseUrl]);

  const currentHeroImage = heroImages[currentHeroIndex] || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        const message = handleApiError(error);
        toast.error(message);
        setCategories(mockCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
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
            {currentHeroImage ? (
              <div className="absolute inset-0">
                {heroImages.map((imageUrl, index) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt={t('categories.title')}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                      index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: index === currentHeroIndex ? '0ms' : '0ms' }}
                  />
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-primary-900/70" />
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 left-1/3 w-[26rem] h-[26rem] bg-primary-500/40 blur-[180px]" />
              <div className="absolute bottom-0 right-1/4 w-[22rem] h-[22rem] bg-secondary-500/35 blur-[150px]" />
            </div>

            <div className="container-custom relative z-10">
              <div className="flex flex-col gap-6 max-w-3xl text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                  {t('categories.catalogBadge')}
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                  {t('categories.title')}
                </h1>
                <p className="text-lg text-white/80">
                  {t('categories.subtitle')}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <div className="rounded-full bg-white/10 px-4 py-1.5">
                    {categories.length} {t('categories.count')}
                  </div>
                   
                  <a href="#categories-grid" className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-5 py-2 font-medium shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5">
                    {t('categories.viewAll')}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="categories-grid" className="container-custom py-16">
            <div className="flex items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{t('categories.allCategories')}</h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {t('categories.description')}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-soft p-16 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('categories.noCategories')}</h3>
                <p className="text-gray-500">
                  {t('categories.noCategoriesDesc')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CategoriesPage;
