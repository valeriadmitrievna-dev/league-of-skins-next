export type ApiErrorCode = `ERR_${number}`;

export interface ApiError {
  code: ApiErrorCode;
  message?: string;
  status?: number;
}
