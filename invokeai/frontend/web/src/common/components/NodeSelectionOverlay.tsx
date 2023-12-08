import { Box } from '@chakra-ui/react';
import { memo, useMemo } from 'react';

type Props = {
  isSelected: boolean;
  isHovered: boolean;
};
const SelectionOverlay = ({ isSelected, isHovered }: Props) => {
  const shadow = useMemo(() => {
    if (isSelected && isHovered) {
      return 'nodeHoveredSelected';
    }
    if (isSelected) {
      return 'nodeSelected';
    }
    if (isHovered) {
      return 'nodeHovered';
    }
    return undefined;
  }, [isHovered, isSelected]);
  return (
    <Box
      className="selection-box"
      sx={{
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        bottom: 0,
        insetInlineStart: 0,
        borderRadius: 'base',
        opacity: isSelected || isHovered ? 1 : 0.5,
        transitionProperty: 'common',
        transitionDuration: '0.1s',
        pointerEvents: 'none',
        shadow,
      }}
    />
  );
};

export default memo(SelectionOverlay);
