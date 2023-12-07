import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const baseStyle = defineStyle((props) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    fontSize: 'sm',
    me: 0,
    mb: 0,
    fontWeight: 600,
    transitionProperty: 'common',
    transitionDuration: 'normal',
    whiteSpace: 'nowrap',
    _disabled: {
      opacity: 0.4,
    },
    color: mode('base.700', 'base.300')(props),
    _invalid: {
      color: mode('error.500', 'error.300')(props),
    },
  };
});

export const formLabelTheme = defineStyleConfig({
  baseStyle,
});
