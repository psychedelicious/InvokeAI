/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImageField } from './ImageField';

/**
 * Upscales an image.
 */
export type UpscaleInvocation = {
  /**
   * The id of this node. Must be unique among all nodes.
   */
  id: string;
  type?: 'upscale';
  /**
   * The input image
   */
  image?: ImageField;
  /**
   * The strength
   */
  strength?: number;
  /**
   * The upscale level
   */
  level?: 2 | 4;
};

