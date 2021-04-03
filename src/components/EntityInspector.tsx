import type React from 'react';
import { useInstrumentChannels, useScenes } from '../liveseq/react/useEntities';
import type { CommonProps } from '../liveseq/lib/types';

type EntityDetailsProps<T extends CommonProps> = {
  title: string;
  items: Array<T>;
  renderDetails: (item: T) => React.ReactNode;
};

const EntityDetails = <T extends CommonProps>(props: EntityDetailsProps<T>) => {
  return (
    <>
      <h3>{props.title}</h3>
      {props.items.map((item) => {
        return (
          <ul key={item.id}>
            <li>id: {item.id}</li>
            <li>name: {item.name}</li>
            <li>isEnabled: {String(!!item.isEnabled)}</li>
            {props.renderDetails(item)}
          </ul>
        );
      })}
    </>
  );
};

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
                    {enterAction.type}:{' '}
                    {enterAction.slotIds ? enterAction.slotIds.join(',') : 'all'};
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
