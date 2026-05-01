import axios, { AxiosError, type AxiosResponse } from 'axios';
import { ApiError, type ApiResponse } from './types';
import { mockAdapter } from './mockAdapter';
import { useToastStore } from '@/store/toast';

const USE_MOCK = true; // flip to false to hit a real backend

const instance = axios.create({
  baseURL: '/',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
});

// Request interceptor: inject token / traceId
instance.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    cfg.headers['X-Trace-Id'] = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return cfg;
  },
  (err) => Promise.reject(err),
);

// Centralized business code handling
function handleBizCode(code: number, message: string, raw: unknown): never {
  let toastMsg = message;
  switch (code) {
    case 401:
      toastMsg = 'Session expired, please sign in again';
      // In production: location.href = '/login'
      break;
    case 403:
      toastMsg = 'You do not have permission to access this resource';
      break;
    case 404:
      toastMsg = message || 'Resource not found';
      break;
    case 429:
      toastMsg = 'Too many requests, please slow down';
      break;
    case 500:
    case 502:
    case 503:
      toastMsg = message || 'Service unavailable, please retry later';
      break;
    default:
      toastMsg = message || `Request failed (${code})`;
  }
  try {
    useToastStore().show(toastMsg, 'error');
  } catch {
    /* pinia not ready */
  }
  throw new ApiError(code, toastMsg, raw);
}

// Response interceptor: unwrap { code, data, message }
instance.interceptors.response.use(
  (res: AxiosResponse<ApiResponse<unknown>>) => {
    const body = res.data;
    if (!body || typeof body !== 'object') {
      handleBizCode(-1, 'Malformed response', body);
    }
    if (body.code === 0 || body.code === 200) {
      return body.data as unknown as AxiosResponse;
    }
    handleBizCode(body.code, body.message, body);
  },
  (err: AxiosError<ApiResponse<unknown>>) => {
    if (err.code === 'ECONNABORTED') {
      try { useToastStore().show('Request timeout, please check your network', 'error'); } catch { /* */ }
      return Promise.reject(new ApiError(-2, 'Request timeout', err));
    }
    if (!err.response) {
      try { useToastStore().show('Network error, please check your connection', 'error'); } catch { /* */ }
      return Promise.reject(new ApiError(-3, 'Network error', err));
    }
    const status = err.response.status;
    const body = err.response.data;
    const code = (body && typeof body === 'object' && 'code' in body ? body.code : status) as number;
    const message = (body && typeof body === 'object' && 'message' in body ? body.message : err.message) as string;
    try {
      handleBizCode(code, message, err);
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

// Helper so .then(data => ...) gets the unwrapped business data
export function request<T = unknown>(...args: Parameters<typeof instance.request>): Promise<T> {
  return instance.request(...args) as unknown as Promise<T>;
}

export default instance;
