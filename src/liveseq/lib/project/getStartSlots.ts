import type { SerializableProject } from './project';
import { getSceneById, getSlotById } from './selectors';

export const getStartSlots = (project: SerializableProject) => {
  const startScenes = project.startScenes.map(getSceneById(project));

  return startScenes.flatMap((scene) => {
    const playSlotsActions = (scene.eventActions.enter || []).filter((action) => {
      return action.type === 'playSlots';
    });

    return playSlotsActions.flatMap((action) => {
      return (action.slotIds || []).map(getSlotById(project));
    });
  });
};
