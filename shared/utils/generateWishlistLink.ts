export const generateWishlistLink = () => {
  const getSlice = () => Math.random().toString(16).slice(2);
  const share = `${Date.now().toString(36)}-${getSlice()}-${getSlice()}-${getSlice()}`;

  return share;
};
