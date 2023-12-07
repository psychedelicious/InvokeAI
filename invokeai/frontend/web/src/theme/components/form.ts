import { formAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle(() => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
  };
});

export const formTheme = defineMultiStyleConfig({
  baseStyle,
});
