import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { CartItem, Cart } from '../types';

interface CartStore extends Cart {
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number; size?: string; color?: string }) => void;
  removeItem: (id: string) => void;
  removeByProductId: (productId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { subtotal, total: subtotal };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,

      addItem: (newItem) => {
        const items = get().items;
        const itemId = `${newItem.productId}-${newItem.size || ''}-${newItem.color || ''}`;
        const existingItem = items.find(item => item.id === itemId);

        let updatedItems;
        if (existingItem) {
          updatedItems = items.map(item =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
              : item
          );
        } else {
          updatedItems = [...items, { ...newItem, id: itemId, quantity: newItem.quantity || 1 }];
        }

        const { subtotal, total } = calculateTotals(updatedItems);
        set({ items: updatedItems, subtotal, tax: 0, discount: 0, total });
        toast.success('Məhsul səbətə əlavə edildi');
      },

      removeItem: (id) => {
        const items = get().items.filter(item => item.id !== id);
        const { subtotal, total } = calculateTotals(items);
        set({ items, subtotal, tax: 0, discount: 0, total });
        toast.success('Məhsul səbətdən silindi');
      },

      removeByProductId: (productId) => {
        const items = get().items.filter(item => item.productId !== productId);
        const { subtotal, total } = calculateTotals(items);
        set({ items, subtotal, tax: 0, discount: 0, total });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const items = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        const { subtotal, total } = calculateTotals(items);
        set({ items, subtotal, tax: 0, discount: 0, total });
      },

      clearCart: () => {
        set({ items: [], subtotal: 0, tax: 0, discount: 0, total: 0 });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
