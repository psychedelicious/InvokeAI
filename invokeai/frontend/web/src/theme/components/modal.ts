import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const invokeAIOverlay = defineStyle(() => ({
  bg: 'blackAlpha.700',
}));

const invokeAIDialogContainer = defineStyle({});

const invokeAIDialog = defineStyle(() => {
  return {
    layerStyle: 'body',
    maxH: '80vh',
  };
});

const invokeAIHeader = defineStyle(() => {
  return {
    fontWeight: '600',
    fontSize: 'lg',
    layerStyle: 'body',
    borderTopRadius: 'base',
    borderInlineEndRadius: 'base',
  };
});

const invokeAICloseButton = defineStyle({});

const invokeAIBody = defineStyle({
  overflowY: 'scroll',
});

const invokeAIFooter = defineStyle({});

export const invokeAI = definePartsStyle(() => ({
  overlay: invokeAIOverlay(),
  dialogContainer: invokeAIDialogContainer,
  dialog: invokeAIDialog(),
  header: invokeAIHeader(),
  closeButton: invokeAICloseButton,
  body: invokeAIBody,
  footer: invokeAIFooter,
}));

export const modalTheme = defineMultiStyleConfig({
  variants: {
    invokeAI,
  },
  defaultProps: { variant: 'invokeAI', size: 'lg' },
});
