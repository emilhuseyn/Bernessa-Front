import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import type { Filter, Product, SortOption } from '../types';
import { productService } from '../services';
import { handleApiError } from '../utils/errorHandler';
import { LoadingCard } from '../components/ui/Loading';

const sortOptions: SortOption[] = [
  { value: 'discount', label: 'Ən Böyük Endirim' },
  { value: 'price-low', label: 'Qiymət: Azdan çoxa' },
  { value: 'price-high', label: 'Qiymət: Çoxdan aza' },
  { value: 'rating', label: 'Ən Yüksək Reytinq' },
];

export const DealsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('discount');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    priceRange: [0, 0],
    sizes: [],
    colors: [],
    rating: 0,
  });
  const [deals, setDeals] = useState<Product[]>([]);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  const loadDeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getDeals();
      setDeals(response);

      if (response.length > 0) {
        const prices = response
          .map((product) => Number(product.price))
          .filter((price) => Number.isFinite(price));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        const bounds: [number, number] = [Number.isFinite(minPrice) ? minPrice : 0, Number.isFinite(maxPrice) ? maxPrice : 0];
        setPriceBounds(bounds);
        setFilters((prev) => ({
          ...prev,
          priceRange: [...bounds] as [number, number],
        }));
      } else {
        setPriceBounds([0, 0]);
        setFilters((prev) => ({
          ...prev,
          priceRange: [0, 0],
        }));
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  // Extract unique brands and volumes from deals
  const availableBrands = useMemo(() => {
    const brands = deals
      .map((p) => p.brand)
      .filter((brand): brand is string => Boolean(brand));
    return [...new Set(brands)].sort();
  }, [deals]);

  const availableVolumes = useMemo(() => {
    const volumes = deals
      .map((p) => p.volume)
      .filter((volume): volume is string => Boolean(volume));
    return [...new Set(volumes)].sort();
  }, [deals]);

  const filteredProducts = useMemo(() => {
    const [minPrice, maxPrice] = filters.priceRange;

    return deals
      .filter((product) => {
        const price = Number(product.price);
        if (!Number.isFinite(price)) {
          return false;
        }

        if (price < minPrice || price > maxPrice) {
          return false;
        }

        if (filters.rating > 0 && (product.rating ?? 0) < filters.rating) {
          return false;
        }

        if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) {
          return false;
        }

        if (selectedVolumes.length > 0 && (!product.volume || !selectedVolumes.includes(product.volume))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return Number(a.price) - Number(b.price);
          case 'price-high':
            return Number(b.price) - Number(a.price);
          case 'rating':
            return (Number(b.rating) || 0) - (Number(a.rating) || 0);
          case 'discount':
          default: {
            const discountA = Number((a.originalPrice ?? a.price) ?? 0) - Number(a.price ?? 0);
            const discountB = Number((b.originalPrice ?? b.price) ?? 0) - Number(b.price ?? 0);
            return discountB - discountA;
          }
        }
      });
  }, [deals, filters, sortBy, selectedBrands, selectedVolumes]);

  const hasRatingData = useMemo(() => deals.some((product) => Number(product.rating) > 0), [deals]);

  useEffect(() => {
    if (!hasRatingData && sortBy === 'rating') {
      setSortBy('discount');
    }

    if (!hasRatingData) {
      setFilters((prev) => (prev.rating === 0 ? prev : { ...prev, rating: 0 }));
    }
  }, [hasRatingData, sortBy]);

  const clearFilters = () => {
    setFilters({
      priceRange: [...priceBounds] as [number, number],
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
          <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-primary-900 pt-32 pb-16 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/50 blur-[150px]"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/40 blur-[120px]"></div>
            </div>
            <div className="container-custom relative z-10">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Xüsusi Təkliflər</p>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                Günün Fürsətləri
              </h1>
              <p className="text-lg text-white/70 max-w-xl">
                Ən yaxşı endirimlər və xüsusi təkliflər. {filteredProducts.length} məhsul endirimdədir.
              </p>
              {error && (
                <div className="mt-4 inline-flex items-center rounded-xl bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                  {error}
                </div>
              )}
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
                Filtrlər
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-500">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={!hasRatingData && option.value === 'rating'}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
                <div className="bg-white rounded-[2rem] shadow-soft p-8 lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-bold text-gray-900">Filtrlər</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Təmizlə
                    </button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Qiymət Aralığı</h4>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₼</span>
                        <input
                          type="number"
                          value={filters.priceRange[0]}
                          min={priceBounds[0]}
                          max={filters.priceRange[1]}
                          onChange={(e) => {
                            const rawValue = Number(e.target.value);
                            const safeValue = Number.isFinite(rawValue)
                              ? Math.min(Math.max(rawValue, priceBounds[0]), priceBounds[1])
                              : priceBounds[0];
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [safeValue, Math.max(safeValue, prev.priceRange[1])],
                            }));
                          }}
                          className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <span className="text-gray-400">—</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₼</span>
                        <input
                          type="number"
                          value={filters.priceRange[1]}
                          min={filters.priceRange[0]}
                          max={priceBounds[1]}
                          onChange={(e) => {
                            const rawValue = Number(e.target.value);
                            const safeValue = Number.isFinite(rawValue)
                              ? Math.min(Math.max(rawValue, priceBounds[0]), priceBounds[1])
                              : priceBounds[1];
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [Math.min(prev.priceRange[0], safeValue), safeValue],
                            }));
                          }}
                          className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brands */}
                  {availableBrands.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Brendlər</h4>
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
                              ({deals.filter((p) => p.brand === brand).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Volumes */}
                  {availableVolumes.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Həcm</h4>
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

                  {/* Rating */}
                  {hasRatingData && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900 mb-4">Minimum Reytinq</h4>
                      <div className="space-y-3">
                        {[4, 3, 2, 1].map((rating) => (
                          <label
                            key={rating}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                              filters.rating === rating
                                ? 'bg-primary-50 border border-primary-200'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <input
                              type="radio"
                              name="rating"
                              checked={filters.rating === rating}
                              onChange={() => setFilters((prev) => ({ ...prev, rating }))}
                              className="sr-only"
                            />
                            <div className="flex items-center text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300 fill-current'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">və yuxarı</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3 space-y-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <LoadingCard />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-white rounded-[2rem] shadow-soft p-10 text-center">
                    <p className="text-lg text-gray-600 mb-4">Təklifləri yükləmək mümkün olmadı.</p>
                    <button
                      onClick={loadDeals}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      Yenidən cəhd et
                    </button>
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
                    <p className="text-xl text-gray-600 mb-4">Hal-hazırda uyğun məhsul tapılmadı</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Filtrləri Təmizlə
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
