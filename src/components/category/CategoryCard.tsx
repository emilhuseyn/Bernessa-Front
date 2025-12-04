import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface CategoryCardProps {
  category: Category;
}

const sanitizeMediaPath = (value: string) => value.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+/, '');

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useTranslation();
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
      <div className="relative h-[400px] overflow-hidden rounded-[2rem] shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20">
        {/* Image Background */}
        <div className="absolute inset-0 bg-gray-200">
          <img
            src={imageSrc || 'https://via.placeholder.com/400x500?text=' + encodeURIComponent(category.name)}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(event) => {
              const target = event.target as HTMLImageElement;
              if (target.dataset.fallbackApplied) return;
              target.dataset.fallbackApplied = 'true';
              target.src = 'https://via.placeholder.com/400x500?text=' + encodeURIComponent(category.name);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-primary-500 group-hover:border-primary-500 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-lg">
              {category.name}
            </h3>
            
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm text-white font-medium">
                {category.productCount} {t('category.products')}
              </span>
              <span className="text-white/80 text-sm font-medium">{t('category.explore')} &rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
