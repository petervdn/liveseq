import { Beats, createLiveseq, Liveseq } from '..';
import { musicTimeToBeats } from '../lib/time/musicTime';

const addAllTypesOfEntities = (liveseq: Liveseq) => {
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
};

it('adds all types of entities correctly', () => {
  const liveseq = createLiveseq();

  addAllTypesOfEntities(liveseq);

  expect(liveseq.getProject().entities).toMatchSnapshot();

  addAllTypesOfEntities(liveseq);

  expect(liveseq.getProject().entities).toMatchSnapshot();
});
