// Unified backend response shape
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export class ApiError extends Error {
  code: number;
  raw?: unknown;
  constructor(code: number, message: string, raw?: unknown) {
    super(message);
    this.code = code;
    this.raw = raw;
    this.name = 'ApiError';
  }
}
