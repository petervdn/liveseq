export const getAudioContext = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};
