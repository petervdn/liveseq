import type { ScheduleNote } from '../../player/player';
import { playTick } from '../../utils/playTick';
import { getFrequency } from '../../note/note';
import type { CommonProps, OmitId } from '../../types';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';

export type SerializableSampler = CommonProps;

// TODO: when we have more samplers this needs to be moved to a general place
export type InstrumentInstance = {
  schedule: (notes: Array<ScheduleNote>, audioContext: AudioContext) => void;
};

export type SamplerEntity = InstrumentInstance & SerializableSampler;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSamplerEntity = (props: SerializableSampler): SamplerEntity => {
  return {
    ...props,
    schedule: (notes: Array<ScheduleNote>, audioContext: AudioContext) => {
      notes.forEach((note) => {
        // eslint-disable-next-line no-console
        console.log('scheduling', note.schedulingId);
        playTick(
          audioContext,
          getFrequency(note.pitch),
          note.startTime,
          note.endTime - note.startTime,
        );
      });
    },
  };
};

// MANAGER
export type SamplerManager = {
  addSampler: AddEntity<OmitId<SerializableSampler>>;
  removeSampler: RemoveEntity;
};
export const getInstrumentManager = ({
  addEntity,
  removeEntity,
}: EntityManagementProps): SamplerManager => {
  return {
    addSampler: (instrument) => {
      return addEntity((id) => createSamplerEntity({ ...instrument, id }));
    },
    removeSampler: removeEntity,
  };
};
