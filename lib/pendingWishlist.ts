const KEY = "pending_wishlist";

export interface PendingWishlist {
  skinContentIds?: string[];
  chromaContentIds?: string[];
}

export const setPendingWishlist = (data: PendingWishlist) => {
  sessionStorage.setItem(KEY, JSON.stringify(data));
};

export const getPendingWishlist = (): PendingWishlist | null => {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearPendingWishlist = () => {
  sessionStorage.removeItem(KEY);
};
