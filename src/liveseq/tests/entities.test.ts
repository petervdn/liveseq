import { Beats, createLiveseq, Liveseq } from '..';
import { musicTimeToBeats } from '../lib/time/musicTime';
import { playSlots } from '../lib/entities/scene';

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
  liveseq.instrumentChannels.remove(`instrumentChannels_${iter}`);
  liveseq.noteClips.remove(`noteClips_${iter}`);
  liveseq.samplers.remove(`samplers_${iter}`);
  liveseq.samples.remove(`samples_${iter}`);
  liveseq.scenes.remove(`scenes_${iter}`);
  liveseq.slots.remove(`slots_${iter}`);
  liveseq.timelines.remove(`timelines_${iter}`);
}

function getAddOnce() {
  return {
    instrumentChannels: [
      {
        id: 'instrumentChannels_0',
        instrumentId: 'samplers_0',
        slotIds: ['slots_0'],
      },
    ],
    noteClips: [{ duration: 10, id: 'noteClips_0', notes: [] }],
    samplers: [{ id: 'samplers_0' }],
    samples: [
      {
        id: 'samples_0',
        source: '',
      },
    ],
    scenes: [{ enter: [{ slotIds: ['slots_0'], type: 'playSlots' }], id: 'scenes_0' }],
    slots: [{ id: 'slots_0', loops: 0, timelineId: 'timelines_0', type: 'timelineSlot' }],
    timelines: [
      {
        clipRanges: [{ noteClipId: 'noteClips_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timelines_0',
        name: 'Timeline Name',
      },
    ],
  };
}

function getAddTwice() {
  return {
    instrumentChannels: [
      {
        id: 'instrumentChannels_0',
        instrumentId: 'samplers_0',
        slotIds: ['slots_0'],
      },
      {
        id: 'instrumentChannels_1',
        instrumentId: 'samplers_1',
        slotIds: ['slots_1'],
      },
    ],
    noteClips: [
      { duration: 10, id: 'noteClips_0', notes: [] },
      { duration: 10, id: 'noteClips_1', notes: [] },
    ],
    samplers: [{ id: 'samplers_0' }, { id: 'samplers_1' }],
    samples: [
      {
        id: 'samples_0',
        source: '',
      },
      {
        id: 'samples_1',
        source: '',
      },
    ],
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
        clipRanges: [{ noteClipId: 'noteClips_0', end: 4, start: 0 }],
        duration: 4,
        id: 'timelines_0',
        name: 'Timeline Name',
      },
      {
        clipRanges: [{ noteClipId: 'noteClips_1', end: 4, start: 0 }],
        duration: 4,
        id: 'timelines_1',
        name: 'Timeline Name',
      },
    ],
  };
}

function addAllTypesOfEntities(liveseq: Liveseq) {
  // TODO: use sample in a sampler
  liveseq.samples.create({
    source: '',
  });

  const noteClipId = liveseq.noteClips.create({
    duration: 10 as Beats,
    notes: [], // TODO: remove this
  });

  const timelineId = liveseq.timelines.create({
    name: 'Timeline Name',
    duration: musicTimeToBeats([1, 0, 0]),
    clipRanges: [
      {
        noteClipId,
        start: musicTimeToBeats([0, 0, 0]),
        end: musicTimeToBeats([1, 0, 0]),
      },
    ],
  });

  const slotId = liveseq.slots.create({
    type: 'timelineSlot',
    timelineId,
    loops: 0,
  });

  liveseq.scenes.create({
    enter: [playSlots([slotId])],
  });

  liveseq.instrumentChannels.create({
    instrumentId: liveseq.samplers.create({}),
    slotIds: [slotId],
  });
}
