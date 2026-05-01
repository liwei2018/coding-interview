import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '@/store/cart';

describe('cart store', () => {
  beforeEach(() => setActivePinia(createPinia()));

  const item = {
    productId: 1, skuKey: 'a-b-c', name: 'p', image: '', attrs: {},
    price: 100, stock: 5, quantity: 1,
  };

  it('adds an item', () => {
    const cart = useCartStore();
    cart.addItem(item);
    expect(cart.items.length).toBe(1);
    expect(cart.count).toBe(1);
    expect(cart.totalPrice).toBe(100);
  });

  it('merges same sku and caps at stock', () => {
    const cart = useCartStore();
    cart.addItem({ ...item, quantity: 3 });
    cart.addItem({ ...item, quantity: 10 });
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(5);
  });

  it('removes item', () => {
    const cart = useCartStore();
    cart.addItem(item);
    cart.removeItem(cart.items[0].key);
    expect(cart.items.length).toBe(0);
  });

  it('updateQuantity within stock', () => {
    const cart = useCartStore();
    cart.addItem(item);
    const key = cart.items[0].key;
    cart.updateQuantity(key, 3);
    expect(cart.items[0].quantity).toBe(3);
    cart.updateQuantity(key, 99);
    expect(cart.items[0].quantity).toBe(item.stock);
  });

  it('updateQuantity to 0 removes the item', () => {
    const cart = useCartStore();
    cart.addItem(item);
    cart.updateQuantity(cart.items[0].key, 0);
    expect(cart.items.length).toBe(0);
  });
});
