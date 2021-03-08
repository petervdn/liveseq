export const selectById = (id: string, objs: Array<{ id: string }>) => {
  return objs.find((item) => item.id === id);
};
