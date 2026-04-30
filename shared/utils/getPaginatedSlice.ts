export const getPaginatedSlice = <T>(array: T[], page?: number | string | null, size?: number | string | null): T[] => {
  if (!page || !size) return array;

  page = parseInt(page.toString()) || 1;
  size = parseInt(size.toString()) || 10;

  const currentSize = Math.max(1, size);
  const startIndex = (Math.max(1, page) - 1) * currentSize;
  return array.slice(startIndex, startIndex + currentSize);
};
