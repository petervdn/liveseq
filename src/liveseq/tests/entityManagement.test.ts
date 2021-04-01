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

it('adding all twice and immediately removing all twice is the same result', () => {
  const liveseq = createLiveseq();

  addAllTypesOfEntities(liveseq);
  addAllTypesOfEntities(liveseq);
  removeAllByIteration(liveseq, 0);
  removeAllByIteration(liveseq, 1);

  expect(liveseq.getProject().entities).toEqual(createLiveseq().getProject().entities);
});

function removeAllByIteration(liveseq: Liveseq, iter: number) {
  liveseq.removeChannel(`channels_${iter}`);
  liveseq.removeClip(`clips_${iter}`);
  liveseq.removeInstrument(`instruments_${iter}`);
  liveseq.removeSample(`samples_${iter}`);
  liveseq.removeScene(`scenes_${iter}`);
  liveseq.removeSlot(`slots_${iter}`);
  liveseq.removeTimeline(`timelines_${iter}`);
}

function getAddOnce() {
  return {
    channels: [
      {
        id: 'channels_0',
        instrumentId: 'instruments_0',
        slotIds: ['slots_0'],
        type: 'instrumentChannel',
      },
    ],
    clips: [{ duration: 10, id: 'clips_0', notes: [], type: 'noteClip' }],
    instruments: [{ id: 'instruments_0', type: 'samplerInstrument' }],
    samples: [],
    scenes: [{ enter: [{ slotIds: ['slots_0'], type: 'playSlots' }], id: 'scenes_0' }],
    slots: [{ id: 'slots_0', loops: 0, timelineId: 'timelines_0', type: 'timelineSlot' }],
    timelines: [
      {
        clipRanges: [{ clipId: 'clips_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timelines_0',
        name: 'Timeline Name',
      },
    ],
  };
}

function getAddTwice() {
  return {
    channels: [
      {
        id: 'channels_0',
        instrumentId: 'instruments_0',
        slotIds: ['slots_0'],
        type: 'instrumentChannel',
      },
      {
        id: 'channels_1',
        instrumentId: 'instruments_1',
        slotIds: ['slots_1'],
        type: 'instrumentChannel',
      },
    ],
    clips: [
      { duration: 10, id: 'clips_0', notes: [], type: 'noteClip' },
      { duration: 10, id: 'clips_1', notes: [], type: 'noteClip' },
    ],
    instruments: [
      { id: 'instruments_0', type: 'samplerInstrument' },
      { id: 'instruments_1', type: 'samplerInstrument' },
    ],
    samples: [],
    scenes: [
      { enter: [{ slotIds: ['slots_0'], type: 'playSlots' }], id: 'scenes_0' },
      { enter: [{ slotIds: ['slots_1'], type: 'playSlots' }], id: 'scenes_1' },
    ],
    slots: [
      { id: 'slots_0', loops: 0, timelineId: 'timelines_0', type: 'timelineSlot' },
      { id: 'slots_1', loops: 0, timelineId: 'timelines_1', type: 'timelineSlot' },
    ],
    timelines: [
      {
        clipRanges: [{ clipId: 'clips_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timelines_0',
        name: 'Timeline Name',
      },
      {
        clipRanges: [{ clipId: 'clips_1', end: 4, start: 0 }],
        duration: 4,
        id: 'timelines_1',
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
    clipRanges: [
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
    enter: [
      {
        type: 'playSlots',
        slotIds: [slotId],
      },
    ],
  });

  liveseq.addChannel({
    type: 'instrumentChannel',
    instrumentId: liveseq.addInstrument({
      type: 'samplerInstrument',
    }),
    slotIds: [slotId],
  });
}
