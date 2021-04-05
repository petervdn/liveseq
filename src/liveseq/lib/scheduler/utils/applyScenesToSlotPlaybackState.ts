import type { SceneInstance } from '../../entities/scene';
import type { EntityEntries } from '../../entities/entities';
import type { Beats } from '../../types';
import type { SlotPlaybackState } from '../scheduler';

export const applyScenesToSlotPlaybackState = (
  scenes: Array<SceneInstance>,
  entities: EntityEntries,
  slotPlaybackState: SlotPlaybackState,
  start: Beats,
): SlotPlaybackState => {
  // TODO: all of them are disabled by default, fix
  // TODO: should be scene.getIsEnabled (we gotta pass the whole thing here)
  // const enabledScenes = scenes.filter((scene) => true /* scene.isEnabled */);
  const enabledScenes = scenes;

  // TODO: incomplete implementation, only plays
  const appliedScenes = enabledScenes.flatMap((scene) => {
    // TODO: consider leave
    // TODO: consider disabled slots
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

  // TODO: don't return just ids, return the obj
  const activeSceneIds = enabledScenes.map((scene) => scene.id); // TODO: incomplete

  return {
    ...slotPlaybackState,
    playingSlots,
    activeSceneIds,
  };
};
