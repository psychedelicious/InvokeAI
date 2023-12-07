import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import IAIIconButton from 'common/components/IAIIconButton';
import IAISliderMarks from 'common/components/IAISlider/IAISliderMarks';
import { IAISliderMarksData } from 'common/components/IAISlider/types';
import { roundDownToMultiple } from 'common/util/roundDownToMultiple';
import { shiftKeyPressed } from 'features/ui/store/hotkeysSlice';
import { AnimatePresence } from 'framer-motion';
import { clamp } from 'lodash-es';
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowsRotate } from 'react-icons/fa6';

export type IAISliderProps = {
  label?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fineStep?: number;
  isInteger?: boolean;
  onChange: (v: number) => void;
  onReset?: () => void;
  formatValue?: (v: number) => string;
  withInput?: boolean;
  inputMin?: number;
  inputMax?: number;
  isDisabled?: boolean;
  marks?: IAISliderMarksData;
  hideTooltip?: boolean;
  formControlProps?: FormControlProps;
  formLabelProps?: FormLabelProps;
  numberInputProps?: NumberInputProps;
};

const IAISlider2 = (props: IAISliderProps) => {
  const {
    label,
    value,
    min,
    max,
    step: _step,
    fineStep: _fineStep,
    isInteger = false,
    onChange,
    onReset,
    formatValue,
    marks,
    withInput = false,
    inputMin: _inputMin,
    inputMax: _inputMax,
    isDisabled = false,
    hideTooltip = false,
    formControlProps,
    formLabelProps,
    numberInputProps,
  } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const shift = useAppSelector((state) => state.hotkeys.shift);
  const [isMouseOverSlider, setIsMouseOverSlider] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    String(value)
  );

  useEffect(() => {
    // Must use an effect to update `inputValue`, because `value` may be changed by some external source
    setInputValue(value);
  }, [value]);

  const inputMin = useMemo(() => _inputMin ?? min, [_inputMin, min]);

  const inputMax = useMemo(() => _inputMax ?? max, [_inputMax, max]);

  const inputOnBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
        e.target.value = String(inputMin);
      }
      const clamped = clamp(
        isInteger ? Math.floor(Number(e.target.value)) : Number(inputValue),
        inputMin,
        inputMax
      );
      const quantized = roundDownToMultiple(clamped, _step);
      onChange(quantized);
      setInputValue(quantized);
    },
    [isInteger, inputValue, inputMin, inputMax, _step, onChange]
  );

  const inputOnChange = useCallback((v: number | string) => {
    setInputValue(v);
  }, []);

  const inputForceBlur = useCallback((e: MouseEvent) => {
    if (e.target instanceof HTMLDivElement) {
      e.target.focus();
    }
  }, []);

  const inputOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.shiftKey) {
        dispatch(shiftKeyPressed(true));
      }
    },
    [dispatch]
  );

  const inputOnKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey) {
        dispatch(shiftKeyPressed(false));
      }
    },
    [dispatch]
  );

  const stepperOnClick = useCallback(
    () => onChange(Number(inputValue)),
    [inputValue, onChange]
  );

  const step = useMemo(
    () => (shift ? _fineStep : _step),
    [_step, _fineStep, shift]
  );

  const tooltip = useMemo(
    () => (formatValue ? formatValue(value) : value),
    [formatValue, value]
  );

  const onMouseEnter = useCallback(() => setIsMouseOverSlider(true), []);
  const onMouseLeave = useCallback(() => setIsMouseOverSlider(false), []);
  const onChangeStart = useCallback(() => setIsChanging(true), []);
  const onChangeEnd = useCallback(() => setIsChanging(false), []);

  return (
    <FormControl
      onClick={inputForceBlur}
      isDisabled={isDisabled}
      {...formControlProps}
    >
      <FormLabel {...formLabelProps}>
        {label}
        {onReset && (
          <IAIIconButton
            size="xs"
            variant="ghost"
            aria-label={t('accessibility.reset')}
            icon={<FaArrowsRotate />}
            isDisabled={isDisabled}
            onClick={onReset}
          />
        )}
      </FormLabel>
      <Slider
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        focusThumbOnChange={false}
        isDisabled={isDisabled}
        onChangeStart={onChangeStart}
        onChangeEnd={onChangeEnd}
      >
        <AnimatePresence>
          {marks?.length && (isMouseOverSlider || isChanging) && (
            <IAISliderMarks marks={marks} />
          )}
        </AnimatePresence>

        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>

        <Tooltip
          hasArrow
          placement="top"
          isOpen={isMouseOverSlider && !hideTooltip}
          label={tooltip}
        >
          <SliderThumb onDoubleClick={onReset} zIndex={0} />
        </Tooltip>
      </Slider>

      {withInput && (
        <NumberInput
          min={inputMin}
          max={inputMax}
          step={step}
          value={inputValue}
          onChange={inputOnChange}
          onBlur={inputOnBlur}
          focusInputOnChange={false}
          {...numberInputProps}
        >
          <NumberInputField onKeyDown={inputOnKeyDown} onKeyUp={inputOnKeyUp} />
          <NumberInputStepper>
            <NumberIncrementStepper onClick={stepperOnClick} />
            <NumberDecrementStepper onClick={stepperOnClick} />
          </NumberInputStepper>
        </NumberInput>
      )}
    </FormControl>
  );
};

export default memo(IAISlider2);
