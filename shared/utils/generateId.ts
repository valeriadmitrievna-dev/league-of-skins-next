export const generateId = () => {
  const getSlice = () => Math.random().toString(16).slice(2);
  return `${Date.now().toString(36)}-${getSlice()}-${getSlice()}-${getSlice()}`;
};
