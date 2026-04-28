import { ApiError } from './types';

export class RequestError extends Error {
  code: string;
  params?: Record<string, any>;
  status: number;

  constructor(options: ApiError = { code: 'ERR_0000' }) {
    super(options.message);
    this.code = options.code || 'ERR_0000';
    // this.type = options.type || 'server';
    this.params = options.params;
    this.status = options.status ?? (options.code === 'ERR_0004' ? 404 : 500);
  }

  toJSON() {
    return {
      code: this.code,
      // type: this.type,
      params: this.params,
      message: this.message,
    };
  }
}
