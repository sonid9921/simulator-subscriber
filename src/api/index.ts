import { SERVER_CONNECTION_TIMEOUT } from '@configs/constants';
import {
    ApiEndpoints,
    ApiMethods,
    ApiResponse,
    ContentTypes,
    ErrorMessages,
    InfoMessages,
    RequestCallbackFunction,
    RequestEvents,
    RequestHeaders,
    ResponseEvents,
} from '@configs/types';
import logger from '@logger/index';
import { isString } from '@utils/guards';
import { getAuthToken } from '@utils/state';
import { StatusCodes } from 'http-status-codes';
import { IncomingMessage, request } from 'node:http';

const log = logger('NetworkController');

/**
 * A function that returns the callback function to be passed to the HTTP request for handling API response
 * @param resolve The reference of the resolve function to resolve a promise
 * @returns {RequestCallbackFunction} The callback function to be passed to the HTTP request.
 */
const responseHandler =
    (resolve: (value: ApiResponse) => void): RequestCallbackFunction =>
    (resp: IncomingMessage) => {
        const responseStatus = resp.statusCode;
        if (responseStatus !== StatusCodes.OK) {
            return resolve({ error: responseStatus as number });
        }
        const respData: Buffer[] = [];
        resp.setEncoding('utf8');
        resp.on(ResponseEvents.DATA, (chunk: Buffer | string) => {
            respData.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
        });
        resp.on(ResponseEvents.END, () => {
            resolve(JSON.parse(Buffer.concat(respData).toString('utf-8')) as ApiResponse);
        });
    };

/**
 * A common function to call the required API.
 * It calls the API and returns a promise which is resolved when the response is obtained.
 * @param method The method to be used for calling the API
 * @param path The API endpoint
 * @param data For POST request, the data to be passed
 * @returns A promise that resolves when the response is obtained.
 */
const networkCall = (method: ApiMethods, path: ApiEndpoints, data?: string | object) =>
    new Promise<ApiResponse>((resolve, reject) => {
        try {
            const bearerToken = getAuthToken();
            const baseUrl = process.env['BASE_HOST'];

            if (method === ApiMethods.GET && !bearerToken) {
                // Bearer token is not there and the request to be made is of GET method
                log.error(ErrorMessages.INVALID_BEARER_TOKEN);
                return reject(ErrorMessages.INVALID_BEARER_TOKEN);
            }

            if (!baseUrl || !isString(baseUrl)) {
                log.error(ErrorMessages.INVALID_BASE_URL);
                return reject(ErrorMessages.INVALID_BASE_URL);
            }

            if (method === ApiMethods.POST && !data) {
                // Shows a warning if data is not passed for a POST request
                log.warn(InfoMessages.REQUEST_NO_DATA);
            }

            const requestRef = request(
                {
                    hostname: baseUrl,
                    protocol: 'http:',
                    path,
                    method,
                    timeout: SERVER_CONNECTION_TIMEOUT
                },
                responseHandler(resolve),
            );

            if (method === ApiMethods.POST) {
                requestRef.setHeader(
                    RequestHeaders.CONTENT_TYPE,
                    typeof data === 'string' ? ContentTypes.TEXT : ContentTypes.JSON,
                );
                requestRef.write(typeof data === 'string' ? data : JSON.stringify(data));
            } else if (method === ApiMethods.GET) {
                requestRef.setHeader(RequestHeaders.AUTHORIZATION, `Bearer ${bearerToken}`);
            }

            requestRef.on(RequestEvents.ERROR, (err: unknown) => {
                const error = err instanceof Error ? err.message : (err as string)
                return reject(`${ErrorMessages.REQUEST_CREATION_ERROR}${error}`);
            });

            requestRef.on(RequestEvents.CLOSE, (err: unknown) => {
                const error = err instanceof Error ? err.message : (err as string)
                return reject(`${ErrorMessages.REQUEST_CLOSED_PREMATURELY}${error}`);
            });

            requestRef.end();
        } catch (err) {
            const error = typeof err === 'string' ? err : (err as Error).message;
            log.error(`${ErrorMessages.REQUEST_TRANSFER_ERROR}${error}`);
            return reject(`${ErrorMessages.REQUEST_TRANSFER_ERROR}${error}`);
        }
    });

export default networkCall;
