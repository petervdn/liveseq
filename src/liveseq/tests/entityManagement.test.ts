import { Beats, createLiveseq, Liveseq } from '..';
import { musicTimeToBeats } from '../lib/time/musicTime';

// TODO: add samples isn't tested
it('adds all types of entities correctly', () => {
  const liveseq = createLiveseq();

  addAllTypesOfEntities(liveseq);

  expect(liveseq.getProject().entities).toEqual(getAddOnce());

  addAllTypesOfEntities(liveseq);

  expect(liveseq.getProject().entities).toEqual(getAddTwice());
});

function getAddOnce() {
  return {
    channels: [
      {
        id: 'channel_0',
        instrumentId: 'instrument_0',
        slotIds: ['slot_0'],
        type: 'instrumentChannel',
      },
    ],
    clips: [{ duration: 10, id: 'clip_0', notes: [], type: 'noteClip' }],
    instruments: [{ id: 'instrument_0', type: 'samplerInstrument' }],
    samples: [],
    scenes: [
      { eventActions: { enter: [{ slotIds: ['slot_0'], type: 'playSlots' }] }, id: 'scene_0' },
    ],
    slots: [{ id: 'slot_0', loops: 0, timelineId: 'timeline_0', type: 'timelineSlot' }],
    timelines: [
      {
        clips: [{ clipId: 'clip_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timeline_0',
        name: 'Timeline Name',
      },
    ],
  };
}

function getAddTwice() {
  return {
    channels: [
      {
        id: 'channel_0',
        instrumentId: 'instrument_0',
        slotIds: ['slot_0'],
        type: 'instrumentChannel',
      },
      {
        id: 'channel_1',
        instrumentId: 'instrument_1',
        slotIds: ['slot_1'],
        type: 'instrumentChannel',
      },
    ],
    clips: [
      { duration: 10, id: 'clip_0', notes: [], type: 'noteClip' },
      { duration: 10, id: 'clip_1', notes: [], type: 'noteClip' },
    ],
    instruments: [
      { id: 'instrument_0', type: 'samplerInstrument' },
      { id: 'instrument_1', type: 'samplerInstrument' },
    ],
    samples: [],
    scenes: [
      { eventActions: { enter: [{ slotIds: ['slot_0'], type: 'playSlots' }] }, id: 'scene_0' },
      { eventActions: { enter: [{ slotIds: ['slot_1'], type: 'playSlots' }] }, id: 'scene_1' },
    ],
    slots: [
      { id: 'slot_0', loops: 0, timelineId: 'timeline_0', type: 'timelineSlot' },
      { id: 'slot_1', loops: 0, timelineId: 'timeline_1', type: 'timelineSlot' },
    ],
    timelines: [
      {
        clips: [{ clipId: 'clip_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timeline_0',
        name: 'Timeline Name',
      },
      {
        clips: [{ clipId: 'clip_1', end: 4, start: 0 }],
        duration: 4,
        id: 'timeline_1',
        name: 'Timeline Name',
      },
    ],
  };
}

function addAllTypesOfEntities(liveseq: Liveseq) {
  const clipId = liveseq.addClip({
    type: 'noteClip',
    duration: 10 as Beats,
    notes: [],
  });

  const timelineId = liveseq.addTimeline({
    name: 'Timeline Name',
    duration: musicTimeToBeats([1, 0, 0]),
    clips: [
      {
        clipId,
        start: musicTimeToBeats([0, 0, 0]),
        end: musicTimeToBeats([1, 0, 0]),
      },
    ],
  });

  const slotId = liveseq.addSlot({
    type: 'timelineSlot',
    timelineId,
    loops: 0,
  });

  liveseq.addScene({
    eventActions: {
      enter: [
        {
          type: 'playSlots',
          slotIds: [slotId],
        },
      ],
    },
  });

  liveseq.addChannel({
    type: 'instrumentChannel',
    instrumentId: liveseq.addInstrument({
      type: 'samplerInstrument',
    }),
    slotIds: [slotId],
  });
}
