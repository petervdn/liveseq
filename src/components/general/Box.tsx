import styled from 'styled-components';
import {
  compose,
  space,
  SpaceProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
} from 'styled-system';

export type BoxProps = SpaceProps & LayoutProps & PositionProps;

export const Box = styled.div<BoxProps>(compose(layout, space, position));
