export const isValid = (d: Date): boolean => {
  return !isNaN(d.valueOf());
};
