import type { Channel } from '../channel/channel';
import type { Instrument } from '../instrument/instrument';
import type { Timeline } from '../timeline/timeline';
import type { Clip } from '../clip/clip';
import type { Slot } from '../slot/slot';
import type { Scene } from '../scene/scene';
import type { Sample } from '../sample/sample';

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
