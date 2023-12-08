import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAISlider from 'common/components/IAISlider2/IAISlider';
import { widthChanged } from 'features/imageSize/store/imageSizeSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const selector = createMemoizedSelector(
  [stateSelector],
  ({ generation, imageSize, config }) => {
    const { min, sliderMax, inputMax, fineStep, coarseStep } = config.sd.width;
    const { model } = generation;
    const { width } = imageSize;

    const initial = ['sdxl', 'sdxl-refiner'].includes(
      model?.base_model as string
    )
      ? 1024
      : 512;

    return {
      initial,
      width,
      min,
      max: sliderMax,
      step: coarseStep,
      inputMax,
      fineStep,
    };
  }
);
const ParameterWidth = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { initial, width, min, max, inputMax, step, fineStep } =
    useAppSelector(selector);

  const onChange = useCallback(
    (v: number) => {
      dispatch(widthChanged(v));
    },
    [dispatch]
  );

  const onReset = useCallback(() => {
    dispatch(widthChanged(initial));
  }, [dispatch, initial]);

  return (
    <IAISlider
      label={t('parameters.width')}
      value={width}
      onChange={onChange}
      onReset={onReset}
      min={min}
      max={max}
      step={step}
      fineStep={fineStep}
      withInput
      inputMax={inputMax}
      marks={[min, initial, max]}
      numberInputProps={{ w: 36 }}
      formLabelProps={{ w: 20, flexShrink: 0 }}
    />
  );
};

export default memo(ParameterWidth);
