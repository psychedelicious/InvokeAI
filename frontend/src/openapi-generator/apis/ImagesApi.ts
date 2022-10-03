/* tslint:disable */
/* eslint-disable */
/**
 * Invoke AI
 * An API for invoking AI image operations
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  HTTPValidationError,
  ImageType,
} from '../models';
import {
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    ImageTypeFromJSON,
    ImageTypeToJSON,
} from '../models';

export interface GetImageApiV1ImagesImageTypeImageNameGetRequest {
    imageType: ImageType;
    imageName: string;
}

/**
 * 
 */
export class ImagesApi extends runtime.BaseAPI {

    /**
     * Gets a result
     * Get Image
     */
    async getImageApiV1ImagesImageTypeImageNameGetRaw(requestParameters: GetImageApiV1ImagesImageTypeImageNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.imageType === null || requestParameters.imageType === undefined) {
            throw new runtime.RequiredError('imageType','Required parameter requestParameters.imageType was null or undefined when calling getImageApiV1ImagesImageTypeImageNameGet.');
        }

        if (requestParameters.imageName === null || requestParameters.imageName === undefined) {
            throw new runtime.RequiredError('imageName','Required parameter requestParameters.imageName was null or undefined when calling getImageApiV1ImagesImageTypeImageNameGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/images/{image_type}/{image_name}`.replace(`{${"image_type"}}`, encodeURIComponent(String(requestParameters.imageType))).replace(`{${"image_name"}}`, encodeURIComponent(String(requestParameters.imageName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Gets a result
     * Get Image
     */
    async getImageApiV1ImagesImageTypeImageNameGet(requestParameters: GetImageApiV1ImagesImageTypeImageNameGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.getImageApiV1ImagesImageTypeImageNameGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
