import type { Note } from '../note/note';
import type { TimeInSeconds } from '../time/time';
import type { GetScheduleItemsResult } from './schedule.utils';

export type ScheduleNote = Note & {
  startTime: TimeInSeconds;
  endTime: TimeInSeconds;
  schedulingId: string;
};

export type ScheduleItem = {
  notes: Array<ScheduleNote>;
  instrument: {
    // when the player calls instrument.schedule, it will already pass notes with time in seconds
    // TODO: maybe the instrument returns a "cancel" fn
    schedule: (notes: Array<ScheduleNote>) => void;
  };
};

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime?: TimeInSeconds;
  scheduleInterval?: TimeInSeconds;
  // called every time schedule runs to get "what" to schedule from the project
  getScheduleItems: (
    startTime: TimeInSeconds,
    endTime: TimeInSeconds,
    previouslyScheduledNoteIds: Array<string>,
  ) => GetScheduleItemsResult;
};

// export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval = 1 as TimeInSeconds,
  lookAheadTime = 1.2 as TimeInSeconds,
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;
  // todo: probably make this an object for more efficient lookup
  // todo: how does this work when slots are played again later on (and loop count is reset)
  let previouslyScheduledNoteIds: Array<string> = [];

  if (lookAheadTime <= scheduleInterval) {
    throw new Error('LookAheadTime should be larger than the scheduleInterval');
  }

  const schedule = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const songTime = (audioContext.currentTime - playStartTime!) as TimeInSeconds; // playStartTime should always be defined when playing

    const result = getScheduleItems(
      songTime,
      (songTime + lookAheadTime) as TimeInSeconds,
      previouslyScheduledNoteIds,
    );

    previouslyScheduledNoteIds = result.previouslyScheduledNoteIds;

    // eslint-disable-next-line no-console
    console.log(
      'requesting time range',
      songTime,
      songTime + lookAheadTime,
      result.notesToScheduleForInstrument,
    );

    result.notesToScheduleForInstrument.forEach((item) => {
      item.instrument.schedule(item.notes);
    });

    timeoutId = window.setTimeout(() => schedule(), scheduleInterval * 1000);
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
  const dispose = () => {};

  return {
    play,
    stop,
    pause,
    dispose,
  };
};
