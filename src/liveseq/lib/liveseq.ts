import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';
import type { Project } from './project/projectStructure';
import { createProject } from './project/project';
import { musicTimeToTime, timeToMusicTime } from './utils/musicTime';
import type { ScheduleItem } from './player/player';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  project?: Project;
  audioContext?: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
  bpm?: number;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = ({
  bpm = 120,
  initialState,
  lookAheadTime,
  project,
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const store = createGlobalStore(initialState);
  const projectInstance = createProject(project);

  // just trying with a store setup
  const player = createConnectedPlayer({
    // this function is just adding absolute time to the notes
    getScheduleItems: (startTime, endTime) => {
      const musicStartTime = timeToMusicTime(startTime, bpm);
      const musicEndTime = timeToMusicTime(endTime, bpm);
      const notesWithInstrument = projectInstance.getScheduleItems(musicStartTime, musicEndTime);

      return notesWithInstrument.map((item) => {
        const scheduleItem: ScheduleItem = {
          ...item,
          notes: item.notes.map((note) => {
            return {
              ...note,
              startTime: musicTimeToTime(note.start, bpm),
              endTime: musicTimeToTime(note.end, bpm),
            };
          }),
        };

        return scheduleItem;
      });
    },
    audioContext,
    store,
    lookAheadTime,
    scheduleInterval,
  });

  const dispose = () => {
    player.dispose();
    store.dispose();
  };

  // liveseq's API
  return {
    subscribe: store.subscribe,
    ...store.actions,
    dispose,
    audioContext,
  };
};
