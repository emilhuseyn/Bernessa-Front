import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  volume?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'id'>) => void;
  removeItem: (id: string) => void;
  removeByProductId: (productId: string) => void;
  isInWishlist: (productId: string, volume?: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const itemId = `${item.productId}-${item.volume || 'default'}`;
        if (!items.find(i => i.id === itemId)) {
          set({ items: [...items, { ...item, id: itemId }] });
          toast.success('Məhsul istək siyahısına əlavə edildi');
        } else {
          toast('Məhsul artıq istək siyahısındadır', { icon: 'ℹ️' });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
        toast.success('Məhsul istək siyahısından silindi');
      },

      removeByProductId: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) });
      },

      isInWishlist: (productId, volume) => {
        const itemId = `${productId}-${volume || 'default'}`;
        return get().items.some(item => item.id === itemId);
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
