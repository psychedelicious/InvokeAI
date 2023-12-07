import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { roundDownToMultiple } from 'common/util/roundDownToMultiple';
import { shiftKeyPressed } from 'features/ui/store/hotkeysSlice';
import { clamp } from 'lodash-es';
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Arg = {
  value: number;
  initial: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fineStep?: number;
  inputMin?: number;
  inputMax?: number;
  isInteger?: boolean;
};

export const useIAISliderState = (arg: Arg) => {
  const {
    value,
    initial,
    min,
    max,
    step: _step,
    fineStep,
    isInteger,
    onChange: _onChange,
    inputMin: _inputMin,
    inputMax: _inputMax,
  } = arg;
  const dispatch = useAppDispatch();
  const shift = useAppSelector((state) => state.hotkeys.shift);
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    String(value)
  );

  useEffect(() => {
    // Must use an effect to update `inputValue`, because `value` may be changed by some external source
    setInputValue(value);
  }, [value]);

  const inputMin = useMemo(() => _inputMin ?? min, [_inputMin, min]);

  const inputMax = useMemo(() => _inputMax ?? max, [_inputMax, max]);

  const onChange = useCallback(
    (v: number) => {
      _onChange(v);
    },
    [_onChange]
  );

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
      _onChange(quantized);
      setInputValue(quantized);
    },
    [isInteger, inputValue, inputMin, inputMax, _step, _onChange]
  );

  const inputOnChange = useCallback((v: number | string) => {
    setInputValue(v);
  }, []);

  const onReset = useCallback(() => {
    if (initial !== undefined) {
      _onChange(initial);
    }
  }, [initial, _onChange]);

  const inputForceBlur = useCallback((e: MouseEvent) => {
    if (e.target instanceof HTMLDivElement) {
      e.target.focus();
    }
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.shiftKey) {
        dispatch(shiftKeyPressed(true));
      }
    },
    [dispatch]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey) {
        dispatch(shiftKeyPressed(false));
      }
    },
    [dispatch]
  );

  const stepperOnClick = useCallback(
    () => _onChange(Number(inputValue)),
    [inputValue, _onChange]
  );

  const step = useMemo(
    () => (shift ? fineStep : _step),
    [_step, fineStep, shift]
  );

  return {
    onChange,
    onReset,
    onKeyDown,
    onKeyUp,
    step,
    inputValue,
    inputMin,
    inputMax,
    inputOnBlur,
    inputOnChange,
    inputForceBlur,
    stepperOnClick,
  };
};
