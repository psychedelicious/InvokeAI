import { Box, Flex } from '@chakra-ui/react';
import { useAppSelector } from 'app/store/storeHooks';
import IAICollapse from 'common/components/IAICollapse';
import ImageSizeCollapse from 'features/imageSize/components/ImageSizeCollapse';
import ParamCFGScale from 'features/parameters/components/Parameters/Core/ParamCFGScale';
import ParamIterations from 'features/parameters/components/Parameters/Core/ParamIterations';
import ParamModelandVAEandScheduler from 'features/parameters/components/Parameters/Core/ParamModelandVAEandScheduler';
import ParamSteps from 'features/parameters/components/Parameters/Core/ParamSteps';
import ParamSeedFull from 'features/parameters/components/Parameters/Seed/ParamSeedFull';
import { useCoreParametersCollapseLabel } from 'features/parameters/hooks/useCoreParametersCollapseLabel';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const TextToImageTabCoreParameters = () => {
  const { t } = useTranslation();
  const { iterationsAndSeedLabel } = useCoreParametersCollapseLabel();

  return (
    <IAICollapse
      label={t('parameters.general')}
      activeLabel={iterationsAndSeedLabel}
      defaultIsOpen={true}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Flex gap={3}>
          <ParamIterations />
          <ParamSteps />
          <ParamCFGScale />
        </Flex>
        <ParamModelandVAEandScheduler />
        <Box pt={2}>
          <ParamSeedFull />
        </Box>
      </Flex>
    </IAICollapse>
  );
};

export default memo(TextToImageTabCoreParameters);
