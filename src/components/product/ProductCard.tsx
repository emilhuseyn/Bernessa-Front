import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useTranslation } from '../../hooks/useTranslation';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, currentLanguage } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const firstVariant = product.variants?.[0];
  const volume = firstVariant ? firstVariant.volume : product.volume;
  const inWishlist = isInWishlist(product.id, volume);
  const primaryImage = product.images?.[0];

  // Get translated content based on current language
  const productName = currentLanguage !== 'az' && product.translations?.[currentLanguage]?.name 
    ? product.translations[currentLanguage].name 
    : product.name;
  
  const productType = currentLanguage !== 'az' && product.translations?.[currentLanguage]?.type 
    ? product.translations[currentLanguage].type 
    : product.type;
  
  const productDescription = currentLanguage !== 'az' && product.translations?.[currentLanguage]?.description 
    ? product.translations[currentLanguage].description 
    : product.description;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstVariant = product.variants?.[0];
    const price = firstVariant ? firstVariant.price : product.price;
    const volume = firstVariant ? firstVariant.volume : product.volume;
    
    addItem({
      productId: product.id,
      name: productName,
      price: price,
      image: primaryImage,
      volume: volume,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstVariant = product.variants?.[0];
    const price = firstVariant ? firstVariant.price : product.price;
    const volume = firstVariant ? firstVariant.volume : product.volume;
    const itemId = `${product.id}-${volume || 'default'}`;
    
    if (inWishlist) {
      removeFromWishlist(itemId);
    } else {
      addToWishlist({
        productId: product.id,
        name: productName,
        price: price,
        image: primaryImage,
        volume: volume,
      });
    }
  };

  const discount = product.variants && product.variants.length > 0 && product.variants[0].originalPrice
    ? Math.round(((product.variants[0].originalPrice - product.variants[0].price) / product.variants[0].originalPrice) * 100)
    : product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-[2rem] p-3 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 relative">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/5] bg-gray-100">
          {primaryImage && (
            <img
              src={primaryImage}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Hover Info Text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
            <p className="text-white text-center text-sm font-medium drop-shadow-lg bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3">
              {t('home.deals.imageDisclaimer')}
            </p>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 px-2 pb-2">
          <div className="mb-2">
            <p className="text-xs font-medium text-primary-600 mb-1 uppercase tracking-wider truncate">{product.brand || product.category}</p>
            <h3 className="font-display font-bold text-gray-900 text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
              {productName}
            </h3>
            {product.volume && (
              <p className="text-xs text-gray-500 mt-1 truncate">{product.volume}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-baseline gap-2 mt-2">
            {product.variants && product.variants.length > 0 ? (
              <>
                <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                  {product.variants[0].price.toFixed(2)} ₼
                </span>
                {product.variants[0].originalPrice && (
                  <span className="text-sm text-gray-400 line-through decoration-red-400 whitespace-nowrap">
                    {product.variants[0].originalPrice.toFixed(2)} ₼
                  </span>
                )}
                {product.variants.length > 1 && (
                  <span className="text-xs text-gray-500">
                    +{product.variants.length - 1} həcm
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                  {product.price.toFixed(2)} ₼
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through decoration-red-400 whitespace-nowrap">
                    {product.originalPrice.toFixed(2)} ₼
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
