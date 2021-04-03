import type React from 'react';
import type { CommonProps } from '../../liveseq/lib/types';

type EntityDetailsProps<T extends CommonProps> = {
  title: string;
  items: Array<T>;
  renderDetails: (item: T) => React.ReactNode;
};
export const EntityDetails = <T extends CommonProps>(props: EntityDetailsProps<T>) => {
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
