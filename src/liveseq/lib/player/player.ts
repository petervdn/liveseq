import type { Note } from '../note/note';
import type { TimeInSeconds } from '../time/time';

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
    schedule: (context: AudioContext, notes: Array<ScheduleNote>) => void;
  };
};

export type PlayerProps = {
  audioContext: AudioContext;
  lookAheadTime?: TimeInSeconds;
  scheduleInterval?: TimeInSeconds;
  // called every time schedule runs to get "what" to schedule from the project
  getScheduleItems: (startTime: TimeInSeconds, endTime: TimeInSeconds) => Array<ScheduleItem>;
};

// export type Player = ReturnType<typeof createPlayer>;

export const createPlayer = ({
  audioContext,
  getScheduleItems,
  scheduleInterval = 1000 as TimeInSeconds,
  lookAheadTime = 1200 as TimeInSeconds,
}: PlayerProps) => {
  let playStartTime: number | null = null;
  let timeoutId: number | null = null;
  let previouslyScheduledNoteIds: Array<string> = [];

  if (lookAheadTime <= scheduleInterval) {
    throw new Error('LookAheadTime should be larger than the scheduleInterval');
  }

  const schedule = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const songTime = (audioContext.currentTime - playStartTime!) as TimeInSeconds; // playStartTime should always be defined when playing

    const scheduleItems = getScheduleItems(songTime, (songTime + lookAheadTime) as TimeInSeconds);

    scheduleItems.forEach((item) => {
      const notesToSchedule = item.notes.filter(({ schedulingId }) => {
        const hasBeenScheduled = previouslyScheduledNoteIds.includes(schedulingId);
        // eslint-disable-next-line no-console
        hasBeenScheduled && console.log('skipping scheduling of', schedulingId);
        return !hasBeenScheduled;
      });

      item.instrument.schedule(audioContext, notesToSchedule);

      previouslyScheduledNoteIds = notesToSchedule.map(({ schedulingId }) => schedulingId);
    });

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
  const dispose = () => {};

  return {
    play,
    stop,
    pause,
    dispose,
  };
};
