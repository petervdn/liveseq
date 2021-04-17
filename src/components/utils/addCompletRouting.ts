import type { Beats, Liveseq } from '../../liveseq';
import { playSlots } from '../../liveseq/lib/entities/scene';
import type { Note } from '../../liveseq/lib/note/note';

type CompleteRoutingProps = {
  name: string;
  liveseq: Liveseq;
  sceneStart: Beats;
  notes: Array<Partial<Note>>;
};

export const addCompleteRouting = ({ name, liveseq, sceneStart, notes }: CompleteRoutingProps) => {
  const noteClipId = liveseq.noteClips.create({
    name: `Clip - ${name}`,
    duration: 4 as Beats,
    notes: [], // TODO: remove
  });

  notes.forEach((note) => {
    liveseq.noteClips.addNote(noteClipId, note);
  });

  const timelineId = liveseq.timelines.create({
    name: `Timeline - ${name}`,
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
    name: `Slot - ${name}`,
    timelineId,
    loops: 4,
  });

  const samplerId = liveseq.samplers.create({
    name: `Sampler - ${name}`,
  });

  liveseq.instrumentChannels.create({
    name: `Channel - ${name}`,
    instrumentId: samplerId,
    slotIds: [slotId],
  });

  const sceneId = liveseq.scenes.create({
    name: `Scene - ${name}`,
    enter: [playSlots([slotId])],
  });

  liveseq.addSceneToQueue({
    sceneId,
    start: sceneStart,
  });

  return {
    liveseq,
    noteClipId,
    timelineId,
    slotId,
    samplerId,
    sceneId,
  };
};
