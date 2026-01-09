import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface CategoryCardProps {
  category: Category;
}

const sanitizeMediaPath = (value: string) => value.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+/, '');

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t, currentLanguage } = useTranslation();
  
  // Get translated category name based on current language
  const categoryName = currentLanguage !== 'az' && category.translations?.[currentLanguage] 
    ? category.translations[currentLanguage] 
    : category.name;
  
  // Use slug for URL (cleaner URL structure)
  const categoryUrl = category.slug ? `/category/${category.slug}` : `/category/${category.id}`;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = useMemo(() => apiBaseUrl.replace(/\/?api\/?$/, ''), [apiBaseUrl]);
  const imageSrc = useMemo(() => {
    const rawImage = category.imageUrl || category.image;
    if (!rawImage) return '';
    if (rawImage.startsWith('http')) return rawImage;
    const normalizedPath = sanitizeMediaPath(rawImage);
    return `${mediaBaseUrl}/${normalizedPath}`;
  }, [category.image, category.imageUrl, mediaBaseUrl]);
  
  return (
    <Link to={categoryUrl} className="group block relative">
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl sm:rounded-[2rem] shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20">
        {/* Image Background */}
        <div className="absolute inset-0 bg-gray-200">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={categoryName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          {/* Top: Arrow Icon - Fixed Position */}
          <div className="flex justify-start">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-primary-500 group-hover:border-primary-500 transition-colors duration-300">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          {/* Bottom: Text Content */}
          <div className="transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-display font-bold text-white mb-1 sm:mb-2 drop-shadow-lg line-clamp-2 break-words">
              {categoryName}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-white font-medium whitespace-nowrap">
                {category.productCount} {t('category.products')}
              </span>
              <span className="text-white/80 text-xs sm:text-sm font-medium whitespace-nowrap">{t('category.explore')} &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
