import { createGlobalStore, LiveseqState } from './store/globalStore';
import { getAudioContext } from './utils/getAudioContext';
import { createConnectedPlayer } from './player/connectedPlayer';
import type { Project } from './project/projectStructure';
import { createProject } from './project/project';
import { MusicTime, musicTimeToTime, timeToBeats } from './utils/musicTime';
import type { ScheduleItem } from './player/player';

export type LiveseqProps = {
  initialState?: Partial<LiveseqState>;
  project?: Project;
  audioContext?: AudioContext;
  lookAheadTime?: number;
  scheduleInterval?: number;
};

export type Liveseq = ReturnType<typeof createLiveseq>;

export const createLiveseq = ({
  initialState,
  lookAheadTime,
  project,
  audioContext = getAudioContext(),
  scheduleInterval,
}: LiveseqProps = {}) => {
  const store = createGlobalStore(initialState);

  // TODO: better naming
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const projectInstance = createProject(project);

  // eslint-disable-next-line no-console
  console.log(
    'all the notes playing in the first 2 bars:',
    projectInstance.getScheduleItems([0, 0, 0], [2, 0, 0]),
  );

  // just trying with a store setup
  // if you want the plain player just replace createConnectedPlayer with createPlayer
  // and then return the ...player instead of the store.actions
  // TODO: move somewhere
  const bpm = 120;
  const player = createConnectedPlayer({
    // this function is just adding absolute time to the notes
    getScheduleItems: (startTime, endTime) => {
      const musicStartTime = [0, timeToBeats(startTime, bpm)] as MusicTime;
      const musicEndTime = [0, timeToBeats(endTime, bpm)] as MusicTime;

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
