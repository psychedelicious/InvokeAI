import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const error = defineStyle(() => ({
  color: 'error.400',
}));

const subtext = defineStyle(() => ({
  color: 'base.400',
}));

export const textTheme = defineStyleConfig({
  variants: {
    subtext,
    error,
  },
});
