import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IRect, Vector2d } from 'konva/lib/types';
import { RgbaColor } from 'react-colorful';
import * as InvokeAI from 'app/invokeai';
import _ from 'lodash';
import { roundDownToMultiple } from 'common/util/roundDownToMultiple';
import { RootState } from 'app/store';
import { activeTabNameSelector } from 'features/options/optionsSelectors';
import { MutableRefObject } from 'react';
import Konva from 'konva';

export interface GenericCanvasState {
  tool: InpaintingTool;
  toolSize: number;
  maskColor: RgbaColor;
  cursorPosition: Vector2d | null;
  stageDimensions: Dimensions;
  stageCoordinates: Vector2d;
  boundingBoxDimensions: Dimensions;
  boundingBoxCoordinates: Vector2d;
  boundingBoxPreviewFill: RgbaColor;
  shouldShowBoundingBox: boolean;
  shouldShowBoundingBoxFill: boolean;
  shouldShowMask: boolean;
  shouldInvertMask: boolean;
  shouldShowCheckboardTransparency: boolean;
  shouldShowBrush: boolean;
  shouldShowBrushPreview: boolean;
  stageScale: number;
  isDrawing: boolean;
  isTransformingBoundingBox: boolean;
  isMouseOverBoundingBox: boolean;
  isMovingBoundingBox: boolean;
  shouldUseInpaintReplace: boolean;
  inpaintReplace: number;
  shouldLockBoundingBox: boolean;
  isMoveBoundingBoxKeyHeld: boolean;
  isMoveStageKeyHeld: boolean;
}

export type InpaintingTool = 'maskBrush' | 'maskEraser' | 'imageEraser';

export type Dimensions = {
  width: number;
  height: number;
};

export type CanvasMaskLine = {
  type: 'maskLine';
  tool: InpaintingTool;
  strokeWidth: number;
  points: number[];
};

export type CanvasImage = {
  type: 'image';
  x: number;
  y: number;
  image: InvokeAI.Image;
};

export type CanvasEraserLine = {
  type: 'eraserLine';
  strokeWidth: number;
  points: number[];
};

// type guards
export const isCanvasMaskLine = (obj: CanvasObject): obj is CanvasMaskLine =>
  obj.type === 'maskLine';

export const isCanvasEraserLine = (
  obj: CanvasObject
): obj is CanvasEraserLine => obj.type === 'eraserLine';

export const isCanvasImage = (obj: CanvasObject): obj is CanvasImage =>
  obj.type === 'image';

type CanvasObject = CanvasImage | CanvasEraserLine | CanvasMaskLine;

export type OutpaintingCanvasState = GenericCanvasState & {
  objects: CanvasObject[];
  pastObjects: CanvasObject[][];
  futureObjects: CanvasObject[][];
  stagingArea: {
    images: CanvasImage[];
    selectedImageIndex: number;
  };
};

export type InpaintingCanvasState = GenericCanvasState & {
  objects: CanvasObject[];
  pastObjects: CanvasObject[][];
  futureObjects: CanvasObject[][];
  imageToInpaint?: InvokeAI.Image;
};

export type ValidCanvasName = 'inpainting' | 'outpainting';

export interface CanvasState {
  doesCanvasNeedScaling: boolean;
  currentCanvas: ValidCanvasName;
  inpainting: InpaintingCanvasState;
  outpainting: OutpaintingCanvasState;
}

const initialGenericCanvasState: GenericCanvasState = {
  tool: 'maskBrush',
  toolSize: 50,
  maskColor: { r: 255, g: 90, b: 90, a: 0.5 },
  stageDimensions: { width: 0, height: 0 },
  stageCoordinates: { x: 0, y: 0 },
  boundingBoxDimensions: { width: 512, height: 512 },
  boundingBoxCoordinates: { x: 0, y: 0 },
  boundingBoxPreviewFill: { r: 0, g: 0, b: 0, a: 0.5 },
  shouldShowBoundingBox: true,
  shouldShowBoundingBoxFill: true,
  cursorPosition: null,
  shouldShowMask: true,
  shouldInvertMask: false,
  shouldShowCheckboardTransparency: false,
  shouldShowBrush: true,
  shouldShowBrushPreview: false,
  isDrawing: false,
  isTransformingBoundingBox: false,
  isMouseOverBoundingBox: false,
  isMovingBoundingBox: false,
  stageScale: 1,
  shouldUseInpaintReplace: false,
  inpaintReplace: 0.1,
  shouldLockBoundingBox: false,
  isMoveBoundingBoxKeyHeld: false,
  isMoveStageKeyHeld: false,
};

