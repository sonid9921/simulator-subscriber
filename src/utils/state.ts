import { State } from '@configs/types';

let state: State = {
    authToken: '',
};

/**
 * Function to set the auth token into the state
 * @param token The token to be set
 * @returns {void} Returns void
 */
export const setAuthToken = (token: string): void => {
    state = { ...state, authToken: token };
};

/**
 * Function to get the auth token from the state
 * @returns {string} The token
 */
export const getAuthToken = (): string => {
    return state.authToken;
};

/**
 * Function to check whether the auth token is present or not
 * @returns {boolean} Whether the auth token is present or not
 */
export const isAuthenticated = (): boolean => {
    return state.authToken !== '';
};

/**
 * Function to clear the state
 * @returns {void} Returns void
 */
export const clearState = (): void => {
    state = { ...state, authToken: '' };
};
