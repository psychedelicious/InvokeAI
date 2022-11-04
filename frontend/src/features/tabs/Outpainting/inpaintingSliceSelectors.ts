import { createSelector } from '@reduxjs/toolkit';
import { rgbaColorToString } from 'features/canvas/util/colorToString';
import _ from 'lodash';
import { RootState } from 'app/store';
import { activeTabNameSelector } from 'features/options/optionsSelectors';
import { OptionsState } from 'features/options/optionsSlice';
import { InpaintingState } from '../Inpainting/inpaintingSlice';
// import { InpaintingState } from './outpaintingSlice';

export const inpaintingCanvasLinesSelector = createSelector(
  (state: RootState) => state.inpainting,
  (inpainting: InpaintingState) => {
    const { lines, maskColor, stageCoordinates, stageDimensions, stageScale } =
      inpainting;
    return {
      lines,
      stageCoordinates,
      stageDimensions,
      stageScale,
      maskColorString: rgbaColorToString(maskColor),
    };
  }
);

export const inpaintingControlsSelector = createSelector(
  [
    (state: RootState) => state.inpainting,
    (state: RootState) => state.options,
    activeTabNameSelector,
  ],
  (inpainting: InpaintingState, options: OptionsState, activeTabName) => {
    const {
      tool,
      brushSize,
      maskColor,
      shouldInvertMask,
      shouldShowMask,
      shouldShowCheckboardTransparency,
      lines,
      pastLines,
      futureLines,
      shouldShowBoundingBoxFill,
    } = inpainting;

    const { showDualDisplay } = options;

    return {
      tool,
      brushSize,
      maskColor,
      shouldInvertMask,
      shouldShowMask,
      shouldShowCheckboardTransparency,
      canUndo: pastLines.length > 0,
      canRedo: futureLines.length > 0,
      isMaskEmpty: lines.length === 0,
      activeTabName,
      showDualDisplay,
      shouldShowBoundingBoxFill,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: _.isEqual,
    },
  }
);

export const inpaintingCanvasSelector = createSelector(
  [(state: RootState) => state.inpainting, activeTabNameSelector],
  (inpainting: InpaintingState, activeTabName) => {
    const {
      tool,
      brushSize,
      maskColor,
      shouldInvertMask,
      shouldShowMask,
      shouldShowCheckboardTransparency,
      imageToInpaint,
      stageScale,
      shouldShowBoundingBox,
      shouldShowBoundingBoxFill,
      isDrawing,
      shouldLockBoundingBox,
      boundingBoxDimensions,
      isTransformingBoundingBox,
      isMouseOverBoundingBox,
      isMovingBoundingBox,
      stageDimensions,
      stageCoordinates,
      isMoveStageKeyHeld,
    } = inpainting;

    let stageCursor: string | undefined = '';

    if (isTransformingBoundingBox) {
      stageCursor = undefined;
    } else if (
      isMovingBoundingBox ||
      isMouseOverBoundingBox ||
      isMoveStageKeyHeld
    ) {
      stageCursor = 'move';
    } else if (shouldShowMask) {
      stageCursor = 'none';
    } else {
      stageCursor = 'default';
    }

    return {
      tool,
      brushSize,
      shouldInvertMask,
      shouldShowMask,
      shouldShowCheckboardTransparency,
      maskColor,
      imageToInpaint,
      stageScale,
      shouldShowBoundingBox,
      shouldShowBoundingBoxFill,
      isDrawing,
      shouldLockBoundingBox,
      boundingBoxDimensions,
      isTransformingBoundingBox,
      isModifyingBoundingBox: isTransformingBoundingBox || isMovingBoundingBox,
      stageCursor,
      isMouseOverBoundingBox,
      stageDimensions,
      stageCoordinates,
      isMoveStageKeyHeld,
      activeTabName,
    };
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => {
        const { imageToInpaint: a_imageToInpaint, ...a_rest } = a;
        const { imageToInpaint: b_imageToInpaint, ...b_rest } = b;
        return (
          _.isEqual(a_rest, b_rest) && a_imageToInpaint == b_imageToInpaint
        );
      },
    },
  }
);