const initialCanvasState: CanvasState = {
  currentCanvas: 'inpainting',
  doesCanvasNeedScaling: false,
  inpainting: {
    objects: [],
    pastObjects: [],
    futureObjects: [],
    ...initialGenericCanvasState,
  },
  outpainting: {
    objects: [],
    pastObjects: [],
    futureObjects: [],
    stagingArea: {
      images: [],
      selectedImageIndex: 0,
    },
    ...initialGenericCanvasState,
  },
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState: initialCanvasState,
  reducers: {
    setTool: (state, action: PayloadAction<InpaintingTool>) => {
      state[state.currentCanvas].tool = action.payload;
    },
    toggleTool: (state) => {
      state[state.currentCanvas].tool =
        state[state.currentCanvas].tool === 'maskBrush'
          ? 'maskEraser'
          : 'maskBrush';
    },
    setToolSize: (state, action: PayloadAction<number>) => {
      state[state.currentCanvas].toolSize = action.payload;
    },
    clearMask: (state) => {
      state[state.currentCanvas].pastObjects.push(
        state[state.currentCanvas].objects
      );
      state[state.currentCanvas].objects = state[
        state.currentCanvas
      ].objects.filter((obj) => obj.type !== 'maskLine');
      state[state.currentCanvas].futureObjects = [];
      state[state.currentCanvas].shouldInvertMask = false;
    },
    toggleShouldInvertMask: (state) => {
      state[state.currentCanvas].shouldInvertMask =
        !state[state.currentCanvas].shouldInvertMask;
    },
    toggleShouldShowMask: (state) => {
      state[state.currentCanvas].shouldShowMask =
        !state[state.currentCanvas].shouldShowMask;
    },
    setShouldInvertMask: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldInvertMask = action.payload;
    },
    setShouldShowMask: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldShowMask = action.payload;
      if (!action.payload) {
        state[state.currentCanvas].shouldInvertMask = false;
      }
    },
    setShouldShowCheckboardTransparency: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state[state.currentCanvas].shouldShowCheckboardTransparency =
        action.payload;
    },
    setShouldShowBrushPreview: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldShowBrushPreview = action.payload;
    },
    setShouldShowBrush: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldShowBrush = action.payload;
    },
    setMaskColor: (state, action: PayloadAction<RgbaColor>) => {
      state[state.currentCanvas].maskColor = action.payload;
    },
    setCursorPosition: (state, action: PayloadAction<Vector2d | null>) => {
      state[state.currentCanvas].cursorPosition = action.payload;
    },
    clearImageToInpaint: (state) => {
      state.inpainting.imageToInpaint = undefined;
    },

    setImageToOutpaint: (state, action: PayloadAction<InvokeAI.Image>) => {
      const { width: canvasWidth, height: canvasHeight } =
        state.outpainting.stageDimensions;
      const { width, height } = state.outpainting.boundingBoxDimensions;
      const { x, y } = state.outpainting.boundingBoxCoordinates;

      const maxWidth = Math.min(action.payload.width, canvasWidth);
      const maxHeight = Math.min(action.payload.height, canvasHeight);

      const newCoordinates: Vector2d = { x, y };
      const newDimensions: Dimensions = { width, height };

      if (width + x > maxWidth) {
        // Bounding box at least needs to be translated
        if (width > maxWidth) {
          // Bounding box also needs to be resized
          newDimensions.width = roundDownToMultiple(maxWidth, 64);
        }
        newCoordinates.x = maxWidth - newDimensions.width;
      }

      if (height + y > maxHeight) {
        // Bounding box at least needs to be translated
        if (height > maxHeight) {
          // Bounding box also needs to be resized
          newDimensions.height = roundDownToMultiple(maxHeight, 64);
        }
        newCoordinates.y = maxHeight - newDimensions.height;
      }

      state.outpainting.boundingBoxDimensions = newDimensions;
      state.outpainting.boundingBoxCoordinates = newCoordinates;

      // state.outpainting.imageToInpaint = action.payload;
      state.outpainting.objects = [
        {
          type: 'image',
          x: 0,
          y: 0,
          image: action.payload,
        },
      ];
      state.doesCanvasNeedScaling = true;
    },
    setImageToInpaint: (state, action: PayloadAction<InvokeAI.Image>) => {
      const { width: canvasWidth, height: canvasHeight } =
        state.inpainting.stageDimensions;
      const { width, height } = state.inpainting.boundingBoxDimensions;
      const { x, y } = state.inpainting.boundingBoxCoordinates;

      const maxWidth = Math.min(action.payload.width, canvasWidth);
      const maxHeight = Math.min(action.payload.height, canvasHeight);

      const newCoordinates: Vector2d = { x, y };
      const newDimensions: Dimensions = { width, height };

      if (width + x > maxWidth) {
        // Bounding box at least needs to be translated
        if (width > maxWidth) {
          // Bounding box also needs to be resized
          newDimensions.width = roundDownToMultiple(maxWidth, 64);
        }
        newCoordinates.x = maxWidth - newDimensions.width;
      }

      if (height + y > maxHeight) {
        // Bounding box at least needs to be translated
        if (height > maxHeight) {
          // Bounding box also needs to be resized
          newDimensions.height = roundDownToMultiple(maxHeight, 64);
        }
        newCoordinates.y = maxHeight - newDimensions.height;
      }

      state.inpainting.boundingBoxDimensions = newDimensions;
      state.inpainting.boundingBoxCoordinates = newCoordinates;

      state.inpainting.imageToInpaint = action.payload;
      state.doesCanvasNeedScaling = true;
    },
    setStageDimensions: (state, action: PayloadAction<Dimensions>) => {
      state[state.currentCanvas].stageDimensions = action.payload;

      const { width: canvasWidth, height: canvasHeight } = action.payload;

      const { width: boundingBoxWidth, height: boundingBoxHeight } =
        state[state.currentCanvas].boundingBoxDimensions;

      const newBoundingBoxWidth = roundDownToMultiple(
        _.clamp(
          boundingBoxWidth,
          64,
          canvasWidth / state[state.currentCanvas].stageScale
        ),
        64
      );
      const newBoundingBoxHeight = roundDownToMultiple(
        _.clamp(
          boundingBoxHeight,
          64,
          canvasHeight / state[state.currentCanvas].stageScale
        ),
        64
      );

      state[state.currentCanvas].boundingBoxDimensions = {
        width: newBoundingBoxWidth,
        height: newBoundingBoxHeight,
      };
    },
    setBoundingBoxDimensions: (state, action: PayloadAction<Dimensions>) => {
      state[state.currentCanvas].boundingBoxDimensions = action.payload;
      const { width: boundingBoxWidth, height: boundingBoxHeight } =
        action.payload;
      const { x: boundingBoxX, y: boundingBoxY } =
        state[state.currentCanvas].boundingBoxCoordinates;
      const { width: canvasWidth, height: canvasHeight } =
        state[state.currentCanvas].stageDimensions;

      const scaledCanvasWidth =
        canvasWidth / state[state.currentCanvas].stageScale;
      const scaledCanvasHeight =
        canvasHeight / state[state.currentCanvas].stageScale;

      const roundedCanvasWidth = roundDownToMultiple(scaledCanvasWidth, 64);
      const roundedCanvasHeight = roundDownToMultiple(scaledCanvasHeight, 64);

      const roundedBoundingBoxWidth = roundDownToMultiple(boundingBoxWidth, 64);
      const roundedBoundingBoxHeight = roundDownToMultiple(
        boundingBoxHeight,
        64
      );

      const overflowX = boundingBoxX + boundingBoxWidth - scaledCanvasWidth;
      const overflowY = boundingBoxY + boundingBoxHeight - scaledCanvasHeight;

      const newBoundingBoxWidth = _.clamp(
        roundedBoundingBoxWidth,
        64,
        roundedCanvasWidth
      );

      const newBoundingBoxHeight = _.clamp(
        roundedBoundingBoxHeight,
        64,
        roundedCanvasHeight
      );

      const overflowCorrectedX =
        overflowX > 0 ? boundingBoxX - overflowX : boundingBoxX;

      const overflowCorrectedY =
        overflowY > 0 ? boundingBoxY - overflowY : boundingBoxY;

      const clampedX = _.clamp(
        overflowCorrectedX,
        state[state.currentCanvas].stageCoordinates.x,
        roundedCanvasWidth - newBoundingBoxWidth
      );

      const clampedY = _.clamp(
        overflowCorrectedY,
        state[state.currentCanvas].stageCoordinates.y,
        roundedCanvasHeight - newBoundingBoxHeight
      );

      state[state.currentCanvas].boundingBoxDimensions = {
        width: newBoundingBoxWidth,
        height: newBoundingBoxHeight,
      };

      state[state.currentCanvas].boundingBoxCoordinates = {
        x: clampedX,
        y: clampedY,
      };
    },
    setBoundingBoxCoordinates: (state, action: PayloadAction<Vector2d>) => {
      state[state.currentCanvas].boundingBoxCoordinates = action.payload;
    },
    setStageCoordinates: (state, action: PayloadAction<Vector2d>) => {
      state[state.currentCanvas].stageCoordinates = action.payload;
    },
    setBoundingBoxPreviewFill: (state, action: PayloadAction<RgbaColor>) => {
      state[state.currentCanvas].boundingBoxPreviewFill = action.payload;
    },
    setDoesCanvasNeedScaling: (state, action: PayloadAction<boolean>) => {
      state.doesCanvasNeedScaling = action.payload;
    },
    setStageScale: (state, action: PayloadAction<number>) => {
      state[state.currentCanvas].stageScale = action.payload;
      state.doesCanvasNeedScaling = false;
    },
    setShouldShowBoundingBoxFill: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldShowBoundingBoxFill = action.payload;
    },
    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].isDrawing = action.payload;
    },
    setClearBrushHistory: (state) => {
      state[state.currentCanvas].pastObjects = [];
      state[state.currentCanvas].futureObjects = [];
    },
    setShouldUseInpaintReplace: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldUseInpaintReplace = action.payload;
    },
    setInpaintReplace: (state, action: PayloadAction<number>) => {
      state[state.currentCanvas].inpaintReplace = action.payload;
    },
    setShouldLockBoundingBox: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldLockBoundingBox = action.payload;
    },
    toggleShouldLockBoundingBox: (state) => {
      state[state.currentCanvas].shouldLockBoundingBox =
        !state[state.currentCanvas].shouldLockBoundingBox;
    },
    setShouldShowBoundingBox: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].shouldShowBoundingBox = action.payload;
    },
    setIsTransformingBoundingBox: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].isTransformingBoundingBox = action.payload;
    },
    setIsMovingBoundingBox: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].isMovingBoundingBox = action.payload;
    },
    setIsMouseOverBoundingBox: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].isMouseOverBoundingBox = action.payload;
    },
    setIsMoveBoundingBoxKeyHeld: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].isMoveBoundingBoxKeyHeld = action.payload;
    },
    setIsMoveStageKeyHeld: (state, action: PayloadAction<boolean>) => {
      state[state.currentCanvas].isMoveStageKeyHeld = action.payload;
    },
    setCurrentCanvas: (state, action: PayloadAction<ValidCanvasName>) => {
      state.currentCanvas = action.payload;
    },
    addImageToOutpaintingSesion: (
      state,
      action: PayloadAction<{
        boundingBox: IRect;
        image: InvokeAI.Image;
      }>
    ) => {
      const { boundingBox, image } = action.payload;
      if (!boundingBox || !image) return;

      const { x, y } = boundingBox;

      state.outpainting.pastObjects.push([...state.outpainting.objects]);
      state.outpainting.futureObjects = [];

      state.outpainting.objects.push({
        type: 'image',
        x,
        y,
        image,
      });
    },
    clearOutpaintingSession: (state) => {
      state.outpainting.objects = [];
    },
    addLine: (
      state,
      action: PayloadAction<CanvasEraserLine | CanvasMaskLine>
    ) => {
      state[state.currentCanvas].pastObjects.push(
        state[state.currentCanvas].objects
      );
      state[state.currentCanvas].objects.push(action.payload);
      state[state.currentCanvas].futureObjects = [];
    },
    addPointToCurrentLine: (state, action: PayloadAction<number[]>) => {
      const lastLine = state[state.currentCanvas].objects.findLast(
        (obj) => obj.type === 'eraserLine' || obj.type === 'maskLine'
      );

      if (
        !lastLine ||
        (lastLine.type !== 'eraserLine' && lastLine.type !== 'maskLine')
      )
        return;

      lastLine.points.push(...action.payload);
    },
    undo: (state) => {
      if (state.outpainting.objects.length === 0) return;

      const newObjects = state.outpainting.pastObjects.pop();
      if (!newObjects) return;
      state.outpainting.futureObjects.unshift(state.outpainting.objects);
      state.outpainting.objects = newObjects;
    },
    redo: (state) => {
      if (state.outpainting.futureObjects.length === 0) return;
      const newObjects = state.outpainting.futureObjects.shift();
      if (!newObjects) return;
      state.outpainting.pastObjects.push(state.outpainting.objects);
      state.outpainting.objects = newObjects;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadOutpaintingMergedImage.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.outpainting.pastObjects.push([...state.outpainting.objects]);
      state.outpainting.futureObjects = [];

      state.outpainting.objects = [
        {
          type: 'image',
          ...action.payload,
        },
      ];
    });
  },
});

