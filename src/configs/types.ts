import { IncomingMessage } from 'http';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

/**
 * The endpoints to be used for calling the API
 */
export enum ApiEndpoints {
    AUTH = '/auth',
    RESULTS = '/results',
}

/**
 * The methods to be used while calling the API
 */
export enum ApiMethods {
    GET = 'GET',
    POST = 'POST',
}

/**
 * Events to be listened to on the response object
 */
export enum ResponseEvents {
    DATA = 'data',
    END = 'end',
}

/**
 * Events to be listened to on the request object
 */
export enum RequestEvents {
    ERROR = 'error',
    CLOSE = 'close'
}

/**
 * Content Types for header
 */
export enum ContentTypes {
    TEXT = 'text/plain',
    JSON = 'application/json'
}

/**
 * Headers to be attached with the request
 */
export enum RequestHeaders {
    CONTENT_TYPE = 'Content-Type',
    AUTHORIZATION = 'Authorization'
}

/**
 * The Error messages used throughout the application
 */
export enum ErrorMessages {
    INVALID_MONGO_URI = 'Invalid MongoDB URI!',
    INVALID_MONGO_DBNAME = 'Invalid MongoDB Database Name!',
    SCHEMA_EVENT_NAME_REQUIRED = 'Mongo Error: Event name is a required field',
    SCHEMA_HORSE_ID_REQUIRED = 'Mongo Error: Horse id is a required field',
    SCHEMA_HORSE_NAME_REQUIRED = 'Mongo Error: Horse name is a required field',
    SCHEMA_TIME_REQUIRED = 'Mongo Error: Time is a required field',
    INVALID_BEARER_TOKEN = 'Invalid Authentication Bearer token!',
    INVALID_BASE_URL = 'Invalid Base Url!',
    INVALID_API_ENDPOINT = 'Invalid API Endpoint!',
    REQUEST_CREATION_ERROR = 'Error while creating a request. ',
    REQUEST_TRANSFER_ERROR = 'Error while making the request. ',
    INVALID_EMAIL = 'Invalid email id!',
    INVALID_PASSWORD = 'Invalid password',
    INVALID_USER_CREDENTIALS = 'Invalid email or password',
    SERVICE_UNAVAILABLE = 'The simulator is busy. Trying again after cool-down period.',
    UNKNOWN_ERROR = 'Unknown error with response code: ',
    REQUEST_TIMED_OUT = 'Request timed out. Trying again after cool-down period',
    SUBSCRIBING_ERROR = 'Error while subscribing to the results API',
    MONGO_CONNECT_ERROR = 'Shutting down application due to error while connecting to MongoDb instance.\nError => ',
    SUBSCRIBE_ERROR_SHUTDOWN = 'Shutting down due to error => ',
    SESSION_TIMED_OUT = 'Session Timed out. Authenticating again after cool-down period',
    REQUEST_CLOSED_PREMATURELY = 'Request interrupted. This can be either because the request was completed or the underlying connection was terminated'
}

/**
 * The Info messages used throughout the application
 */
export enum InfoMessages {
    REQUEST_NO_DATA = 'No data is passed while calling a POST api. If this is intentional please ignore. Otherwise please check the passed value.',
    AUTH_TOKEN_AVAILABLE = 'Auth token already available.',
    SUBSCRIBING_TO_API = 'Subscribing to the results API',
    EVENT_SAVED = 'Event saved successfully',
    GENERATE_AUTH_TOKEN = 'Authenticating user',
    GENERATE_AUTH_TOKEN_DELAYED = 'Authenticating again after cool-down period',
    DATABASE_CONNECTED = 'MongoDb connected successfully',
}

/**
 * Interface for local store/state
 */
export interface State {
    authToken: string;
}

/**
 * Response interface for the Auth API
 */
export interface AuthResponse {
    token: string;
}

/**
 * Response interface for the Results API
 */
export interface ResultsResponse {
    event: string;
    horse: {
        id: number;
        name: string;
    };
    time: number;
}

/**
 * Interface when the response gives an error
 */
export interface ErrorResponse {
    error: StatusCodes;
}

/**
 * Union of the response interfaces
 */
export type ApiResponse = AuthResponse | ResultsResponse | ErrorResponse;

/**
 * Type for the callback function for a request
 */
export type RequestCallbackFunction = (resp: IncomingMessage) => void;

/**
 * Return type of the function that initiates connection to MongoDB
 */
export type MongoosePromise = Promise<typeof mongoose>;
