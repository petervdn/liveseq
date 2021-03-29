export const times = <T>(iterations: number, callback: (index: number) => T): Array<T> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return [...new Array(iterations)].map((_, index) => callback(index));
};
