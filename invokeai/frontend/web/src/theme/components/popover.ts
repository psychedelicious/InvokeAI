import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { cssVar, mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $popperBg = cssVar('popper-bg');
const $arrowBg = cssVar('popper-arrow-bg');
const $arrowShadowColor = cssVar('popper-arrow-shadow-color');

const invokeAIContent = defineStyle((props) => {
  return {
    [$arrowBg.variable]: 'colors.base.800',
    [$popperBg.variable]: 'colors.base.800',
    [$arrowShadowColor.variable]: mode(
      'colors.base.400',
      'colors.base.600'
    )(props),
    minW: 'unset',
    width: 'unset',
    p: 4,
    bg: 'base.800',
    border: 'none',
    shadow: 'dark-lg',
  };
});

const informationalContent = defineStyle((props) => {
  return {
    [$arrowBg.variable]: 'colors.base.700',
    [$popperBg.variable]: 'colors.base.700',
    [$arrowShadowColor.variable]: mode(
      'colors.base.400',
      'colors.base.400'
    )(props),
    p: 4,
    bg: 'base.700',
    border: 'none',
    shadow: 'dark-lg',
  };
});

const invokeAI = definePartsStyle((props) => ({
  content: invokeAIContent(props),
  body: { padding: 0 },
}));

const informational = definePartsStyle((props) => ({
  content: informationalContent(props),
  body: { padding: 0 },
}));

export const popoverTheme = defineMultiStyleConfig({
  variants: {
    invokeAI,
    informational,
  },
  defaultProps: {
    variant: 'invokeAI',
  },
});
