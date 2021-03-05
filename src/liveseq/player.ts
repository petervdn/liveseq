type PlayerOptions = {
  lookAheadTime?: number;
  scheduleInterval?: number;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type BPM = number;
export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  scheduleInterval = 1000,
  lookAheadTime = 1200,
}: PlayerOptions = {}) => {
  let isPlaying = false;
  let timeoutId: number | null = null;

  if (lookAheadTime <= scheduleInterval) {
    throw new Error('LookAheadTime should be larger than the scheduleInterval');
  }

  const schedule = () => {
    timeoutId = window.setTimeout(schedule, scheduleInterval);
  };

  const play = () => {
    if (isPlaying) return;

    isPlaying = true;
    schedule();
  };

  const stop = () => {
    if (!isPlaying) return;

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
