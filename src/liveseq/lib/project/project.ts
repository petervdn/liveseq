import type { SerializableChannel } from '../entities/channel/channel';
import type { SerializableInstrument } from '../entities/instrument/instrument';
import type { SerializableTimeline } from '../entities/timeline/timeline';
import type { SerializableClip } from '../entities/clip/clip';
import type { SerializableSlot } from '../entities/slot/slot';
import type { SerializableScene } from '../entities/scene/scene';
import type { SerializableSample } from '../entities/sample/sample';
import type { SlotPlaybackState } from '../slotPlaybackState/slotPlaybackState';

export type SerializableProject = {
  libraryVersion: number;
  name: string;
  slotPlaybackState: SlotPlaybackState;
  entities: {
    channels: Array<SerializableChannel>;
    instruments: Array<SerializableInstrument>;
    timelines: Array<SerializableTimeline>;
    clips: Array<SerializableClip>;
    scenes: Array<SerializableScene>;
    slots: Array<SerializableSlot>;
    samples: Array<SerializableSample>;
  };
};
