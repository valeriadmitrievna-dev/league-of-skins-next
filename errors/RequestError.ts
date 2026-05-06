import { ApiError } from "./types";

export class RequestError extends Error {
  code: string;
  status: number;

  constructor(options: ApiError) {
    super(options.message ?? options.code);

    this.code = options.code;
    this.status = options.status ?? 500;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
    };
  }
}
