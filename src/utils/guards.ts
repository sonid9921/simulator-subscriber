import { ApiResponse } from '@configs/types';

/**
 * Guard function to check whether the passed variable is of type string or not
 * @param variable The variable to be checked
 * @return {boolean} Whether the variable is of type string or not
 */
export const isString = (variable: string | undefined): boolean => {
    return typeof variable === 'string';
};

/**
 * Guard function to check whether the passed variable is of type AuthResponse or not
 * @param variable The variable to be checked
 * @return {boolean} Whether the variable is of type AuthResponse or not
 */
export const isAuthResponse = (variable: ApiResponse): boolean => {
    return 'token' in variable;
};

/**
 * Guard function to check whether the passed variable is of type ResultsResponse or not
 * @param variable The variable to be checked
 * @return {boolean} Whether the variable is of type ResultsResponse or not
 */
export const isResultsResponse = (variable: ApiResponse): boolean => {
    return 'event' in variable;
};

/**
 * Guard function to check whether the passed variable is of type ErrorResponse or not
 * @param variable The variable to be checked
 * @return {boolean} Whether the variable is of type ErrorResponse or not
 */
export const isErrorResponse = (variable: ApiResponse): boolean => {
    return 'error' in variable;
};
