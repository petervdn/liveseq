export const setTimer = (callback: () => void, millis: number) => {
  const timeoutId = window.setTimeout(callback, millis);
  return () => {
    window.clearTimeout(timeoutId);
  };
};
