/**
 * This file contains mock data for running the test cases
 */
import { ErrorMessages } from '@configs/types';

export const mockEnvironmentVariables = [
    {
        id: 1,
        MONGO_URI: '',
        MONGO_DB: 'simulator-subscriber',
        ERROR: ErrorMessages.INVALID_MONGO_URI,
    },
    {
        id: 2,
        MONGO_URI: 'mongodb://localhost:27018',
        MONGO_DB: '',
        ERROR: ErrorMessages.INVALID_MONGO_DBNAME,
    },
];

export const mockTruthyEvents = [
    {
        event: 'start',
        horse: {
            id: 1,
            name: 'Cherry',
        },
        time: 12,
    },
    {
        event: 'finish',
        horse: {
            id: 1,
            name: 'Cherry',
        },
        time: 11525,
    },
];

export const mockFalsyEvents = [
    {
        event: 'start',
        horse: {
            id: 1,
        },
        time: 12,
    },
    {
        horse: {
            id: 1,
            name: 'Cherry',
        },
        time: 12,
    },
    {
        event: 'finish',
        horse: {
            id: 1,
            name: 'Cherry',
        },
    },
    {
        event: 'finish',
        horse: {
            name: 'Cherry',
        },
        time: 12454,
    },
];
