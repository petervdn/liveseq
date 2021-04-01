// import type { Bpm, TimeInSeconds } from '../time/time';
// import type { ScheduleItem } from './player';
// import { getTimelineNotesInRange } from '../entities/timeline/timeline.utils';
// import { beatsToTime } from '../time/musicTime';
// import type { Entities } from '../entities/entities';
// import { getChannelsBySlotId, getClipsByTimelineId } from '../entities/entities';
// import { timeRangeToBeatsRange } from '../time/beatsRange';

export {};

// const testProject = abSwitch;
// const entities = createEntities(testProject);
// const scheduleItems = getScheduleItems(
//   entities,
//   ['slots_1'],
//   0 as TimeInSeconds,
//   2 as TimeInSeconds,
//   60 as Bpm,
// );
// console.log(scheduleItems[0].notes);

// seems like the range math is incorrect
// export const getScheduleItems = (
//   entities: Entities,
//   slotIds: Array<string>,
//   startTime: TimeInSeconds,
//   endTime: TimeInSeconds,
//   bpm: Bpm,
// ): Array<ScheduleItem> => {
//   const beatsRange = timeRangeToBeatsRange({ start: startTime, end: endTime }, bpm);
//
//   return slotIds.flatMap((slotId) => {
//     const slot = entities.slots[slotId];
//     const timeline = entities.timelines[slot.timelineId];
//     const timelineClips = getClipsByTimelineId(entities, timeline.id);
//     const channels = getChannelsBySlotId(entities, slot.id);
//
//     return channels.reduce((accumulator, channel) => {
//       const notes = getTimelineNotesInRange(
//         beatsRange,
//         timeline,
//         timelineClips,
//         channel.id,
//         slot.id,
//         slot.loops,
//       );
//
//       if (notes.length === 0) return accumulator;
//
//       const instrument = entities.instruments[channel.instrumentId];
//
//       accumulator.push({
//         instrument,
//         notes: notes.map((note) => {
//           return {
//             ...note,
//             startTime: beatsToTime(note.start, bpm),
//             endTime: beatsToTime(note.end, bpm),
//           };
//         }),
//       });
//
//       return accumulator;
//     }, [] as Array<ScheduleItem>);
//   });
// };
