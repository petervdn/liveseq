export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type BPM = number;
export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  audioContext,
  scheduleInterval = 1000,
  lookAheadTime = 1200,
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;

  if (lookAheadTime <= scheduleInterval) {
    throw new Error('LookAheadTime should be larger than the scheduleInterval');
  }

  const schedule = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const playTime = audioContext.currentTime - playStartTime!; // playStartTime should always be defined when playing

    // eslint-disable-next-line no-console
    console.log('playTime', playTime, audioContext.currentTime, audioContext.state);
    timeoutId = window.setTimeout(() => schedule(), scheduleInterval);
  };

  const play = () => {
    if (audioContext.state === 'suspended') {
      throw new Error('Cannot play, AudioContext is suspended');
    }

    playStartTime = audioContext.currentTime;

    schedule();
  };

  const stop = () => {
    // todo actually stop current sounds

    playStartTime = null;
    timeoutId !== null && window.clearTimeout(timeoutId);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const pause = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const setTempo = (bpm: BPM) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  const dispose = () => {};

  return {
    play,
    stop,
    setTempo,
    pause,
    dispose,
  };
};
