import { cDragonUrl } from '@/shared/constants/riot';

export const getCDragonPath = (assetPath?: string | null, server: 'latest' | 'pbe' = 'latest') => {
  if (!assetPath) return null;

  const path = assetPath.replace(/^\/?lol-game-data\/assets\//i, '').toLowerCase();
  return `${cDragonUrl}/${server}/plugins/rcp-be-lol-game-data/global/default/${path}`;
};