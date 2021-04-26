import type { QueuedScenesByStart } from './groupQueuedScenesByStart';
import type { EntityEntries } from '../../entities/entities';
import { getPlayingSlots } from './getPlayingSlots';
import { removeScenesFromQueue } from './removeScenesFromQueue';
import type { SlotPlaybackState } from '../schedulerState';
import type { Beats, BeatsRange } from '../../../../core/lib/types';
import { createRange } from '../../../../range';

export const getSlotPlaybackStateRanges = (
  beatsRange: BeatsRange,
  queuedScenesByStart: QueuedScenesByStart,
  entities: EntityEntries,
  slotPlaybackState: SlotPlaybackState,
) => {
  return Object.entries(queuedScenesByStart)
    .map(([key, value]) => {
      // TODO: see if we can remove this parseInt
      return [parseInt(key, 10), value] as const;
    })
    .reduce<Array<BeatsRange & SlotPlaybackState>>((accumulator, current, index, entries) => {
      const [start, queuedScenes] = current;

      // get from next entry's start, or beatsRange.end
      const end = index <= entries.length - 2 ? entries[index + 1][0] : beatsRange.end;

      // get slotPlaybackState from previous item in accumulator if there is one
      const currentSlotPlaybackState = index > 0 ? accumulator[index - 1] : slotPlaybackState;

      const sceneEntities = queuedScenes
        .map((scene) => {
          return entities.scenes.get(scene.sceneId);
        })
        .filter((scene) => scene.isEnabled);

      const thisCurrentScenes = sceneEntities.map((scene) => ({
        start: 0 as Beats, // TODO: fix
        sceneId: scene.id,
      }));

      const actions = sceneEntities.flatMap((scene) => {
        return scene.enter || [];
      });

      const appliedSlotPlaybackState = {
        ...createRange(start as Beats, end as Beats),
        queuedScenes: removeScenesFromQueue(queuedScenes, thisCurrentScenes),
        playingSlots: getPlayingSlots(actions, entities, currentSlotPlaybackState, start as Beats),
      };

      accumulator.push(appliedSlotPlaybackState);

      return accumulator;
    }, []);
};
