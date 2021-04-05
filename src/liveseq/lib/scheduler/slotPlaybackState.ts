import type { BeatsRange } from '../time/beatsRange';
import type { Beats } from '../types';

type PlayingSlot = {
  slotId: string;
  start: Beats;
};

export type QueuedScene = BeatsRange & {
  sceneId: string;
};

export type SlotPlaybackState = {
  playingSlots: Array<PlayingSlot>;
  activeSceneIds: Array<string>;
  queuedScenes: Array<QueuedScene>;
};

// TODO: return obj with fns to operate on it
export const createSlotPlaybackState = (): SlotPlaybackState => {
  const defaultSlotPlaybackState = {
    playingSlots: [],
    activeSceneIds: [],
    queuedScenes: [],
  };

  return defaultSlotPlaybackState;
};
