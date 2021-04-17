import { BeatsRange, createRange } from '../../time/beatsRange/beatsRange';
import type { QueuedScenesByStart } from './groupQueuedScenesByStart';
import type { EntityEntries } from '../../entities/entities';
import type { Beats } from '../../types';
import { getPlayingSlots } from './getPlayingSlots';
import { removeScenesFromQueue } from './removeScenesFromQueue';
import type { SlotPlaybackState } from '../schedulerState';

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

      const sceneEntities = queuedScenes.map((scene) => {
        return entities.scenes.get(scene.sceneId);
      });

      // TODO: should be scene.getIsEnabled (we gotta pass the whole thing here)
      const enabledScenes = sceneEntities.filter((scene) => scene.isEnabled);
      const thisCurrentScenes = enabledScenes.map((scene) => ({
        start: 0 as Beats,
        sceneId: scene.id,
      }));

      const actions = enabledScenes.flatMap((scene) => {
        return scene.enter || [];
      });

      const appliedSlotPlaybackState = {
        ...{
          queuedScenes: removeScenesFromQueue(queuedScenes, thisCurrentScenes),
          playingSlots: getPlayingSlots(
            actions,
            entities,
            currentSlotPlaybackState,
            start as Beats,
          ),
        },
        ...createRange(start as Beats, end as Beats),
      };

      accumulator.push(appliedSlotPlaybackState);

      return accumulator;
    }, []);
};
