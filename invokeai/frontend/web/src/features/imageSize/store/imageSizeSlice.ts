import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { roundToMultiple } from 'common/util/roundDownToMultiple';
import { ASPECT_RATIO_MAP } from 'features/imageSize/store/constants';
import { ImageSizeState } from 'features/imageSize/store/types';

const setDimensions = (state: ImageSizeState) => {
  const ratio = ASPECT_RATIO_MAP[state.aspectRatioIndex]?.value;
  if (!ratio) {
    // Something has gone terribly awry
    return;
  }
  const currentArea = state.width * state.height;
  const newWidth = Math.sqrt(currentArea / ratio);
  state.width = roundToMultiple(newWidth, 8);
  state.height = roundToMultiple(newWidth * ratio, 8);
};

const initialImageSizeState: ImageSizeState = {
  aspectRatioIndex: 3,
  width: 512,
  height: 512,
  isLocked: false,
  isFree: false,
};

export const imageSizeSlice = createSlice({
  name: 'imageSize',
  initialState: initialImageSizeState,
  reducers: {
    aspectRatioIndexChanged: (
      state,
      action: PayloadAction<ImageSizeState['aspectRatioIndex']>
    ) => {
      state.aspectRatioIndex = action.payload;
      state.isLocked = true;
      state.isFree = false;
      setDimensions(state);
    },
    dimensionsSwapped: (state) => {
      if (state.isFree) {
        const oldWidth = state.width;
        const oldHeight = state.height;
        state.width = oldHeight;
        state.height = oldWidth;
        return;
      }
      state.aspectRatioIndex =
        ASPECT_RATIO_MAP.length - 1 - state.aspectRatioIndex;
      setDimensions(state);
    },
    widthChanged: (state, action: PayloadAction<ImageSizeState['width']>) => {
      if (state.isLocked) {
        const ratio = state.isFree
          ? state.height / state.width
          : ASPECT_RATIO_MAP[state.aspectRatioIndex]?.value;
        if (!ratio) {
          // Something has gone terribly awry
          return;
        }
        state.height = roundToMultiple(action.payload * ratio, 8);
      }
      state.width = action.payload;
    },
    heightChanged: (state, action: PayloadAction<ImageSizeState['height']>) => {
      if (state.isLocked) {
        const ratio = state.isFree
          ? state.height / state.width
          : ASPECT_RATIO_MAP[state.aspectRatioIndex]?.value;
        if (!ratio) {
          // Something has gone terribly awry
          return;
        }
        state.width = roundToMultiple(action.payload / ratio, 8);
      }
      state.height = action.payload;
    },
    isLockedToggled: (state) => {
      state.isLocked = !state.isLocked;
      if (!state.isLocked) {
        state.isFree = true;
      }
    },
    isFreeChanged: (state, action: PayloadAction<boolean>) => {
      state.isFree = action.payload;
      if (action.payload) {
        state.isLocked = false;
      }
    },
  },
});

export const {
  aspectRatioIndexChanged,
  dimensionsSwapped,
  widthChanged,
  heightChanged,
  isLockedToggled,
  isFreeChanged,
} = imageSizeSlice.actions;

export default imageSizeSlice.reducer;
