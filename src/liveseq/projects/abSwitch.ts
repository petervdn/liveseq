import type { Liveseq, SerializableProject } from '../index';
import { musicTimeToBeats } from '../lib/time/musicTime';
import type { NoteName } from '../lib/note/note';
import type { Beats } from '../lib/types';
import { createLiveseq } from '../lib/liveseq';
import { times } from '../lib/utils/times';
import { playSlots, stopSlots } from '../lib/entities/scene';

export const getAbSwitch = (): SerializableProject => {
  const liveseq = createLiveseq({ project: { name: 'abSwitch' } });

  addMetronome(liveseq, false);
  addMetronome(liveseq, true);

  return liveseq.getProject();
};

// adds a new channel + slot + timeline + metronome clip
function addMetronome(liveseq: Liveseq, isAlternative: boolean) {
  const notes = isAlternative
    ? { emphasis: 'C5' as NoteName, regular: 'C4' as NoteName }
    : { emphasis: 'G5' as NoteName, regular: 'G6' as NoteName };

  const noteClipId = liveseq.noteClips.create({
    name: 'Clip Name',
    duration: musicTimeToBeats([1, 0, 0]),
    notes: [], // TODO: remove
  });

  times(4, (index) => {
    return liveseq.noteClips.addNote(noteClipId, {
      start: musicTimeToBeats([0, 1 * index, 0]),
      end: musicTimeToBeats([0, 1 * index + 1, 0]),
      pitch: index === 0 ? notes.emphasis : notes.regular,
    });
  });

  const timelineId = liveseq.timelines.create({
    name: 'Timeline Name',
    duration: 4 as Beats,
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
    name: 'Slot Name',
    timelineId,
    loops: 0,
  });

  const samplerId = liveseq.samplers.create({});

  liveseq.instrumentChannels.create({
    name: 'Channel Name',
    instrumentId: samplerId,
    slotIds: [slotId],
  });

  const sceneId = liveseq.scenes.create({
    name: isAlternative ? 'B' : 'A',
    enter: [playSlots([slotId])],
    leave: [stopSlots([slotId])],
  });

  liveseq.addSceneToQueue({
    sceneId,
    start: (isAlternative ? 4 : 0) as Beats,
    end: (isAlternative ? 8 : 4) as Beats,
  });
}
