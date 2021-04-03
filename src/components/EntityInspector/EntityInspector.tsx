import type React from 'react';
import { useInstrumentChannels, useScenes } from '../../liveseq/react/useEntities';
import { EntityDetails } from './EntityDetails';

const InstrumentChannels = () => {
  const instrumentChannels = useInstrumentChannels();
  return (
    <EntityDetails
      title="InstrumentChannels"
      items={instrumentChannels}
      renderDetails={(item) => {
        return (
          <>
            <li>slotIds: {item.slotIds.join(',')};</li>
          </>
        );
      }}
    />
  );
};

const Scenes = () => {
  const scenes = useScenes();
  return (
    <EntityDetails
      title="Scenes"
      items={scenes}
      renderDetails={(scene) => {
        return (
          <>
            {scene.enter &&
              scene.enter.map((enterAction, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={index}>
                    enter - {enterAction.type}:{' '}
                    {enterAction.slotIds ? enterAction.slotIds.join(',') : 'all'};
                  </li>
                );
              })}

            {scene.leave &&
              scene.leave.map((leaveAction, index) => {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={index}>
                    leave - {leaveAction.type}:{' '}
                    {leaveAction.slotIds ? leaveAction.slotIds.join(',') : 'all'};
                  </li>
                );
              })}
          </>
        );
      }}
    />
  );
};

export const EntityInspector: React.FunctionComponent = () => {
  return (
    <>
      <InstrumentChannels />
      <Scenes />
    </>
  );
};
