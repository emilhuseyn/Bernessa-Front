import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { productService } from '../services';
import { handleApiError } from '../utils/errorHandler';
import type { Product } from '../types';
import { products as mockProducts } from '../data/mockData';
import { useTranslation } from '../hooks/useTranslation';

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const filterLocalProducts = useCallback((items: Product[], term: string): Product[] => {
    if (!term) {
      return items;
    }

    const normalized = term.toLowerCase();
    return items.filter((product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized) ||
      product.category.toLowerCase().includes(normalized) ||
      product.brand?.toLowerCase().includes(normalized) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(normalized))
    );
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const trimmedQuery = query.trim();
        let data: Product[] = [];

        if (trimmedQuery) {
          data = await productService.search(trimmedQuery);
          if (!data.length) {
            data = filterLocalProducts(mockProducts, trimmedQuery);
          }
        } else {
          data = await productService.getAll();
          if (!data.length) {
            data = mockProducts;
          }
        }

        if (!ignore) {
          setResults(data);
        }
      } catch (err) {
        if (!ignore) {
          const message = handleApiError(err);
          setError(message);
          const fallback = query.trim()
            ? filterLocalProducts(mockProducts, query)
            : mockProducts;
          setResults(fallback);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      ignore = true;
    };
  }, [query, filterLocalProducts]);

  const handleHeroSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedValue = searchInput.trim();
    if (trimmedValue) {
      navigate(`/search?q=${encodeURIComponent(trimmedValue)}`);
    } else {
      navigate('/search');
    }
  };
  const resultCount = results.length;

  const resultCountLabel = useMemo(() => {
    if (isLoading) {
      return t('search.searching');
    }
    return `${resultCount} ${t('search.productsFound')}`;
  }, [isLoading, resultCount, t]);

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Hero Search Header */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/50 blur-[150px]"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-500/40 blur-[120px]"></div>
            </div>
            <div className="container-custom relative z-10">
              <div className="max-w-3xl space-y-6">
                {query ? (
                  <>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">{t('search.resultsFor')}</p>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
                      "{query}" <span className="text-primary-400">{t('search.for')}</span>
                    </h1>
                  </>
                ) : (
                  <>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">{t('search.collection')}</p>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white">{t('search.allProducts')}</h1>
                  </>
                )}

                <form onSubmit={handleHeroSearch} className="relative">
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="search"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder={t('search.placeholder')}
                      className="w-full rounded-2xl bg-white/10 text-white placeholder:text-white/60 backdrop-blur px-12 py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400/80 focus:border-transparent"
                      aria-label={t('search.label')}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                    >
                      {t('search.searchButton')}
                    </button>
                  </div>
                </form>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80">
                    {resultCountLabel}
                  </div>
                  {!isLoading && query && (
                    <button
                      onClick={() => navigate('/search')}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t('search.clearFilter')}
                    </button>
                  )}
                  {error && <span className="text-sm text-red-100">{error}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="bg-gray-50 py-16">
            <div className="container-custom">
              {isLoading ? (
                <div className="flex justify-center py-24">
                  <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {results.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  }
                  title={t('search.noProductsFound')}
                  description={
                    query
                      ? `"${query}" ${t('search.noResultsFor')}`
                      : t('search.noProductsAvailable')
                  }
                  actionLabel={t('search.viewAll')}
                  onAction={() => navigate('/search')}
                />
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
