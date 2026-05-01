import { setActivePinia, createPinia } from 'pinia';
import { fetchProduct, querySku } from '@/api/product';
import { ApiError } from '@/api/types';

describe('api layer (with mock adapter)', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('fetchProduct returns product data', async () => {
    const p = await fetchProduct(1);
    expect(p.id).toBe(1);
    expect(p.skus.length).toBeGreaterThan(0);
  });

  it('fetchProduct throws ApiError(404) on unknown id', async () => {
    await expect(fetchProduct(999)).rejects.toBeInstanceOf(ApiError);
    try {
      await fetchProduct(999);
    } catch (e) {
      expect((e as ApiError).code).toBe(404);
    }
  });

  it('querySku returns sku for valid combination', async () => {
    const sku = await querySku(1, { size: 'Small', color: 'Charcoal', capacity: '8GB' });
    expect(sku.price).toBe(199);
    expect(sku.stock).toBe(10);
  });

  it('querySku throws on invalid combination', async () => {
    await expect(
      querySku(1, { size: 'X', color: 'Y', capacity: 'Z' }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
