import { Flex } from '@chakra-ui/react';
import IAICollapse from 'common/components/IAICollapse';
import AspectRatioPreview from 'features/imageSize/components/AspectRatioPreview';
import LockAspectRatioButton from 'features/imageSize/components/LockAspectRatioButton';
import ParameterAspectRatioSelect from 'features/imageSize/components/ParameterAspectRatioSelect';
import ParameterHeight from 'features/imageSize/components/ParameterHeight';
import ParameterWidth from 'features/imageSize/components/ParameterWidth';
import SwapDimensionsButton from 'features/imageSize/components/SwapDimensionsButton';
import { useTranslation } from 'react-i18next';

export default function ImageSizeCollapse() {
  const { t } = useTranslation();

  return (
    <IAICollapse label={t('parameters.imageSize')} defaultIsOpen={true}>
      <Flex gap={2} alignItems="center">
        <Flex gap={2} flexDirection="column" width="full">
          <Flex gap={2} alignItems="center">
            <ParameterAspectRatioSelect />
            <SwapDimensionsButton />
            <LockAspectRatioButton />
          </Flex>
          <ParameterWidth />
          <ParameterHeight />
        </Flex>
        <AspectRatioPreview />
      </Flex>
    </IAICollapse>
  );
}