export const {
  setTool,
  setToolSize,
  addLine,
  addPointToCurrentLine,
  setShouldInvertMask,
  setShouldShowMask,
  setShouldShowCheckboardTransparency,
  setShouldShowBrushPreview,
  setMaskColor,
  clearMask,
  clearImageToInpaint,
  undo,
  redo,
  setCursorPosition,
  setStageDimensions,
  setImageToInpaint,
  setImageToOutpaint,
  setBoundingBoxDimensions,
  setBoundingBoxCoordinates,
  setBoundingBoxPreviewFill,
  setDoesCanvasNeedScaling,
  setStageScale,
  toggleTool,
  setShouldShowBoundingBox,
  setShouldShowBoundingBoxFill,
  setIsDrawing,
  setShouldShowBrush,
  setClearBrushHistory,
  setShouldUseInpaintReplace,
  setInpaintReplace,
  setShouldLockBoundingBox,
  toggleShouldLockBoundingBox,
  setIsMovingBoundingBox,
  setIsTransformingBoundingBox,
  setIsMouseOverBoundingBox,
  setIsMoveBoundingBoxKeyHeld,
  setIsMoveStageKeyHeld,
  setStageCoordinates,
  setCurrentCanvas,
  addImageToOutpaintingSesion,
  clearOutpaintingSession,
} = canvasSlice.actions;

