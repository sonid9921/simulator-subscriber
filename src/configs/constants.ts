/**
 * The cool-down/timeout period between two API calls for the listed scenarios
 * 1. When the session times out
 * 2. When the server is busy authenticating the users
 * 3. When the request to the results API times out
 */
export const TIMEOUT = 3000;

/**
 * Timeout in milliseconds for connecting to the MongoDB server
 */
export const SERVER_CONNECTION_TIMEOUT = 5000;
