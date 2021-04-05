import { BeatsRange, createRange } from '../../time/beatsRange';
import type { QueuedScenesByStart } from './groupQueuedScenesByStart';
import type { EntityEntries } from '../../entities/entities';
import type { Beats } from '../../types';
import { applyScenesToSlotPlaybackState } from './applyScenesToSlotPlaybackState';
import { removeScenesFromQueue } from './removeScenesFromQueue';
import type { SlotPlaybackState } from '../scheduler';

// TODO: better naming
// this is probably the reason it doesn't work at all right now
export const getAppliedStatesForQueuedScenes = (
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

      const appliedSlotPlaybackState = {
        ...removeScenesFromQueue(
          queuedScenes,
          applyScenesToSlotPlaybackState(
            sceneEntities,
            entities,
            currentSlotPlaybackState,
            start as Beats,
          ),
        ),
        ...createRange(start as Beats, end as Beats),
      };

      accumulator.push(appliedSlotPlaybackState);

      return accumulator;
    }, []);
};