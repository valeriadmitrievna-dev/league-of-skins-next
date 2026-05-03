import { CDragonAsset } from "@/shared/types";

export interface AppDataLang {
  lang: string;
  updated: Date;
  skinlines: AppDataSkinline[];
  champions: AppDataChampion[];
  skins: AppDataSkin[];
  chromas: AppDataChroma[];
}

export interface AppData {
  [language: string]: AppDataLang;
}

export interface AppDataChampion {
  id: string;
  key: string;
  name: string;
  image: {
    full: CDragonAsset;
    loading: CDragonAsset;
    icon: CDragonAsset;
  };
}

export interface AppDataSkin {
  id: string;
  description: string;
  championId: string;
  championKey: string;
  championName: string;
  originName?: string;
  contentId: string;
  name: string;
  pbe?: boolean;
  release?: number;
  price?: number;
  sale?: {
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
  };
  image: {
    uncentered: CDragonAsset;
    centered: CDragonAsset;
    loading: CDragonAsset;
  };
  video?: {
    centered: CDragonAsset;
    uncentered: CDragonAsset;
    card: CDragonAsset;
  };
  rarity: string;
  isLegacy: boolean;
  chromaPath: CDragonAsset;
  chromas: AppDataChroma[];
  skinlines: AppDataSkinline[];
  features?: {
    description: CDragonAsset;
    iconPath: CDragonAsset;
    videoPath: CDragonAsset;
  }[];
  questSkinInfo?: {
    name: string;
    splashPath: CDragonAsset;
    uncenteredSplashPath: CDragonAsset;
    collectionCardPath: CDragonAsset;
    tiers: {
      name: string;
      stage: number;
      splashPath: CDragonAsset;
      uncenteredSplashPath: CDragonAsset;
      loadScreenPath: CDragonAsset;
      splashVideoPath: CDragonAsset;
      previewVideoUrl: CDragonAsset;
      collectionSplashVideoPath: CDragonAsset;
      collectionCardHoverVideoPath: CDragonAsset;
    }[];
  };
}

export interface AppDataSkinline {
  id: string;
  name: string;
}

export interface AppDataChroma extends AppDataChromaItem {
  fullName: string;
  path: CDragonAsset;
}

export interface AppDataChromaItem {
  id: string;
  name: string;
  contentId: string;
  skinName: string;
  skinContentId: string;
  championId: string;
  colors: string[];
  pbe: boolean;
}
