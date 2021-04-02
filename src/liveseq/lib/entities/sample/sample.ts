import type { AddEntity, EntityManagementProps, RemoveEntity } from '../entityManager';
import type { CommonProps, OmitId } from '../../types';

export type SerializableSample = CommonProps & {
  source: string;
};

export type SampleEntity = SerializableSample;

// might be the same as config for now but for the sake of consistency and to get the interface used internally
export const createSampleEntity = (props: SerializableSample): SampleEntity => {
  return props;
};

// MANAGER
export type SampleManager = {
  addSample: AddEntity<OmitId<SerializableSample>>;
  removeSample: RemoveEntity;
};

export const getSampleManager = ({
  addEntity,
  removeEntity,
}: EntityManagementProps): SampleManager => {
  return {
    addSample: (clip) => {
      return addEntity((id) => createSampleEntity({ ...clip, id }));
    },
    removeSample: (noteClipId) => {
      return removeEntity(noteClipId);
    },
  };
};
