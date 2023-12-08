import { accordionAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const invokeAIContainer = defineStyle({
  border: 'none',
});

const invokeAIButton = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontWeight: '600',
    fontSize: 'sm',
    border: 'none',
    borderRadius: 'base',
    bg: `${c}.700`,
    color: `${c}.100`,
    _hover: {
      bg: `${c}.650`,
    },
    _expanded: {
      bg: `${c}.650`,
      borderBottomRadius: 'none',
      _hover: {
        bg: `${c}.600`,
      },
    },
  };
});

const invokeAIPanel = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    bg: `${c}.800`,
    borderRadius: 'base',
    borderTopRadius: 'none',
  };
});

const invokeAIIcon = defineStyle({});

const invokeAI = definePartsStyle((props) => ({
  container: invokeAIContainer,
  button: invokeAIButton(props),
  panel: invokeAIPanel(props),
  icon: invokeAIIcon,
}));

export const accordionTheme = defineMultiStyleConfig({
  variants: { invokeAI },
  defaultProps: {
    variant: 'invokeAI',
    colorScheme: 'base',
  },
});
