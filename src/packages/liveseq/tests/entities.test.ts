import { Beats, createLiveseq, Liveseq } from '../index';
import { musicTimeToBeats } from '../../time/musicTime';
import { playSlots } from '../lib/entities/scene';
import { getMockedProps } from './getMockedProps';

it('adds all types of entities correctly', () => {
  const liveseq = createLiveseq(getMockedProps());

  addAllTypesOfEntities(liveseq);

  expect(liveseq.getProject().entities).toEqual({
    instrumentChannels: [
      {
        id: 'instrumentChannels_0',
        instrumentId: 'samplers_0',
        isEnabled: true,
        slotIds: ['slots_0'],
      },
    ],
    noteClips: [{ duration: 10, id: 'noteClips_0', isEnabled: true, notes: [] }],
    samplers: [{ id: 'samplers_0', isEnabled: true }],
    samples: [{ id: 'samples_0', isEnabled: true, source: '' }],
    scenes: [
      { enter: [{ slotIds: ['slots_0'], type: 'playSlots' }], id: 'scenes_0', isEnabled: true },
    ],
    slots: [
      { id: 'slots_0', isEnabled: true, loops: 0, timelineId: 'timelines_0', type: 'timelineSlot' },
    ],
    timelines: [
      {
        clipRanges: [{ end: 4, noteClipId: 'noteClips_0', start: 0 }],
        duration: 4,
        id: 'timelines_0',
        isEnabled: true,
        name: 'Timeline Name',
      },
    ],
  });

  addAllTypesOfEntities(liveseq);

  expect(liveseq.getProject().entities).toEqual({
    instrumentChannels: [
      {
        id: 'instrumentChannels_0',
        instrumentId: 'samplers_0',
        isEnabled: true,
        slotIds: ['slots_0'],
      },
      {
        id: 'instrumentChannels_1',
        instrumentId: 'samplers_1',
        isEnabled: true,
        slotIds: ['slots_1'],
      },
    ],
    noteClips: [
      { duration: 10, id: 'noteClips_0', isEnabled: true, notes: [] },
      { duration: 10, id: 'noteClips_1', isEnabled: true, notes: [] },
    ],
    samplers: [
      { id: 'samplers_0', isEnabled: true },
      { id: 'samplers_1', isEnabled: true },
    ],
    samples: [
      { id: 'samples_0', isEnabled: true, source: '' },
      { id: 'samples_1', isEnabled: true, source: '' },
    ],
    scenes: [
      { enter: [{ slotIds: ['slots_0'], type: 'playSlots' }], id: 'scenes_0', isEnabled: true },
      { enter: [{ slotIds: ['slots_1'], type: 'playSlots' }], id: 'scenes_1', isEnabled: true },
    ],
    slots: [
      { id: 'slots_0', isEnabled: true, loops: 0, timelineId: 'timelines_0', type: 'timelineSlot' },
      { id: 'slots_1', isEnabled: true, loops: 0, timelineId: 'timelines_1', type: 'timelineSlot' },
    ],
    timelines: [
      {
        clipRanges: [{ end: 4, noteClipId: 'noteClips_0', start: 0 }],
        duration: 4,
        id: 'timelines_0',
        isEnabled: true,
        name: 'Timeline Name',
      },
      {
        clipRanges: [{ end: 4, noteClipId: 'noteClips_1', start: 0 }],
        duration: 4,
        id: 'timelines_1',
        isEnabled: true,
        name: 'Timeline Name',
      },
    ],
  });
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
