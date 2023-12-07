import {
  ParameterHeight,
  ParameterWidth,
} from 'features/parameters/types/parameterSchemas';

export type ImageSizeState = {
  aspectRatioIndex: number;
  width: ParameterWidth;
  height: ParameterHeight;
  isLocked: boolean;
  isFree: boolean;
};
