import networkCall from '@api/index';
import { TIMEOUT } from '@configs/constants';
import {
    ApiEndpoints,
    ApiMethods,
    ApiResponse,
    ErrorMessages,
    ErrorResponse,
    InfoMessages,
    ResultsResponse,
} from '@configs/types';
import logger from '@logger/index';
import { isErrorResponse, isResultsResponse } from '@utils/guards';
import { clearState, isAuthenticated } from '@utils/state';
import { StatusCodes } from 'http-status-codes';
import authenticateUser from './authenticate';

const log = logger('SubscribeService');

/**
 * A function that calls the Results API for subscribing and then resolves when an event is returned.
 * @param startApplication The initialization function that will be called for subscribing again and when an error is encountered
 * @param resolve The reference to the resolve function of the calling function
 * @param reject The reference to the reject function of the calling function
 * @returns {void} Returns void
 */
const connectToResultsApi = (
    startApplication: () => void,
    resolve: (value: ResultsResponse) => void,
    reject: (reason: string) => void,
): void => {
    log.info(InfoMessages.SUBSCRIBING_TO_API);
    networkCall(ApiMethods.GET, ApiEndpoints.RESULTS)
        .then((resp: ApiResponse) => {
            if (resp && isErrorResponse(resp)) {
                const error = (resp as ErrorResponse).error;
                switch (error) {
                    case StatusCodes.UNAUTHORIZED:
                        log.error(ErrorMessages.SESSION_TIMED_OUT);
                        clearState();
                        log.info(InfoMessages.GENERATE_AUTH_TOKEN_DELAYED);
                        return setTimeout(startApplication, TIMEOUT);
                    case StatusCodes.NO_CONTENT:
                        log.error(ErrorMessages.REQUEST_TIMED_OUT);
                        return setTimeout(startApplication, TIMEOUT);
                    default:
                        log.error(`${ErrorMessages.UNKNOWN_ERROR}${error}`);
                        return reject(ErrorMessages.UNKNOWN_ERROR);
                }
            } else if (resp && isResultsResponse(resp)) {
                resolve(resp as ResultsResponse);
            }
        })
        .catch((err) => {
            const error = err instanceof Error ? err.message : (err as string);
            log.error(error);
            reject(error);
        });
};

/**
 * The function that initiates subscribing to the results API after checking for authentication
 * @param startApplication The initialization function that will be called for subscribing again and when an error is encountered
 * @returns {Promise<ResultsResponse>} Return a Promise that is resolved when the API returns an event
 */
const subscribe = (startApplication: () => void): Promise<ResultsResponse> =>
    new Promise<ResultsResponse>((resolve, reject) => {
        try {
            if (!isAuthenticated()) {
                log.info(InfoMessages.GENERATE_AUTH_TOKEN);
                authenticateUser(startApplication)
                    .then(() => {
                        connectToResultsApi(startApplication, resolve, reject);
                    })
                    .catch((err: unknown) => {
                        const error = err instanceof Error ? err.message : (err as string);
                        return reject(error);
                    });
            } else {
                connectToResultsApi(startApplication, resolve, reject);
            }
        } catch (err: unknown) {
            log.error((err as Error).message);
            reject((err as Error).message);
        }
    });

export default subscribe;
