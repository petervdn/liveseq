import type { Liveseq, SerializableProject } from '../index';
import type { NoteName } from '../../note/note';
import { createLiveseq } from '../lib/liveseq';
import { times } from '../../core/utils/times';
import { playSlots, stopSlots } from '../lib/entities/scene';
import type { Beats } from '../../core';

export const getAbSwitch = (): SerializableProject => {
  const liveseq = createLiveseq({ project: { name: 'abSwitch' } });

  addMetronome(liveseq, false);
  addMetronome(liveseq, true);

  return liveseq.getProject();
};

export const getMetronomeNotes = (isAlternative: boolean) => {
  const notes = isAlternative
    ? { emphasis: 'C5' as NoteName, regular: 'C4' as NoteName }
    : { emphasis: 'G5' as NoteName, regular: 'G6' as NoteName };

  return times(4, (index) => {
    return {
      velocity: index === 0 ? 0.75 : 0.6,
      start: (1 * index) as Beats,
      end: (1 * index + 1) as Beats,
      pitch: index === 0 ? notes.emphasis : notes.regular,
    };
  });
};

// adds a new channel + slot + timeline + metronome clip
function addMetronome(liveseq: Liveseq, isAlternative: boolean) {
  const noteClipId = liveseq.noteClips.create({
    name: 'Clip Name',
    duration: 4 as Beats,
    notes: [], // TODO: remove
  });

  getMetronomeNotes(isAlternative).forEach((note) => {
    return liveseq.noteClips.addNote(noteClipId, note);
  });

  const timelineId = liveseq.timelines.create({
    name: 'Timeline Name',
    duration: 4 as Beats,
    clipRanges: [
      {
        noteClipId,
        start: 0 as Beats,
        end: 4 as Beats,
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

  const sceneEnterId = liveseq.scenes.create({
    name: `Enter ${isAlternative ? 'B' : 'A'}`,
    enter: [playSlots([slotId])],
  });
  liveseq.addSceneToQueue({
    sceneId: sceneEnterId,
    start: (isAlternative ? 4 : 0) as Beats,
  });

  const sceneLeaveId = liveseq.scenes.create({
    name: `Leave ${isAlternative ? 'B' : 'A'}`,
    enter: [stopSlots([slotId])],
  });
  liveseq.addSceneToQueue({
    sceneId: sceneLeaveId,
    start: (isAlternative ? 4 : 0) as Beats,
  });
}
