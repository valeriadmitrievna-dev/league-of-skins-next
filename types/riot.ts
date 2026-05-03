import { CDragonAsset } from "@/shared/types";

export interface RiotChampion {
  id: string;
  name: string;
  alias: string;
  title: string;
  squarePortraitPath: string;
  skins: RiotSkin[];
}

export interface RiotChampionItem {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
  };
}

export interface RiotSkin {
  id: string;
  contentId: string;
  isBase: boolean;
  isLegacy: boolean;
  release?: number;
  price?: number;
  sale?: {
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
  };
  name: string;
  splashPath: CDragonAsset;
  uncenteredSplashPath: CDragonAsset;
  collectionCardHoverVideoPath?: CDragonAsset;
  collectionSplashVideoPath?: CDragonAsset;
  splashVideoPath?: CDragonAsset;
  tilePath: CDragonAsset;
  loadScreenPath: CDragonAsset;
  rarity: string;
  chromaPath: CDragonAsset;
  chromas: RiotChroma[];
  skinLines: { id: string }[];
  description: string;
  skinFeaturePreviewData?: {
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

export interface RiotChroma {
  id: string;
  name: string;
  contentId: string;
  skinName: string;
  skinContentId: string;
  championId: string;
  chromaPath: string;
  tilePath: string;
  colors: string[];
  pbe: boolean;
}

export interface RiotSkinline {
  id: string;
  name: string;
  description: string;
}
