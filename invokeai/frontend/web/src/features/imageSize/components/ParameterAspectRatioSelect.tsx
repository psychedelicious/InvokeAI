import { FormControl, FormLabel } from '@chakra-ui/react';
import { Select, SelectItem } from '@mantine/core';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { ASPECT_RATIO_MAP } from 'features/imageSize/store/constants';
import {
  aspectRatioIndexChanged,
  isFreeChanged,
} from 'features/imageSize/store/imageSizeSlice';
import { useMantineSelectStyles } from 'mantine-theme/hooks/useMantineSelectStyles';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const data: SelectItem[] = [{ label: 'Free', value: 'free' }].concat(
  ASPECT_RATIO_MAP.map((r, i) => ({
    label: r.label,
    value: String(i),
  }))
);

const ParameterAspectRatioSlider = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const aspectRatioIndex = useAppSelector(
    (state) => state.imageSize.aspectRatioIndex
  );
  const isFree = useAppSelector((state) => state.imageSize.isFree);

  const onChange = useCallback(
    (v: string | null) => {
      if (!v) {
        return;
      }
      if (v === 'free') {
        dispatch(isFreeChanged(true));
        return;
      }
      dispatch(aspectRatioIndexChanged(Number(v)));
    },
    [dispatch]
  );

  const styles = useMantineSelectStyles();

  return (
    <FormControl w={64}>
      <FormLabel w={20} flexShrink={0}>
        {t('parameters.aspect')}
      </FormLabel>
      <Select
        value={isFree ? 'free' : String(aspectRatioIndex)}
        onChange={onChange}
        data={data}
        styles={styles}
      />
    </FormControl>
  );
};

export default memo(ParameterAspectRatioSlider);
