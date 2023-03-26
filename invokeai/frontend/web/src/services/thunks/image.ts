import { createAppAsyncThunk } from 'app/storeUtils';
import { ImagesService } from 'services/api';

type GetImageArg = Parameters<(typeof ImagesService)['getImage']>[0];

// createAppAsyncThunk provides typing for getState and dispatch
export const getImage = createAppAsyncThunk(
  'api/getImage',
  async (arg: GetImageArg, _thunkApi) => {
    const response = await ImagesService.getImage(arg);
    return response;
  }
);
