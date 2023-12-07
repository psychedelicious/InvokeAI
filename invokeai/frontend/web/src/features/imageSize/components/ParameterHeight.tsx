import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import IAISlider2 from 'common/components/IAISlider/IAISlider2';
import { heightChanged } from 'features/imageSize/store/imageSizeSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const selector = createSelector(
  [stateSelector],
  ({ generation, imageSize, config }) => {
    const { min, sliderMax, inputMax, fineStep, coarseStep } = config.sd.height;
    const { model } = generation;
    const { height } = imageSize;

    const initial = ['sdxl', 'sdxl-refiner'].includes(
      model?.base_model as string
    )
      ? 1024
      : 512;

    return {
      initial,
      height,
      min,
      max: sliderMax,
      inputMax,
      step: coarseStep,
      fineStep,
    };
  },
  defaultSelectorOptions
);

const ParameterHeight = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { initial, height, min, max, inputMax, step, fineStep } =
    useAppSelector(selector);

  const onChange = useCallback(
    (v: number) => {
      dispatch(heightChanged(v));
    },
    [dispatch]
  );

  const onReset = useCallback(() => {
    dispatch(heightChanged(initial));
  }, [dispatch, initial]);

  return (
    <IAISlider2
      label={t('parameters.height')}
      value={height}
      onChange={onChange}
      onReset={onReset}
      min={min}
      max={max}
      step={step}
      fineStep={fineStep}
      isInteger
      withInput
      hideTooltip
      inputMax={inputMax}
      marks={[min, initial, max]}
      numberInputProps={{ w: 36 }}
      formLabelProps={{ w: 20, flexShrink: 0 }}
    />
  );
};

export default memo(ParameterHeight);
