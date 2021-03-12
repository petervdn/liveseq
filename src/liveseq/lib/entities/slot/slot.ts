import type { LiveseqEntity } from '../liveSeqEntity';

export type TimelineSlot = LiveseqEntity & { type: 'timeline'; timelineId: string };

// ready for adding more types of slots
export type Slot = TimelineSlot;
