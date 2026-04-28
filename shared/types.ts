import type { CSSProperties, ReactNode } from "react";

export type Theme = "dark" | "light" | "system";

export type WithLanguage<T = Record<string, string>> = T & {
  lang: string;
};

export type PaginatedRequest<T> = T & {
  page?: number;
  size?: number;
};

export interface ODataResponse<T> {
  count: number;
  data: T;
}

export interface ApiErrorPayload {
  data: ApiError;
  status?: number;
}

export interface ApiError {
  code: string;
  status?: number;
  message?: string;
  params?: string[];
}

export interface OptionItem {
  value: string;
  label: string;

  className?: string;
  style?: CSSProperties;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export type CDragonAsset = string | null | undefined;

export type SearchParams = {
  [key: string]: string | undefined;
};
