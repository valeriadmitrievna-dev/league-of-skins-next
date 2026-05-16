const BUNDLES = [
  { g: 575, rub: 490 },
  { g: 1380, rub: 1090 },
  { g: 2800, rub: 2175 },
  { g: 4500, rub: 3450 },
  { g: 6500, rub: 4950 },
  { g: 13500, rub: 9900 },
  { g: 33500, rub: 24250 },
  { g: 60200, rub: 42750 },
] as const satisfies Bundle[];

type SupportedLang = keyof typeof CURRENCY_BY_LANG;
type CurrencyKey = "rub";

interface Bundle {
  g: number;
  rub: number;
}

interface CurrencyConfig {
  key: CurrencyKey;
  symbol: string;
}

export const CURRENCY_BY_LANG = {
  ru: { key: "rub", symbol: "₽" },
} as Record<string, CurrencyConfig>;

export const getCurrencySymbol = (lang = "ru") => {
  const currency = CURRENCY_BY_LANG[lang as SupportedLang] ?? CURRENCY_BY_LANG.ru;
  const { symbol } = currency;
  return symbol;
};

export const convertRP = (amount: number, lang = "ru"): number => {
  const currency = CURRENCY_BY_LANG[lang as SupportedLang] ?? CURRENCY_BY_LANG.ru;
  const { key } = currency;

  if (amount <= BUNDLES[0].g) {
    const rate = BUNDLES[0][key] / BUNDLES[0].g;
    return Math.round(amount * rate);
  }

  const last = BUNDLES[BUNDLES.length - 1];
  const prev = BUNDLES[BUNDLES.length - 2];

  if (amount >= last.g) {
    const rate = (last[key] - prev[key]) / (last.g - prev.g);
    return Math.round(prev[key] + (amount - prev.g) * rate);
  }

  const upperIndex = BUNDLES.findIndex((b) => b.g >= amount);
  const lower = BUNDLES[upperIndex - 1];
  const upper = BUNDLES[upperIndex];

  const t = (amount - lower.g) / (upper.g - lower.g);
  return Math.round(lower[key] + t * (upper[key] - lower[key]));
};
