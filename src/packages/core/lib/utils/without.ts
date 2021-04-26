export const without = <T>(array: Array<T>, item: T): Array<T> => {
  // TODO: it might be possible to optimize if a single item is being removed, which is often the case in this lib
  return array.filter((arrayItem) => arrayItem !== item);
};
