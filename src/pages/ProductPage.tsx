import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { ProductCard } from '../components/product/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useTranslation } from '../hooks/useTranslation';
import { categoryService, productService } from '../services';
import type { Product, Category } from '../types';
import { handleApiError } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Get translated content
  const productName = useMemo(() => {
    if (!product) return '';
    return currentLanguage !== 'az' && product.translations?.[currentLanguage]?.name 
      ? product.translations[currentLanguage].name 
      : product.name;
  }, [product, currentLanguage]);

  const productType = useMemo(() => {
    if (!product) return '';
    return currentLanguage !== 'az' && product.translations?.[currentLanguage]?.type 
      ? product.translations[currentLanguage].type 
      : product.type;
  }, [product, currentLanguage]);

  const productDescription = useMemo(() => {
    if (!product) return '';
    return currentLanguage !== 'az' && product.translations?.[currentLanguage]?.description 
      ? product.translations[currentLanguage].description 
      : product.description;
  }, [product, currentLanguage]);

  const categoryName = useMemo(() => {
    if (!category) return product?.category || '';
    return currentLanguage !== 'az' && category.translations?.[currentLanguage] 
      ? category.translations[currentLanguage] 
      : category.name;
  }, [category, product, currentLanguage]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setProduct(null);
      setCategory(null);
      setRelatedProducts([]);
      setSelectedImage(0);
      setIsRelatedLoading(false);

      try {
        const productData = await productService.getById(id);
        setProduct(productData);

        if (productData.categoryId) {
          try {
            const categoryData = await categoryService.getById(productData.categoryId);
            setCategory(categoryData);
          } catch (categoryError) {
            const message = handleApiError(categoryError);
            toast.error(message);
          }
        }

        // Load related products from API
        setIsRelatedLoading(true);
        try {
          const related = await productService.getRelated(productData.id, 8);
          const filtered = related.filter((item) => item.id !== productData.id).slice(0, 8);
          setRelatedProducts(filtered);
        } catch (relatedError) {
          const message = handleApiError(relatedError);
          toast.error(message);
        } finally {
          setIsRelatedLoading(false);
        }
      } catch (error) {
        const message = handleApiError(error);
        toast.error(message);

        try {
          const { products: mockProducts, categories: mockCategories } = await import('../data/mockData');
          const mockProduct = mockProducts.find((item) => item.id === id);
          if (mockProduct) {
            setProduct(mockProduct);
            const mockCategory = mockCategories.find((cat) => cat.name === mockProduct.category);
            setCategory(mockCategory || null);
            setRelatedProducts(
              mockProducts
                .filter((item) => item.category === mockProduct.category && item.id !== mockProduct.id)
                .slice(0, 8)
            );
          } else {
            setProduct(null);
          }
        } catch (mockError) {
          console.error('Mock data yüklenmədi:', mockError);
          setProduct(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();

    return () => {
      // no ongoing subscriptions to clean up yet
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: productName,
      price: product.price,
      image: product.images?.[0] || '',
      quantity,
    });
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: productName,
        price: product.price,
        image: product.images?.[0] || '',
      });
    }
  };

  const discount = useMemo(() => {
    if (!product?.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">{t('product.notFound')}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
          >
            {t('product.backToHome')}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen pt-24 pb-16">
          {/* Background Elements */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-100/30 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="container-custom relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 animate-fade-in overflow-x-auto">
              <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors whitespace-nowrap">
                {t('product.home')}
              </button>
              <span>/</span>
              <button
                onClick={() =>
                  category?.slug
                    ? navigate(`/category/${category.slug}`)
                    : navigate('/categories')
                }
                className="hover:text-primary-600 transition-colors whitespace-nowrap"
              >
                {categoryName || t('product.category')}
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{productName}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Images Section - Sticky */}
              <div className="relative h-fit lg:sticky lg:top-32 animate-slide-up">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl mb-6 group">
                  <img
                    src={product.images[selectedImage]}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {discount > 0 && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-red-500/30">
                      -{discount}% {t('product.sale')}
                    </div>
                  )}
                </div>
                
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                          selectedImage === index
                            ? 'ring-2 ring-primary-500 ring-offset-2 scale-95 shadow-lg'
                            : 'hover:ring-2 hover:ring-gray-200 hover:scale-95 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-10 shadow-soft border border-white/50">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="w-full">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4 leading-tight break-words">
                        {productName}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                        {product.brand && (
                          <span className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                            {product.brand}
                          </span>
                        )}
                        {product.volume && (
                          <span className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                            {product.volume}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 whitespace-nowrap">
                      {product.price.toFixed(2)} ₼
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through decoration-2 whitespace-nowrap">
                        {product.originalPrice.toFixed(2)} ₼
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
                    {productDescription}
                  </p>

                  {/* Selectors */}
                  <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wider">
                        Miqdar
                      </label>
                      <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg text-gray-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="whitespace-nowrap">{t('product.addToCart')}</span>
                    </button>
                    <button 
                      onClick={handleToggleWishlist}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 shrink-0 ${
                        inWishlist 
                          ? 'border-red-200 bg-red-50 text-red-500' 
                          : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                      }`}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <section className="mt-16 sm:mt-24 lg:mt-32">
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-gray-900">{t('product.relatedProducts')}</h2>
              </div>
              {isRelatedLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="h-10 w-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : relatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {relatedProducts.slice(0, 4).map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-10 text-center space-y-3">
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium">
                    Bu kateqoriyada başqa məhsul tapılmadı.
                  </p>
                  <Link
                    to="/categories"
                    className="inline-flex items-center justify-center px-6 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                  >
                    Digər kateqoriyalara baxın
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
