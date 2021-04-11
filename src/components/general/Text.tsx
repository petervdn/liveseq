import styled from 'styled-components';
import { compose, typography, TypographyProps } from 'styled-system';
import { Box, BoxProps } from './Box';
import type { HeadingLevel } from './Heading';

type InternalTextProps = BoxProps & TypographyProps;

// because the types seem kinda weird, plus I want some defaults
const InternalText = styled(Box)<InternalTextProps>(compose(typography));

export type TextProps = {
  // add more as needed
  as?: HeadingLevel | 'p' | 'span';
  fontFamily?: InternalTextProps['fontFamily'];
  fontSize?: InternalTextProps['fontSize'];
  position?: InternalTextProps['position'];
  children: string;
} & BoxProps;

export const Text = ({ as = 'span', children, ...props }: TextProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <InternalText as={as} {...props}>
      {children}
    </InternalText>
  );
};
