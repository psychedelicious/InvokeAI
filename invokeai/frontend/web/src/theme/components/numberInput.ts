import { numberInputAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { getInputOutlineStyles } from 'theme/util/getInputOutlineStyles';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const invokeAIRoot = defineStyle(() => {
  return {
    height: 8,
  };
});

const invokeAIField = defineStyle(() => {
  return {
    border: 'none',
    fontWeight: '600',
    height: 'auto',
    py: 1,
    ps: 2,
    pe: 6,
    ...getInputOutlineStyles(),
  };
});

const invokeAIStepperGroup = defineStyle(() => {
  return {
    display: 'flex',
  };
});

const invokeAIStepper = defineStyle(() => {
  return {
    border: 'none',
    // expand arrow hitbox
    px: 2,
    py: 0,
    mx: -2,
    my: 0,

    svg: {
      color: 'base.300',
      width: 2.5,
      height: 2.5,
      _hover: {
        color: 'base.100',
      },
    },
  };
});

const invokeAI = definePartsStyle(() => ({
  root: invokeAIRoot(),
  field: invokeAIField(),
  stepperGroup: invokeAIStepperGroup(),
  stepper: invokeAIStepper(),
}));

export const numberInputTheme = defineMultiStyleConfig({
  variants: {
    invokeAI,
  },
  defaultProps: {
    size: 'sm',
    variant: 'invokeAI',
  },
});
