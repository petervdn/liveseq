type PlayerOptions = {
  lookAheadTime: number;
  interval: number;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type BPM = number;
export type Player = ReturnType<typeof createPlayer>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createPlayer = (options: PlayerOptions) => {
  let isPlaying = false;
  let timeoutId: number | null = null;

  const schedule = () => {
    // console.log('schedule', isPlaying);

    timeoutId = window.setTimeout(() => {
      schedule();
    }, options.interval);
  };

  const play = () => {
    if (isPlaying) {
      return;
    }

    isPlaying = true;
    schedule();
  };

  const stop = () => {
    if (!isPlaying) {
      return;
    }
    // todo actually stop current sounds
    isPlaying = false;
    timeoutId !== null && window.clearTimeout(timeoutId);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const pause = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const setTempo = (bpm: BPM) => {};

  return {
    play,
    stop,
    pause,
    setTempo,
  };
};
