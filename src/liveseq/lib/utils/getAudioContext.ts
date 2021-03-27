export const getAudioContext = (): AudioContext => {
  // this is split in 2 ifs like this because it was throwing error in nodejs
  if ('AudioContext' in window) {
    return new window.AudioContext();
  }

  if ('webkitAudioContext' in window) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // eslint-disable-next-line new-cap
    return new (window as any).webkitAudioContext();
  }

  // this is for nodejs (jest testing).
  return {} as AudioContext;
};
