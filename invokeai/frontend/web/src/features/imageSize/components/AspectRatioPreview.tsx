import { Flex, Icon } from '@chakra-ui/react';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { FaImage } from 'react-icons/fa';

const CONTAINER_SIZE_PX = 28 * 4;
// When the aspect ratio is between these two values, we show the icon (experimentally determined)
const ICON_LOW_CUTOFF = 0.23;
const ICON_HIGH_CUTOFF = 1 / ICON_LOW_CUTOFF;
const ICON_SIZE_PX = 48;
const ICON_PADDING_PX = 16;
const BOX_SIZE = `min(${ICON_SIZE_PX}px, calc(100% - ${ICON_PADDING_PX}px))`;

const selector = createMemoizedSelector(stateSelector, ({ imageSize }) => {
  const width_ = imageSize.width;
  const height_ = imageSize.height;

  const aspectRatio = width_ / height_;
  let width = width_;
  let height = height_;

  if (width_ > height_) {
    width = Math.min(width_, CONTAINER_SIZE_PX);
    height = width / aspectRatio;
  } else {
    height = Math.min(height_, CONTAINER_SIZE_PX);
    width = height * aspectRatio;
  }

  const shouldShowIcon =
    aspectRatio < ICON_HIGH_CUTOFF && aspectRatio > ICON_LOW_CUTOFF;

  return { width, height, shouldShowIcon };
});

const AspectRatioPreview = () => {
  const { width, height, shouldShowIcon } = useAppSelector(selector);

  return (
    <Flex
      flexShrink={0}
      w={`${CONTAINER_SIZE_PX}px`}
      h={`${CONTAINER_SIZE_PX}px`}
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        as={motion.div}
        layerStyle="first"
        borderRadius="base"
        initial={false}
        animate={{
          width: `${width}px`,
          height: `${height}px`,
          transition: { duration: 0.1, ease: 'easeOut' },
        }}
        alignItems="center"
        justifyContent="center"
      >
        {shouldShowIcon && (
          <Icon as={FaImage} color="base.700" boxSize={BOX_SIZE} />
        )}
      </Flex>
    </Flex>
  );
};

export default memo(AspectRatioPreview);
