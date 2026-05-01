import { request } from './request';
import type { Product, Sku, SkuSelection } from '@/types';

export function fetchProduct(id: number): Promise<Product> {
  return request<Product>({ url: `/api/products/${id}`, method: 'get' });
}

export function querySku(productId: number, selected: SkuSelection): Promise<Sku> {
  return request<Sku>({
    url: '/api/sku/query',
    method: 'post',
    data: { productId, selected },
  });
}

export interface AddToCartPayload {
  productId: number;
  skuKey: string;
  quantity: number;
}

export function addToCart(payload: AddToCartPayload): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>({
    url: '/api/cart/add',
    method: 'post',
    data: payload,
  });
}
