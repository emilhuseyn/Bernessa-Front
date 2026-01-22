import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-1' : 'py-2'
      }`}
    >
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl shadow-lg border-b border-white/10' 
            : 'backdrop-blur-sm border-b border-transparent'
        }`}
        style={{ 
          backgroundColor: '#000000'
        }}
      ></div>
      <div className="container-custom relative">
        <div className="flex items-center justify-between h-14 gap-2 md:gap-4">
          {/* Actions Left */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          </div>

          {/* Logo Center */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 group flex-shrink-0">
            {/* <img 
              src="/image.png" 
              alt="Barsense Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform"
              style={{ filter: 'brightness(0) invert(1)' }}
            /> */}
            <div className="flex flex-col">
              <span className="text-lg sm:text-[1.6rem] text-white leading-none group-hover:text-primary-400 transition-colors" style={{ fontFamily: 'Organetto, sans-serif', letterSpacing: '0.05em' }}>BARSENSE</span>
              <span className="text-[8px] sm:text-[10px] text-gray-400 tracking-widest uppercase font-medium hidden xs:block">Luxury Perfumes</span>
            </div>
          </Link>

          {/* Actions Right */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={handleSearchClick}
              className="p-2 sm:p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
              aria-label="Axtarış səhifəsinə keç"
            >
              <svg
                className="w-6 h-6 transform group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 sm:p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-gray-800">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 sm:p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-primary-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-gray-800">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
};
