import type { Liveseq, SerializableProject } from '../index';
import { musicTimeToBeats } from '../lib/time/musicTime';
import type { NoteName } from '../lib/note/note';
import type { Beats } from '../lib/types';
import { createLiveseq } from '../lib/liveseq';
import { times } from '../lib/utils/times';
import { playSlotsAction, stopSlotsAction } from '../lib/entities/scene/scene';

export const getAbSwitch = (): SerializableProject => {
  const liveseq = createLiveseq({ project: { name: 'abSwitch' } });

  addMetronome(liveseq, false);
  addMetronome(liveseq, true);

  return liveseq.getProject();
};

// adds a new channel + slot + timeline + metronome clip
function addMetronome(liveseq: Liveseq, isAlternative: boolean) {
  const clipId = addMetronomeClip(liveseq, isAlternative);

  const timelineId = liveseq.addTimeline({
    name: 'Timeline Name',
    duration: 4 as Beats,
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
    name: 'Slot Name',
    timelineId,
    loops: 0,
  });

  const instrumentId = liveseq.addInstrument({
    type: 'samplerInstrument',
  });

  liveseq.addChannel({
    name: 'Channel Name',
    instrumentId,
    slotIds: [slotId],
  });

  const sceneId = liveseq.addScene({
    name: isAlternative ? 'B' : 'A',
    enter: [playSlotsAction([slotId])],
    leave: [stopSlotsAction([slotId])],
  });

  liveseq.addSceneToQueue({
    sceneId,
    start: (isAlternative ? 4 : 0) as Beats,
    end: (isAlternative ? 8 : 4) as Beats,
  });
}

function addMetronomeClip(liveseq: Liveseq, isAlternative: boolean) {
  const notes = isAlternative
    ? { emphasis: 'C5' as NoteName, regular: 'C4' as NoteName }
    : { emphasis: 'G5' as NoteName, regular: 'G6' as NoteName };

  const clipId = liveseq.addClip({
    type: 'noteClip' as const, // TODO: remove this by renaming Clip to NoteClip, so addNoteClip
    name: 'Clip Name',
    duration: musicTimeToBeats([1, 0, 0]),
  });

  times(4, (index) => {
    return liveseq.addNote(clipId, {
      start: musicTimeToBeats([0, 1 * index, 0]),
      end: musicTimeToBeats([0, 1 * index + 1, 0]),
      pitch: index === 0 ? notes.emphasis : notes.regular,
    });
  });

  return clipId;
}
