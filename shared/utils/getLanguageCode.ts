import { LANGUAGES } from '@/shared/constants/languages';

export const getLanguageCode = (lang: string) => {
  return LANGUAGES[lang as keyof typeof LANGUAGES]?.code;
};