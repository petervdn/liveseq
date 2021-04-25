import type { SceneAction } from '../../entities/scene';
import type { EntityEntries } from '../../entities/entities';
import type { PlayingSlot, SlotPlaybackState } from '../schedulerState';
import type { Beats } from '../../../../time/types';

export const getPlayingSlots = (
  sceneActions: Array<SceneAction>,
  entities: EntityEntries,
  slotPlaybackState: SlotPlaybackState,
  start: Beats,
): Array<PlayingSlot> => {
  return sceneActions.reduce((accumulator, action) => {
    if (action.type === 'stopSlots') {
      return action.slotIds
        ? accumulator.filter((playingSlot) => {
            return action.slotIds!.includes(playingSlot.slotId);
          })
        : [];
    }

    if (action.type === 'playSlots') {
      const playingSlots = (action.slotIds || Object.keys(entities.slots)).map((id) => {
        return {
          slotId: id,
          start,
        };
      });

      return action.slotIds ? [...accumulator, ...playingSlots] : playingSlots;
    }

    return accumulator;
  }, slotPlaybackState.playingSlots);
};