export default canvasSlice.reducer;

export const uploadOutpaintingMergedImage = createAsyncThunk(
  'canvas/uploadOutpaintingMergedImage',
  async (
    canvasImageLayerRef: MutableRefObject<Konva.Layer | null>,
    thunkAPI
  ) => {
    const { getState } = thunkAPI;

    const state = getState() as RootState;
    const stageScale = state.canvas.outpainting.stageScale;

    if (!canvasImageLayerRef.current) return;
    const tempScale = canvasImageLayerRef.current.scale();

    const { x: relativeX, y: relativeY } =
      canvasImageLayerRef.current.getClientRect({
        relativeTo: canvasImageLayerRef.current.getParent(),
      });

    canvasImageLayerRef.current.scale({
      x: 1 / stageScale,
      y: 1 / stageScale,
    });

    const clientRect = canvasImageLayerRef.current.getClientRect();

    const imageDataURL = canvasImageLayerRef.current.toDataURL(clientRect);

    canvasImageLayerRef.current.scale(tempScale);

    if (!imageDataURL) return;

    const response = await fetch(window.location.origin + '/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataURL: imageDataURL,
        name: 'outpaintingmerge.png',
      }),
    });

    const data = (await response.json()) as InvokeAI.ImageUploadResponse;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { destination, ...rest } = data;
    const image = {
      uuid: uuidv4(),
      ...rest,
    };

    return {
      image,
      x: relativeX,
      y: relativeY,
    };
  }
);

export const currentCanvasSelector = (state: RootState) =>
  state.canvas[state.canvas.currentCanvas];

export const outpaintingCanvasSelector = (state: RootState) =>
  state.canvas.outpainting;

export const inpaintingCanvasSelector = (state: RootState) =>
  state.canvas.inpainting;

export const areHotkeysEnabledSelector = createSelector(
  currentCanvasSelector,
  activeTabNameSelector,
  (currentCanvas: GenericCanvasState, activeTabName) => {
    return (
      currentCanvas.shouldShowMask &&
      ['inpainting', 'outpainting'].includes(activeTabName)
    );
  }
);

export const baseCanvasImageSelector = createSelector(
  [(state: RootState) => state.canvas, activeTabNameSelector],
  (canvas: CanvasState, activeTabName) => {
    if (activeTabName === 'inpainting') {
      return canvas.inpainting.imageToInpaint;
    } else if (activeTabName === 'outpainting') {
      const firstImageObject = canvas.outpainting.objects.find(
        (obj) => obj.type === 'image'
      );
      if (firstImageObject && firstImageObject.type === 'image') {
        return firstImageObject.image;
      }
    }
  }
);
