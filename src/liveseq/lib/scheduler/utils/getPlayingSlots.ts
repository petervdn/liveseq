import type { SceneAction } from '../../entities/scene';
import type { EntityEntries } from '../../entities/entities';
import type { Beats } from '../../types';
import type { PlayingSlot, SlotPlaybackState } from '../schedulerState';

export const getPlayingSlots = (
  sceneActions: Array<SceneAction>,
  entities: EntityEntries,
  slotPlaybackState: SlotPlaybackState,
  start: Beats,
): Array<PlayingSlot> => {
  const appliedScenes = sceneActions.reduce((accumulator, action) => {
    if (action.type === 'playSlots') {
      const playingSlots = (action.slotIds || Object.keys(entities.slots)).map((id) => {
        return {
          slotId: id,
          start,
        };
      });

      return action.slotIds ? [...accumulator, ...playingSlots] : playingSlots;
    }

    if (action.type === 'stopSlots') {
      return action.slotIds
        ? accumulator.filter((playingSlot) => {
            return action.slotIds!.includes(playingSlot.slotId);
          })
        : [];
    }

    return accumulator;
  }, slotPlaybackState.playingSlots);

  const playingSlots = slotPlaybackState.playingSlots.concat(appliedScenes);

  return playingSlots;
};
