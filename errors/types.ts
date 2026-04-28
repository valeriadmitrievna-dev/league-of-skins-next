export type ApiErrorCode = `ERR_${number}`;

export interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message?: string;
  params?: string[];
}
