import type { SerializableProject } from '../liveseq';
import { musicTimeToBeats } from '../liveseq/lib/time/musicTime';
import type { NoteName } from '../liveseq/lib/note/note';
import { createSlotPlaybackState } from '../liveseq/lib/player/slotPlaybackState';
import type { Beats } from '../liveseq/lib/time/time';
import { getIdGenerator } from '../liveseq/lib/utils/getIdGenerator';
import { createNote } from '../liveseq/lib/note/note';

const getNoteId = getIdGenerator('note');
const getClipId = getIdGenerator('clip');

const getMetronome = (isAlternative: boolean) => {
  const notes = isAlternative
    ? { emphasis: 'C5' as NoteName, regular: 'C4' as NoteName }
    : { emphasis: 'G5' as NoteName, regular: 'G6' as NoteName };

  return {
    id: getClipId(),
    type: 'noteClip' as const,
    name: 'Clip Name',
    duration: musicTimeToBeats([1, 0, 0]),
    notes: [
      createNote({
        id: getNoteId(),
        start: musicTimeToBeats([0, 0, 0]),
        end: musicTimeToBeats([0, 1, 0]),
        pitch: notes.emphasis,
      }),
      createNote({
        id: getNoteId(),
        start: musicTimeToBeats([0, 1, 0]),
        end: musicTimeToBeats([0, 2, 0]),
        pitch: notes.regular,
      }),
      createNote({
        id: getNoteId(),
        start: musicTimeToBeats([0, 2, 0]),
        end: musicTimeToBeats([0, 3, 0]),
        pitch: notes.regular,
      }),
      createNote({
        id: getNoteId(),
        start: musicTimeToBeats([0, 3, 0]),
        end: musicTimeToBeats([0, 4, 0]),
        pitch: notes.regular,
      }),
    ],
  };
};

const clipA = getMetronome(false);
const clipB = getMetronome(true);

export const abSwitch: SerializableProject = {
  libraryVersion: 0,
  name: 'A-B Switch',
  initialState: {
    slotPlaybackState: {
      ...createSlotPlaybackState(),
      queuedScenes: [
        {
          start: 0 as Beats,
          end: 4 as Beats,
          sceneId: 'scene_1',
        },
        {
          start: 4 as Beats,
          end: 8 as Beats,
          sceneId: 'scene_2',
        },
      ],
    },
  },
  entities: {
    channels: [
      {
        id: 'channel_1',
        name: 'Channel Name',
        type: 'instrumentChannel',
        instrumentId: 'sampler_1',
        slotIds: ['slot_1', 'slot_2'],
      },
    ],
    instruments: [
      {
        id: 'sampler_1',
        type: 'samplerInstrument',
      },
    ],
    // global to allow same slot in multiple channels
    slots: [
      {
        id: 'slot_1',
        type: 'timelineSlot',
        name: 'Slot Name',
        timelineId: 'timeline_1',
        loops: 0,
      },
      {
        id: 'slot_2',
        type: 'timelineSlot',
        timelineId: 'timeline_2',
        name: 'Slot Name',
        loops: 0,
      },
    ],
    // global to allow same clip being used multiple times in timelines
    clips: [clipA, clipB],
    // global to allow same timeline being used in multiple channels or slots
    timelines: [
      {
        id: 'timeline_1',
        name: 'Timeline Name',
        duration: musicTimeToBeats([1, 0, 0]),
        clips: [
          {
            clipId: clipA.id,
            start: musicTimeToBeats([0, 0, 0]),
            end: musicTimeToBeats([1, 0, 0]),
          },
        ],
      },
      {
        id: 'timeline_2',
        name: 'Timeline Name',
        duration: musicTimeToBeats([1, 0, 0]),
        clips: [
          {
            clipId: clipB.id,
            start: musicTimeToBeats([0, 0, 0]),
            end: musicTimeToBeats([1, 0, 0]),
          },
        ],
      },
    ],
    samples: [],
    scenes: [
      {
        id: 'scene_1',
        name: 'A',
        eventActions: {
          enter: [
            {
              type: 'playSlots',
              slotIds: ['slot_1'],
            },
          ],
          leave: [
            {
              type: 'stopSlots',
              slotIds: ['slot_1'],
            },
          ],
        },
      },
      {
        id: 'scene_2',
        name: 'B',
        eventActions: {
          enter: [
            {
              type: 'stopSlots',
            },
            {
              type: 'playSlots',
              slotIds: ['slot_2'],
            },
          ],
        },
      },
    ],
  },
};
