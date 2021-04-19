export const selectById = <T extends { id: string }>(id: string, objs: Array<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return objs.find((item) => item.id === id)!; // todo get rid of non-null assert
};
