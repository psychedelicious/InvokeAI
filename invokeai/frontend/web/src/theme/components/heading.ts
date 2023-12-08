import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const accent = defineStyle(() => ({
  color: 'accent.300',
}));

export const headingTheme = defineStyleConfig({
  variants: {
    accent,
  },
});
