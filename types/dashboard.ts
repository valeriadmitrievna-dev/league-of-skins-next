// ─── Shared ────────────────────────────────────────────────────────────────

import { AppDataChampion, AppDataSkin } from "./appdata";

export interface SkinlineProgress {
  id: string;
  name: string;
  owned: number;
  total: number;
  completed: boolean;
  image: AppDataSkin["image"];
}

export interface ChampionProgress {
  id: string;
  key: string;
  name: string;
  owned: number;
  total: number;
  completed: boolean;
  image: AppDataChampion["image"];
}

export interface SkinChromaProgress {
  skinId: string;
  skinName: string;
  championId: string;
  championName: string;
  owned: number;
  total: number;
  completed: boolean;
  image: AppDataSkin["image"];
}

// ─── GET /stats/overview ────────────────────────────────────────────────────

export interface StatsOverviewResponse {
  /** п.1 — топ чемпион(ы) по количеству скинов */
  topChampions: {
    place: number;
    count: number;
    champions: { id: string; key: string; name: string; image: AppDataChampion['image'] }[];
  }[];
  /** п.3 — имеющихся скинов из общего количества */
  skinsTotal: { owned: number; total: number };
  /** п.6 — чемпионов со скинами из общего числа */
  championsWithSkins: { owned: number; total: number };
  /** п.15 — legacy скинов из общего числа */
  legacySkins: { owned: number; total: number };
  /** п.19 — хром из общего числа */
  chromasTotal: { owned: number; total: number };
}

// ─── GET /stats/collections ─────────────────────────────────────────────────

export interface StatsCollectionsResponse {
  /** п.4 — завершённые линейки + частично завершённые до 3 итого */
  skinlines: SkinlineProgress[];
  /** п.5 — завершённые чемпионы + частично завершённые до 3 итого */
  champions: ChampionProgress[];
  /** п.9 — наименее коллекционируемые чемпионы */
  leastCollectedChampions: ChampionProgress[];
  /** п.20 — скины с завершёнными/частично завершёнными сетами хром */
  skinChromas: SkinChromaProgress[];
}

// ─── GET /stats/spending ────────────────────────────────────────────────────

export interface RarityEntry {
  rarity: string;
  owned: number;
  total: number;
}

export interface StatsSpendingResponse {
  /** п.2 — всего RP потрачено */
  totalRp: number;
  /** п.7 — rarity статистика */
  rarity: RarityEntry[];
  /** п.17 — самый дорогой чемпион */
  mostExpensiveChampion: {
    champion: { id: string; key: string; name: string };
    totalRp: number;
  } | null;
}

// ─── GET /stats/activity ────────────────────────────────────────────────────

export interface MonthlyActivity {
  /** YYYY-MM */
  month: string;
  count: number;
}

export interface StatsActivityResponse {
  /** п.10 — данные для графика (по месяцам) */
  timeline: MonthlyActivity[];
  /** п.11 — последние приобретённые скины (до 3) */
  recentSkins: AppDataSkin[];
  /** п.12 — год с наибольшим количеством скинов */
  biggestYear: { year: number; count: number } | null;
  /** п.13 — самая длинная серия без новых скинов (в днях) */
  longestStreak: { days: number; from: string; to: string } | null;
  /** п.14 — среднее скинов в месяц */
  averagePerMonth: number;
}

// ─── GET /stats/social ──────────────────────────────────────────────────────

export type CollectionRank = "Iron" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master";

export interface CollectionRankData {
  score: number; // 0–100
  rank: CollectionRank;
  breakdown: {
    completeness: number; // вклад полноты (0–40)
    rarity: number; // вклад редкости (0–35)
    completionist: number; // вклад завершённости (0–25)
  };
}

export interface StatsSocialResponse {
  /** п.8 — самый редкий owned скин */
  rarestSkin: {
    data: AppDataSkin;
    ownershipPercent: number;
  } | null;
  /** п.16 — процент игроков, у которых меньше скинов */
  comparedToAverage: {
    percentile: number;
    totalPlayers: number;
  };
  /** ранг коллекции */
  collectionRank: CollectionRankData;
}

// ─── GET /stats/chromas ─────────────────────────────────────────────────────

export interface StatsChromasResponse {
  /** п.18 — самый частый цвет среди owned хром */
  mostFrequentColors: { color: string; count: number }[];
}
