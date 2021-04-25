export const getHighestId = (ids: Array<string>): number => {
  return ids.reduce((accumulator, current) => {
    return Math.max(accumulator, parseInt(current.split('_')[1], 10));
  }, 0);
};
