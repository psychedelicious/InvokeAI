import { sliderAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const invokeAITrack = defineStyle((props) => {
  return {
    bg: mode('base.400', 'base.600')(props),
    h: 2,
  };
});

const invokeAIFilledTrack = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    bg: mode(`${c}.400`, `${c}.600`)(props),
    h: 2,
  };
});

const invokeAIThumb = defineStyle((props) => {
  return {
    w: 4,
    h: 4,
    bg: mode('base.50', 'accent.400')(props),
    borderRadius: 'full',
    borderColor: mode('base.400', 'base.200')(props),
    borderWidth: 3,
    _hover: {
      transform: `translateY(-50%) scale(1.15)`,
      transition: 'transform 0.1s',
      _active: {
        transform: `translateY(-50%) scale(1.22)`,
        transition: 'transform 0.05s',
      },
    },
  };
});

const invokeAIMark = defineStyle((props) => {
  return {
    fontSize: '2xs',
    fontWeight: '500',
    color: mode('base.700', 'base.400')(props),
    mt: 2,
    insetInlineStart: 'unset',
  };
});

const invokeAI = definePartsStyle((props) => ({
  container: {
    _disabled: {
      opacity: 0.6,
      cursor: 'default',
      pointerEvents: 'none',
    },
  },
  track: invokeAITrack(props),
  filledTrack: invokeAIFilledTrack(props),
  thumb: invokeAIThumb(props),
  mark: invokeAIMark(props),
}));

export const sliderTheme = defineMultiStyleConfig({
  variants: { invokeAI },
  defaultProps: {
    variant: 'invokeAI',
    colorScheme: 'accent',
  },
});
