import networkCall from '@api/index';
import { TIMEOUT } from '@configs/constants';
import {
    ApiEndpoints,
    ApiMethods,
    ApiResponse,
    AuthResponse,
    ErrorMessages,
    ErrorResponse,
} from '@configs/types';
import logger from '@logger/index';
import { isAuthResponse, isErrorResponse, isString } from '@utils/guards';
import { setAuthToken } from '@utils/state';
import { StatusCodes } from 'http-status-codes';

const log = logger('AuthenticateService');

/**
 * Function that call the Auth API to authenticate the user and get a new Bearer token
 * @param startApplication The initialization function that will be called if the auth API returns an error
 * @returns {Promise<boolean>} A Promise that resolves when the API returns the bearer token. For invalid credentials the Promise gets rejected.
 */
const authenticate = (startApplication: () => void): Promise<boolean> =>
    new Promise((resolve, reject) => {
        try {
            const email = process.env['EMAIL'];
            const password = process.env['PASSWORD'];

            if (!email || !isString(email)) {
                log.error(ErrorMessages.INVALID_EMAIL);
                return reject(ErrorMessages.INVALID_EMAIL);
            }
            if (!password || !isString(password)) {
                log.error(ErrorMessages.INVALID_PASSWORD);
                return reject(ErrorMessages.INVALID_PASSWORD);
            }

            networkCall(ApiMethods.POST, ApiEndpoints.AUTH, { email, password })
                .then((resp: ApiResponse) => {
                    if (resp && isErrorResponse(resp)) {
                        const error = (resp as ErrorResponse).error;
                        switch (error) {
                            case StatusCodes.UNAUTHORIZED:
                                log.error(ErrorMessages.INVALID_USER_CREDENTIALS);
                                reject(ErrorMessages.INVALID_USER_CREDENTIALS);
                                break;
                            case StatusCodes.SERVICE_UNAVAILABLE:
                                log.error(ErrorMessages.SERVICE_UNAVAILABLE);
                                setTimeout(startApplication, TIMEOUT);
                                break;
                            default:
                                log.error(`${ErrorMessages.UNKNOWN_ERROR}${error}`);
                                reject(ErrorMessages.UNKNOWN_ERROR);
                        }
                    } else if (resp && isAuthResponse(resp)) {
                        setAuthToken((resp as AuthResponse).token);
                        resolve(true);
                    }
                })
                .catch((err) => {
                    const error = err instanceof Error ? err.message : (err as string);
                    log.error(error);
                    reject(error);
                });
        } catch (err: unknown) {
            log.error((err as Error).message);
            reject((err as Error).message);
        }
    });

export default authenticate;
