import { playTick } from '../..';
import type { Note } from '../project/projectStructure';

export type ScheduleNote = Note & {
  startTime: number;
  endTime: number;
};

export type ScheduleItem = {
  notes: Array<ScheduleNote>;
  instrument: {
    // when the player calls instrument.schedule, it will already pass notes with time in seconds
    // TODO: maybe the instrument returns a "cancel" fn
    schedule: (context: AudioContext, notes: Array<ScheduleNote>) => void;
  };
};

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
  // called every time schedule runs to get "what" to schedule from the project
  getScheduleItems: (startTime: number, endTime: number) => Array<ScheduleItem>;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type BPM = number;
export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval = 1000,
  lookAheadTime = 1200,
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;

  // eslint-disable-next-line no-console
  console.log(getScheduleItems(0, 10));

  if (lookAheadTime <= scheduleInterval) {
    throw new Error('LookAheadTime should be larger than the scheduleInterval');
  }

  const schedule = () => {
    const songTime = audioContext.currentTime - playStartTime!; // playStartTime should always be defined when playing

    // eslint-disable-next-line no-console
    console.log('songTime', songTime, audioContext.currentTime, audioContext.state);

    playTick(audioContext, audioContext.currentTime);

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
