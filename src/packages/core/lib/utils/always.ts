export const always = <T>(argument: T) => () => {
  return argument as T;
};
