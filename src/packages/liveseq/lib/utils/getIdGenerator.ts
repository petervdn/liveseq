export const getIdGenerator = (prefix: string, initial = 0) => {
  let counter = initial;
  return () => {
    return `${prefix}_${counter++}`;
  };
};
