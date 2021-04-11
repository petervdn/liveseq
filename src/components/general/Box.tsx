import styled from 'styled-components';
import {
  compose,
  space,
  SpaceProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  color,
  ColorProps,
} from 'styled-system';

export type BoxProps = SpaceProps & LayoutProps & PositionProps & ColorProps;

export const Box = styled.div<BoxProps>(compose(layout, space, position, color));
