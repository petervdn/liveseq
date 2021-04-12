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
  opacity,
  OpacityProps,
  border,
  BorderProps,
} from 'styled-system';

export type BoxProps = SpaceProps &
  LayoutProps &
  PositionProps &
  ColorProps &
  OpacityProps &
  BorderProps;

export const Box = styled.div<BoxProps>(compose(layout, space, position, color, opacity, border));
