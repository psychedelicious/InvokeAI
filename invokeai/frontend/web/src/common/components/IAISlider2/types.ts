import {
  FormControlProps,
  FormLabelProps,
  NumberInputProps,
} from '@chakra-ui/react';

export type IAISliderProps = {
  /**
   * The label
   */
  label?: string;
  /**
   * The value (controlled)
   */
  value: number;
  /**
   * The minimum value
   */
  min: number;
  /**
   * The maximum value
   */
  max: number;
  /**
   * The default step
   */
  step: number;
  /**
   * The fine step (when shift is pressed)
   */
  fineStep?: number;
  /**
   * The change handler
   */
  onChange: (v: number) => void;
  /**
   * The reset handler (optional)
   */
  onReset?: () => void;
  /**
   * The value formatter (optional)
   */
  formatValue?: (v: number) => string;
  /**
   * Whether to show an input field (optional)
   */
  withInput?: boolean;
  /**
   * The minimum value for the input field (optional)
   */
  inputMin?: number;
  /**
   * The maximum value for the input field (optional)
   */
  inputMax?: number;
  /**
   * Whether the slider is disabled (optional)
   */
  isDisabled?: boolean;
  /**
   * The marks to render below the slider (optional)
   */
  marks?: number[];
  /**
   * Whether to show a tooltip over the slider thumb (optional)
   */
  withTooltip?: boolean;
  /**
   * Props for the <FormControl /> (optional)
   */
  formControlProps?: FormControlProps;
  /**
   * Props for the <FormLabel /> (optional)
   */
  formLabelProps?: FormLabelProps;
  /**
   * Props for the <NumberInput /> (optional)
   */
  numberInputProps?: NumberInputProps;
};
