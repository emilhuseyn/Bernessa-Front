import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import { categoryService, productService } from '../services';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';
import type { Filter, SortOption, Category, Product } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguageStore } from '../store/languageStore';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const currentLanguage = useLanguageStore(state => state.currentLanguage);
  
  const sortOptions: SortOption[] = useMemo(() => [
    { value: 'popular', label: t('category.popular') },
    { value: 'newest', label: t('category.newest') },
    { value: 'price-low', label: t('category.priceLowToHigh') },
    { value: 'price-high', label: t('category.priceHighToLow') },
  ], [t]);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    rating: 0,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';
  const mediaBaseUrl = useMemo(() => apiBaseUrl.replace(/\/api$/, ''), [apiBaseUrl]);
  const categoryHeroImage = useMemo(() => {
    if (!category) return '';
    const rawImage = category.imageUrl || category.image;
    if (!rawImage) return '';
    if (rawImage.startsWith('http')) return rawImage;
    const normalizedPath = rawImage.replace(/^\/+/g, '');
    return `${mediaBaseUrl}/${normalizedPath}`;
  }, [category, mediaBaseUrl]);

  const categoryName = useMemo(() => {
    if (!category) return '';
    if (currentLanguage === 'en' && category.nameEn) return category.nameEn;
    if (currentLanguage === 'ru' && category.nameRu) return category.nameRu;
    return category.name;
  }, [category, currentLanguage]);

  useEffect(() => {
    const loadCategory = async () => {
      if (!slug) {
        setCategory(null);
        setCategoryProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // First get all categories to find ID by slug
        const allCategories = await categoryService.getAll();
        const foundCategory = allCategories.find(c => c.slug === slug);
        
        if (!foundCategory) {
          throw new Error('Category not found');
        }

        // Then get full category data by ID
        const categoryData = await categoryService.getById(foundCategory.id.toString());
        setCategory(categoryData);

        try {
          const categorySlug = categoryData.slug || slug;
          const productsData = await productService.getByCategory(categorySlug);
          setCategoryProducts(productsData);
        } catch (productError) {
          console.error('Error fetching category products:', productError);
          setCategoryProducts([]);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        const mockCategory = mockCategories.find((c) => c.slug === slug || c.id === slug);
        setCategory(mockCategory || null);

        if (mockCategory) {
          const filtered = mockProducts.filter((p) => p.category === mockCategory.name);
          setCategoryProducts(filtered);
        } else {
          setCategoryProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [slug]);

  // Extract unique brands and volumes from products
  const availableBrands = useMemo(() => {
    const brands = categoryProducts
      .map((p) => p.brand)
      .filter((brand): brand is string => Boolean(brand));
    return [...new Set(brands)].sort();
  }, [categoryProducts]);

  const availableVolumes = useMemo(() => {
    const volumes = categoryProducts
      .map((p) => p.volume)
      .filter((volume): volume is string => Boolean(volume));
    return [...new Set(volumes)].sort();
  }, [categoryProducts]);

  // Calculate max price from available products
  const maxPrice = useMemo(() => {
    if (categoryProducts.length === 0) return 1000;
    return Math.ceil(Math.max(...categoryProducts.map(p => p.price)));
  }, [categoryProducts]);

  // Update filters when max price changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [0, maxPrice]
    }));
  }, [maxPrice]);

  // Apply filters
  let filteredProducts = categoryProducts.filter((product) => {
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) {
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
    setSelectedBrands([]);
    setSelectedVolumes([]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
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
            {categoryHeroImage ? (
              <img
                src={categoryHeroImage}
                alt={category?.name || 'Kateqoriya'}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-primary-900/75" />
            <div className="absolute inset-0 opacity-35">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/40 blur-[150px]" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-500/35 blur-[130px]" />
            </div>
            <div className="container-custom relative z-10">
              <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link to="/" className="hover:text-white transition-colors">{t('category.breadcrumb.home')}</Link>
                <span>/</span>
                <Link to="/categories" className="hover:text-white transition-colors">
                  {t('category.breadcrumb.categories')}
                </Link>
                {category?.slug && (
                  <>
                    <span>/</span>
                    <Link
                      to={`/category/${category.slug}`}
                      className="hover:text-white transition-colors text-white/90"
                    >
                      {categoryName}
                    </Link>
                  </>
                )}
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                {t('category.badge')}
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-display font-bold text-white">
                {categoryName || t('category.badge')}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-white/70">
                {category?.slug && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                    {category.slug}
                  </span>
                )}
                {typeof category?.productCount === 'number' && (
                  <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {category.productCount} {t('category.productsInCatalog')}
                  </span>
                )}
              </div>
              <p className="mt-6 text-lg text-white/70 max-w-2xl">
                {filteredProducts.length > 0
                  ? `${filteredProducts.length} ${t('category.productsAvailable')}`
                  : `${categoryName || t('category.badge')} ${t('category.comingSoon')}`}
              </p>
            </div>
          </div>

          <div className="container-custom py-10">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-2xl shadow-soft">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors md:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {t('category.filters')}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-500">{t('category.sortBy')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
                <div className="bg-white rounded-[2rem] shadow-soft p-8 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-bold text-gray-900">{t('category.filters')}</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t('category.clear')}
                    </button>
                  </div>

                  {/* Price Range Slider */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">{t('category.priceRange')}</h4>
                    <div className="px-1">
                      <div className="relative h-2 bg-gray-200 rounded-full mb-6">
                        <div
                          className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                          style={{
                            left: `${(filters.priceRange[0] / maxPrice) * 100}%`,
                            right: `${100 - (filters.priceRange[1] / maxPrice) * 100}%`,
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          step="1"
                          value={filters.priceRange[0]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [Number(e.target.value), filters.priceRange[1]],
                            })
                          }
                          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                          style={{ zIndex: filters.priceRange[0] > maxPrice / 2 ? 5 : 3 }}
                        />
                        <input
                          type="range"
                          min="0"
                          max={maxPrice}
                          step="1"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [filters.priceRange[0], Number(e.target.value)],
                            })
                          }
                          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                          style={{ zIndex: filters.priceRange[1] <= maxPrice / 2 ? 5 : 3 }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">₼{filters.priceRange[0]}</span>
                        <span className="text-gray-400">—</span>
                        <span className="font-medium text-gray-900">₼{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brands */}
                  {availableBrands.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">{t('category.brands')}</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableBrands.map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                              {brand}
                            </span>
                            <span className="ml-auto text-xs text-gray-400">
                              ({categoryProducts.filter((p) => p.brand === brand).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Volumes */}
                  {availableVolumes.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">{t('category.volume')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableVolumes.map((volume) => (
                          <button
                            key={volume}
                            onClick={() => toggleVolume(volume)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              selectedVolumes.includes(volume)
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {volume}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-[2rem] shadow-soft">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xl text-gray-600 mb-2">
                      {categoryName
                        ? `${categoryName} ${t('category.noCategoryProducts')}`
                        : t('category.noProducts')}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      {t('category.noProductsDesc')}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      {t('category.clearFilters')}
                    </button>
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
