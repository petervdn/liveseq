import type { ScheduleNote } from '../../player/player';
import type { SamplerInstrument } from './sampler';

import type { OmitId } from '../../types';
import { createSamplerEntity } from './sampler';
import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';

export type SerializableInstrument = SamplerInstrument; //  | SimpleSynthInstrument;

export type InstrumentInstance = {
  schedule: (notes: Array<ScheduleNote>, audioContext: AudioContext) => void;
};

// MANAGER
export type InstrumentManager = {
  addInstrument: AddEntity<OmitId<SerializableInstrument>>;
  removeInstrument: RemoveEntity;
};

export const getInstrumentManager = ({
  addEntity,
  removeEntity,
}: EntityManagementProps): InstrumentManager => {
  return {
    addInstrument: (instrument) => {
      return addEntity((id) => createSamplerEntity({ ...instrument, id }));
    },
    removeInstrument: (instrumentId) => {
      removeEntity(instrumentId);

      // TODO: search and remove any references by id
    },
  };
};
