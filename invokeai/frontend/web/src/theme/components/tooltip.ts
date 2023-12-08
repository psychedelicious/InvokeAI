import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { cssVar } from '@chakra-ui/theme-tools';

const $arrowBg = cssVar('popper-arrow-bg');

// define the base component styles
const baseStyle = defineStyle(() => ({
  borderRadius: 'base',
  shadow: 'dark-lg',
  bg: 'base.200',
  [$arrowBg.variable]: 'colors.base.200',
  pb: 1.5,
}));

// export the component theme
export const tooltipTheme = defineStyleConfig({ baseStyle });
