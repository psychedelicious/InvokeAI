import { sliderAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const invokeAITrack = defineStyle(() => {
  return {
    bg: 'base.600',
    h: 2,
  };
});

const invokeAIFilledTrack = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    bg: `${c}.600`,
    h: 2,
  };
});

const invokeAIThumb = defineStyle(() => {
  return {
    w: 4,
    h: 4,
    bg: 'accent.400',
    borderRadius: 'full',
    borderColor: 'base.200',
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

const invokeAIMark = defineStyle(() => {
  return {
    fontSize: '2xs',
    fontWeight: '500',
    color: 'base.400',
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
  track: invokeAITrack(),
  filledTrack: invokeAIFilledTrack(props),
  thumb: invokeAIThumb(),
  mark: invokeAIMark(),
}));

export const sliderTheme = defineMultiStyleConfig({
  variants: { invokeAI },
  defaultProps: {
    variant: 'invokeAI',
    colorScheme: 'accent',
  },
});
