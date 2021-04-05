import type { getScheduleItemsWithinRange } from './utils/getScheduleItemsWithinRange';
import type { Note } from '../note/note';
import type { TimeInSeconds } from '../types';
import type { MixerChannel } from '../mixer/mixer';
import type { Instrument } from '../entities/instrumentChannel';

export type ScheduleNote = Note & {
  startTime: TimeInSeconds;
  endTime: TimeInSeconds;
  schedulingId: string;
};
export type ScheduleItem = {
  notes: Array<ScheduleNote>;
  channelMixer: MixerChannel;
  instrument: Instrument;
};
export type ScheduleData = ReturnType<typeof getScheduleItemsWithinRange>;

// TODO: createScheduler
