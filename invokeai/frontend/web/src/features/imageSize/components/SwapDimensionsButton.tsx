import { useAppDispatch } from 'app/store/storeHooks';
import IAIIconButton from 'common/components/IAIIconButton';
import { dimensionsSwapped } from 'features/imageSize/store/imageSizeSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSwapVertical } from 'react-icons/io5';

export const SwapDimensionsButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    dispatch(dimensionsSwapped());
  }, [dispatch]);
  return (
    <IAIIconButton
      aria-label={t('parameters.swapDimensions')}
      onClick={onClick}
      variant="ghost"
      size="sm"
      icon={<IoSwapVertical />}
    />
  );
};
export default memo(SwapDimensionsButton);
