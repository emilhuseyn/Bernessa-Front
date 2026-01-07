import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Brand } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface BrandCardProps {
  brand: Brand;
}

const sanitizeMediaPath = (value: string) => value.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+/, '');

export const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const { t } = useTranslation();
  
  const brandUrl = `/brand/${brand.id}`;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = useMemo(() => apiBaseUrl.replace(/\/?api\/?$/, ''), [apiBaseUrl]);
  const logoSrc = useMemo(() => {
    const rawLogo = brand.logoUrl || brand.logo;
    if (!rawLogo) return '';
    if (rawLogo.startsWith('http')) return rawLogo;
    const normalizedPath = sanitizeMediaPath(rawLogo);
    return `${mediaBaseUrl}/${normalizedPath}`;
  }, [brand.logo, brand.logoUrl, mediaBaseUrl]);
  
  return (
    <Link to={brandUrl} className="group block relative">
      <div className="relative h-[280px] sm:h-[320px] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20 bg-white">
        {/* Logo Container */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={brand.name}
              className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-110"
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                if (target.dataset.fallbackApplied) return;
                target.dataset.fallbackApplied = 'true';
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="text-4xl sm:text-5xl font-bold text-slate-300 dark:text-slate-600">${brand.name.charAt(0)}</div>`;
                }
              }}
            />
          ) : (
            <div className="text-4xl sm:text-5xl font-bold text-slate-300">{brand.name.charAt(0)}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
            <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 mb-2 truncate">
              {brand.name}
            </h3>
            
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="text-primary-600 text-sm font-medium whitespace-nowrap">
                {t('brand.viewProducts')} &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Corner Badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
