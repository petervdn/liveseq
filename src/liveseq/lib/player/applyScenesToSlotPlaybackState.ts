import type { SceneInstance } from '../entities/scene';
import type { Entities } from '../entities/entities';
import type { Beats } from '../types';
import type { SlotPlaybackState } from './slotPlaybackState';

export const applyScenesToSlotPlaybackState = (
  scenes: Array<Pick<SceneInstance, 'id' | 'isEnabled' | 'enter' | 'leave'>>,
  entities: Pick<Entities, 'slots'>,
  slotPlaybackState: SlotPlaybackState,
  start: Beats,
): SlotPlaybackState => {
  // TODO: consider isEnabled
  // TODO: incomplete implementation, only plays
  const appliedScenes = scenes.flatMap((scene) => {
    return (scene.enter || []).flatMap((action) => {
      if (action.type === 'playSlots') {
        // if not specified we get all
        const slotIds = action.slotIds || Object.keys(entities.slots);

        return slotIds.map((id) => {
          return {
            slotId: id,
            start,
          };
        });
      }
      if (action.type === 'stopSlots') {
        // gotta stop em, maybe need to use reduce instead of flatMap so we can mess up with accumulator
      }
      return [];
    });
  });

  const playingSlots = slotPlaybackState.playingSlots.concat(appliedScenes);

  const activeSceneIds = scenes.map((scene) => scene.id); // TODO: incomplete

  return {
    ...slotPlaybackState,
    playingSlots,
    activeSceneIds,
  };
};
