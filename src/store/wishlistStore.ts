import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  removeByProductId: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        if (!items.find(i => i.productId === item.productId)) {
          set({ items: [...items, item] });
          toast.success('Məhsul istək siyahısına əlavə edildi');
        } else {
          toast('Məhsul artıq istək siyahısındadır', { icon: 'ℹ️' });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
        toast.success('Məhsul istək siyahısından silindi');
      },

      removeByProductId: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
