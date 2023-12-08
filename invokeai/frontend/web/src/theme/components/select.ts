import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
import { getInputOutlineStyles } from 'theme/util/getInputOutlineStyles';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const invokeAIIcon = defineStyle(() => {
  return {
    color: 'base.300',
  };
});

const invokeAIField = defineStyle(() => ({
  fontWeight: '600',
  ...getInputOutlineStyles(),
}));

const invokeAI = definePartsStyle(() => {
  return {
    field: invokeAIField(),
    icon: invokeAIIcon(),
  };
});

export const selectTheme = defineMultiStyleConfig({
  variants: {
    invokeAI,
  },
  defaultProps: {
    size: 'sm',
    variant: 'invokeAI',
  },
});
