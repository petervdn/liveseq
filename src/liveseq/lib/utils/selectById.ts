export const selectById = <T extends { id: string }>(id: string, objs: Array<T>) => {
  return objs.find((item) => item.id === id)!;
};
