import { defineStore } from 'pinia';
import type { CartItem, CartItemInput } from '@/types';

interface State {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): State => ({ items: [] }),
  getters: {
    count: (s): number => s.items.reduce((n, i) => n + i.quantity, 0),
    totalPrice: (s): number => s.items.reduce((n, i) => n + i.price * i.quantity, 0),
  },
  actions: {
    addItem(item: CartItemInput) {
      const key = `${item.productId}-${item.skuKey}`;
      const exist = this.items.find((i) => i.key === key);
      if (exist) {
        exist.quantity = Math.min(exist.quantity + item.quantity, item.stock);
      } else {
        this.items.push({ key, ...item });
      }
    },
    removeItem(key: string) {
      this.items = this.items.filter((i) => i.key !== key);
    },
    updateQuantity(key: string, quantity: number) {
      const item = this.items.find((i) => i.key === key);
      if (!item) return;
      if (quantity <= 0) {
        this.removeItem(key);
        return;
      }
      item.quantity = Math.min(quantity, item.stock);
    },
    clear() {
      this.items = [];
    },
  },
});
