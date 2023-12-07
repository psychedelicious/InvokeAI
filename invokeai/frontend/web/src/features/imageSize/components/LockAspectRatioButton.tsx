import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAIIconButton from 'common/components/IAIIconButton';
import { isLockedToggled } from 'features/imageSize/store/imageSizeSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLink, FaLinkSlash } from 'react-icons/fa6';

export const LockAspectRatioButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLocked = useAppSelector((state) => state.imageSize.isLocked);
  const onClick = useCallback(() => {
    dispatch(isLockedToggled());
  }, [dispatch]);

  return (
    <IAIIconButton
      aria-label={t('parameters.lockAspectRatio')}
      isChecked={isLocked}
      onClick={onClick}
      variant={isLocked ? 'outline' : 'ghost'}
      size="sm"
      icon={isLocked ? <FaLink /> : <FaLinkSlash />}
    />
  );
};
export default memo(LockAspectRatioButton);
