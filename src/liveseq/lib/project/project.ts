import type { Channel } from '../entities/channel/channel';
import type { Instrument } from '../entities/instrument/instrument';
import type { Timeline } from '../entities/timeline/timeline';
import type { Clip } from '../entities/clip/clip';
import type { Slot } from '../entities/slot/slot';
import type { Scene } from '../entities/scene/scene';
import type { Sample } from '../entities/sample/sample';

export type Project = {
  libraryVersion: number;
  name: string;
  startScenes: Array<string>; // The scenes to trigger when liveseq is played (from stopped state)
  entities: {
    channels: Array<Channel>;
    instruments: Array<Instrument>;
    timelines: Array<Timeline>;
    clips: Array<Clip>;
    scenes: Array<Scene>;
    slots: Array<Slot>;
    samples: Array<Sample>;
  };
};
