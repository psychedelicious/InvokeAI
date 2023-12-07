import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAIButton from 'common/components/IAIButton';
import { isFreeChanged } from 'features/imageSize/store/imageSizeSlice';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function FreeAspectRatioButton() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isFree = useAppSelector((state) => state.imageSize.isFree);
  const onClick = useCallback(() => {
    dispatch(isFreeChanged(!isFree));
  }, [dispatch, isFree]);
  return (
    <IAIButton
      isChecked={isFree}
      onClick={onClick}
      variant={isFree ? 'outline' : 'ghost'}
      size="sm"
    >
      {t('common.free')}
    </IAIButton>
  );
}
