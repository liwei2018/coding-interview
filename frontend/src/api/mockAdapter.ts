import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { products, findSku } from '@/mock/products';
import type { ApiResponse } from './types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Handler = (
  cfg: InternalAxiosRequestConfig,
  match: RegExpMatchArray,
) => Promise<ApiResponse<unknown>> | ApiResponse<unknown>;

const routes: Array<{ method: string; pattern: RegExp; handler: Handler }> = [
  {
    method: 'get',
    pattern: /^\/api\/products\/(\d+)$/,
    handler: (_cfg, m) => {
      const id = Number(m[1]);
      const p = products[id];
      if (!p) return { code: 404, data: null, message: 'Product not found' };
      return { code: 0, data: p, message: 'ok' };
    },
  },
  {
    method: 'post',
    pattern: /^\/api\/sku\/query$/,
    handler: (cfg) => {
      const { productId, selected } = JSON.parse(cfg.data || '{}');
      const p = products[productId];
      if (!p) return { code: 404, data: null, message: 'Product not found' };
      const sku = findSku(p, selected);
      if (!sku) return { code: 4001, data: null, message: 'Selected variant does not exist' };
      return { code: 0, data: sku, message: 'ok' };
    },
  },
  {
    method: 'post',
    pattern: /^\/api\/cart\/add$/,
    handler: (cfg) => {
      const body = JSON.parse(cfg.data || '{}');
      if (!body.productId) return { code: 4002, data: null, message: 'Invalid parameters' };
      // 1% chance of server error to demo error handling
      if (Math.random() < 0.01) return { code: 500, data: null, message: 'Server busy, please retry later' };
      return { code: 0, data: { ok: true }, message: 'Added to cart' };
    },
  },
];

export const mockAdapter: AxiosAdapter = async (config) => {
  await delay(120 + Math.random() * 200); // simulate network latency
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  for (const r of routes) {
    if (r.method !== method) continue;
    const m = url.match(r.pattern);
    if (!m) continue;
    const body = await r.handler(config, m);
    const response: AxiosResponse = {
      data: body,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
    return response;
  }

  const response: AxiosResponse = {
    data: { code: 404, data: null, message: `Mock route not matched: ${method.toUpperCase()} ${url}` },
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config,
  };
  return response;
};
