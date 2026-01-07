import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import { brandService, productService } from '../services';
import type { Filter, SortOption, Brand, Product } from '../types';
import { useTranslation } from '../hooks/useTranslation';

export const BrandPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  
  const sortOptions: SortOption[] = useMemo(() => [
    { value: 'popular', label: t('category.popular') },
    { value: 'newest', label: t('category.newest') },
    { value: 'price-low', label: t('category.priceLowToHigh') },
    { value: 'price-high', label: t('category.priceHighToLow') },
  ], [t]);
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    rating: 0,
  });
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = useMemo(() => apiBaseUrl.replace(/\/api$/, ''), [apiBaseUrl]);
  const brandLogoImage = useMemo(() => {
    if (!brand) return '';
    const rawImage = brand.logoUrl || brand.logo;
    if (!rawImage) return '';
    if (rawImage.startsWith('http')) return rawImage;
    const normalizedPath = rawImage.replace(/^\/+/g, '');
    return `${mediaBaseUrl}/${normalizedPath}`;
  }, [brand, mediaBaseUrl]);

  useEffect(() => {
    const loadBrand = async () => {
      if (!id) {
        setBrand(null);
        setBrandProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Get brand by ID
        const brandData = await brandService.getById(Number(id));
        setBrand(brandData);

        // Get all products and filter by brand
        try {
          const allProducts = await productService.getAll();
          const filteredProducts = allProducts.filter(p => p.brandId === brandData.id);
          setBrandProducts(filteredProducts);
        } catch (productError) {
          console.error('Error fetching brand products:', productError);
          setBrandProducts([]);
        }
      } catch (error) {
        console.error('Error fetching brand:', error);
        setBrand(null);
        setBrandProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrand();
  }, [id]);

  // Extract unique volumes from products
  const availableVolumes = useMemo(() => {
    const volumes = brandProducts
      .map((p) => p.volume)
      .filter((volume): volume is string => Boolean(volume));
    return [...new Set(volumes)].sort();
  }, [brandProducts]);

  // Calculate max price from available products
  const maxPrice = useMemo(() => {
    if (brandProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...brandProducts.map(p => p.price)));
  }, [brandProducts]);

  // Update filters when max price changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [0, maxPrice]
    }));
  }, [maxPrice]);

  // Apply filters
  let filteredProducts = brandProducts.filter((product) => {
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    if (selectedVolumes.length > 0 && (!product.volume || !selectedVolumes.includes(product.volume))) {
      return false;
    }
    return true;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return 0;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setFilters({
      priceRange: [0, maxPrice],
      sizes: [],
      colors: [],
      rating: 0,
    });
    setSelectedVolumes([]);
  };

  const toggleVolume = (volume: string) => {
    setSelectedVolumes((prev) =>
      prev.includes(volume) ? prev.filter((v) => v !== volume) : [...prev, volume]
    );
  };

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Header */}
          <div className="relative pt-32 pb-16 overflow-hidden">
            {brandLogoImage ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50">
                <img
                  src={brandLogoImage}
                  alt={brand?.name || 'Brand'}
                  className="max-h-64 max-w-md object-contain opacity-20"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-primary-900/75" />
            <div className="absolute inset-0 opacity-35">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/40 blur-[150px]" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-500/35 blur-[130px]" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link to="/" className="hover:text-white transition-colors">{t('category.breadcrumb.home')}</Link>
                <span>/</span>
                <Link to="/brands" className="hover:text-white transition-colors">
                  {t('brands.title')}
                </Link>
                {brand?.name && (
                  <>
                    <span>/</span>
                    <span className="text-white/90">
                      {brand.name}
                    </span>
                  </>
                )}
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                {t('brand.badge')}
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-display font-bold text-white">
                {brand?.name || t('brand.badge')}
              </h1>
              <p className="mt-6 text-lg text-white/70 max-w-2xl">
                {filteredProducts.length > 0
                  ? `${filteredProducts.length} ${t('category.productsAvailable')}`
                  : `${brand?.name || t('brand.badge')} ${t('category.comingSoon')}`}
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-10">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-2xl shadow-lg">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors md:hidden"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {t('category.filters')}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                  {t('category.sortBy')}:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside
                className={`w-full md:w-64 flex-shrink-0 ${
                  showFilters ? 'block' : 'hidden md:block'
                }`}
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">{t('category.filters')}</h2>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {t('category.clear')}
                    </button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">{t('category.priceRange')}</h3>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [0, parseInt(e.target.value)],
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>₼0</span>
                        <span>₼{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Volumes */}
                  {availableVolumes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">{t('category.volume')}</h3>
                      <div className="space-y-2">
                        {availableVolumes.map((volume) => (
                          <label key={volume} className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedVolumes.includes(volume)}
                              onChange={() => toggleVolume(volume)}
                              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                              {volume}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-96 bg-gray-200 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
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
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('category.noProducts')}
                    </h3>
                    <p className="text-gray-600">
                      {t('category.noProductsDesc')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default BrandPage;
