import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { MotionProps } from 'framer-motion';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// define the base component styles
const invokeAI = definePartsStyle(() => ({
  // define the part you're going to style
  button: {
    // this will style the MenuButton component
    fontWeight: 500,
    bg: 'base.500',
    color: 'base.100',
    _hover: {
      bg: 'base.600',
      color: 'base.50',
      fontWeight: 600,
    },
  },
  list: {
    zIndex: 9999,
    color: 'base.150',
    bg: 'base.800',
    shadow: 'dark-lg',
    border: 'none',
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    fontSize: 'sm',
    bg: 'base.800',
    _hover: {
      bg: 'base.700',
      svg: {
        opacity: 1,
      },
    },
    _focus: {
      bg: 'base.600',
    },
    svg: {
      opacity: 0.7,
      fontSize: 14,
    },
  },
  divider: {
    borderColor: 'base.700',
  },
}));

export const menuTheme = defineMultiStyleConfig({
  variants: {
    invokeAI,
  },
  defaultProps: {
    variant: 'invokeAI',
  },
});

export const menuListMotionProps: MotionProps = {
  variants: {
    enter: {
      visibility: 'visible',
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.07,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      transitionEnd: {
        visibility: 'hidden',
      },
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.07,
        easings: 'easeOut',
      },
    },
  },
};
