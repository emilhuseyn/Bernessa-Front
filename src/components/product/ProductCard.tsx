import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useTranslation } from '../../hooks/useTranslation';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/600x800?text=M%C9%99hsul';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images?.[0] || FALLBACK_IMAGE;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
      });
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-[2rem] p-3 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 relative">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/5] bg-gray-100">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(event) => {
              const target = event.target as HTMLImageElement;
              if (target.dataset.fallbackApplied) {
                return;
              }
              target.dataset.fallbackApplied = 'true';
              target.src = FALLBACK_IMAGE;
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {t('product.outOfStock')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 px-2 pb-2">
          <div className="mb-2">
            <p className="text-xs font-medium text-primary-600 mb-1 uppercase tracking-wider">{product.brand || product.category}</p>
            <h3 className="font-display font-bold text-gray-900 text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.volume && (
              <p className="text-xs text-gray-500 mt-1">{product.volume}</p>
            )}
          </div>
          
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-bold text-gray-900">
              {product.price.toFixed(2)} ₼
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through decoration-red-400">
                {product.originalPrice.toFixed(2)} ₼
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
