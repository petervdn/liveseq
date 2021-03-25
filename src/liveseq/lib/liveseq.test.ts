import { createLiveseq } from './liveseq';
import { abSwitch } from '../../projects/abSwitch';
import type { TimeRange } from './time/timeRange';

export {};

it('liveseq', () => {
  const liveseq = createLiveseq({ project: abSwitch, audioContext: {} as never });

  // TODO: test bellow is incorrect, fix expected return
  expect(
    liveseq.getScheduleItemsInfo({
      start: 0,
      end: 2,
    } as TimeRange),
  ).toEqual([
    {
      notes: [
        {
          end: 1,
          endTime: 0.5,
          id: 'note_1',
          pitch: 'C6',
          schedulingId:
            '{"noteId":"note_1","start":0,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 0,
          startTime: 0,
          velocity: 0.75,
        },
        {
          end: 2,
          endTime: 1,
          id: 'note_2',
          pitch: 'C5',
          schedulingId:
            '{"noteId":"note_2","start":1,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 1,
          startTime: 0.5,
          velocity: 0.75,
        },
        {
          end: 3,
          endTime: 1.5,
          id: 'note_3',
          pitch: 'C5',
          schedulingId:
            '{"noteId":"note_3","start":2,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 2,
          startTime: 1,
          velocity: 0.75,
        },
        {
          end: 4,
          endTime: 2,
          id: 'note_4',
          pitch: 'C5',
          schedulingId:
            '{"noteId":"note_4","start":3,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 3,
          startTime: 1.5,
          velocity: 0.75,
        },
      ],
    },
    {
      notes: [
        {
          end: 1,
          endTime: 0.5,
          id: 'note_1',
          pitch: 'C6',
          schedulingId:
            '{"noteId":"note_1","start":0,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 0,
          startTime: 0,
          velocity: 0.75,
        },
        {
          end: 2,
          endTime: 1,
          id: 'note_2',
          pitch: 'C5',
          schedulingId:
            '{"noteId":"note_2","start":1,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 1,
          startTime: 0.5,
          velocity: 0.75,
        },
        {
          end: 3,
          endTime: 1.5,
          id: 'note_3',
          pitch: 'C5',
          schedulingId:
            '{"noteId":"note_3","start":2,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 2,
          startTime: 1,
          velocity: 0.75,
        },
        {
          end: 4,
          endTime: 2,
          id: 'note_4',
          pitch: 'C5',
          schedulingId:
            '{"noteId":"note_4","start":3,"channelId":"channel_1","slotId":"slot_1","clipId":"clip_1"}',
          start: 3,
          startTime: 1.5,
          velocity: 0.75,
        },
      ],
    },
    {
      notes: [
        {
          end: 1,
          endTime: 0.5,
          id: 'note_1',
          pitch: 'G5',
          schedulingId:
            '{"noteId":"note_1","start":0,"channelId":"channel_1","slotId":"slot_2","clipId":"clip_2"}',
          start: 0,
          startTime: 0,
          velocity: 0.75,
        },
        {
          end: 2,
          endTime: 1,
          id: 'note_2',
          pitch: 'G6',
          schedulingId:
            '{"noteId":"note_2","start":1,"channelId":"channel_1","slotId":"slot_2","clipId":"clip_2"}',
          start: 1,
          startTime: 0.5,
          velocity: 0.75,
        },
        {
          end: 3,
          endTime: 1.5,
          id: 'note_3',
          pitch: 'G6',
          schedulingId:
            '{"noteId":"note_3","start":2,"channelId":"channel_1","slotId":"slot_2","clipId":"clip_2"}',
          start: 2,
          startTime: 1,
          velocity: 0.75,
        },
        {
          end: 4,
          endTime: 2,
          id: 'note_4',
          pitch: 'G6',
          schedulingId:
            '{"noteId":"note_4","start":3,"channelId":"channel_1","slotId":"slot_2","clipId":"clip_2"}',
          start: 3,
          startTime: 1.5,
          velocity: 0.75,
        },
      ],
    },
  ]);
});
