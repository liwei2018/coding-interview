import { getProduct, findSku } from '@/mock/products';

describe('product mock', () => {
  it('returns product with skus', () => {
    const p = getProduct(1);
    expect(p.skus.length).toBeGreaterThan(0);
    expect(p.dimensions.length).toBe(3);
  });

  it('finds sku by selection', () => {
    const p = getProduct(1);
    const sku = findSku(p, { size: 'Small', color: 'Charcoal', capacity: '8GB' });
    expect(sku).toBeDefined();
    expect(sku!.price).toBe(199);
    expect(sku!.stock).toBe(10);
  });

  it('different selection yields different price', () => {
    const p = getProduct(1);
    const a = findSku(p, { size: 'Small', color: 'Charcoal', capacity: '8GB' });
    const b = findSku(p, { size: 'Large', color: 'Deep Sea Blue', capacity: '32GB' });
    expect(a!.price).not.toBe(b!.price);
  });
});
