import { Beats, createLiveseq, Liveseq } from '..';
import { musicTimeToBeats } from '../lib/time/musicTime';
import { playSlots } from '../lib/entities/scene/scene';

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
  liveseq.removeInstrumentChannel(`instrumentChannels_${iter}`);
  liveseq.removeNoteClip(`noteClips_${iter}`);
  liveseq.removeSampler(`samplers_${iter}`);
  liveseq.removeSample(`samples_${iter}`);
  liveseq.removeScene(`scenes_${iter}`);
  liveseq.removeSlot(`slots_${iter}`);
  liveseq.removeTimeline(`timelines_${iter}`);
}

function getAddOnce() {
  return {
    instrumentChannels: [
      {
        id: 'instrumentChannels_0',
        samplerId: 'samplers_0',
        slotIds: ['slots_0'],
      },
    ],
    noteClips: [{ duration: 10, id: 'noteClips_0', notes: [], type: 'noteClip' }],
    samplers: [{ id: 'samplers_0' }],
    samples: [],
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
        samplerId: 'samplers_0',
        slotIds: ['slots_0'],
      },
      {
        id: 'instrumentChannels_1',
        samplerId: 'samplers_1',
        slotIds: ['slots_1'],
      },
    ],
    noteClips: [
      { duration: 10, id: 'noteClips_0', notes: [], type: 'noteClip' },
      { duration: 10, id: 'noteClips_1', notes: [], type: 'noteClip' },
    ],
    samplers: [{ id: 'samplers_0' }, { id: 'samplers_1' }],
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
  liveseq.addSample({
    source: '',
  });

  const noteClipId = liveseq.addNoteClip({
    type: 'noteClip',
    duration: 10 as Beats,
  });

  const timelineId = liveseq.addTimeline({
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

  const slotId = liveseq.addSlot({
    type: 'timelineSlot',
    timelineId,
    loops: 0,
  });

  liveseq.addScene({
    enter: [playSlots([slotId])],
  });

  liveseq.addInstrumentChannel({
    samplerId: liveseq.addSampler({}),
    slotIds: [slotId],
  });
}
