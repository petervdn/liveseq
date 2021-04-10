import styled from 'styled-components';
import { compose, typography, TypographyProps, color, ColorProps } from 'styled-system';
import { Box, BoxProps } from './Box';
import type { HeadingLevel } from './Heading';

type InternalTextProps = BoxProps & TypographyProps & ColorProps;

// because the types seem kinda weird, plus I want some defaults
const InternalText = styled(Box)<InternalTextProps>(compose(typography, color));

type TextProps = {
  // add more as needed
  as?: HeadingLevel | 'p' | 'span';
  fontFamily?: InternalTextProps['fontFamily'];
  fontSize?: InternalTextProps['fontSize'];
  children: string;
};

const defaultFontFamily = `-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`;

export const Text = ({
  as = 'span',
  fontFamily = defaultFontFamily,
  children,
  ...props
}: TextProps) => {
  return (
    <InternalText as={as} {...props} fontFamily={fontFamily}>
      {children}
    </InternalText>
  );
};
