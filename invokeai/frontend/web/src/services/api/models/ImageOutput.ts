/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImageField } from './ImageField';

/**
 * Base class for invocations that output an image
 */
export type ImageOutput = {
  type: 'image';
  /**
   * The output image
   */
  image: ImageField;
};

