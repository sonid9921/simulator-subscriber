import { ErrorMessages, MongoosePromise } from '@configs/types';
import logger from '@logger/index';
import { isString } from '@utils/guards';
import mongoose from 'mongoose';
import { SERVER_CONNECTION_TIMEOUT } from './constants';

const log = logger('DatabaseConfig');

/**
 * Function to initiate the connection to the MongoDB database
 * @returns {MongoosePromise} A promise that resolve when the connection is established
 */
const connectDatabase = (): MongoosePromise =>
    new Promise((resolve, reject) => {
        const mongoDbUri = process.env['MONGO_URI'];
        const mongoDbName = process.env['MONGO_DB'];

        if (!mongoDbUri || !isString(mongoDbUri)) {
            log.error(ErrorMessages.INVALID_MONGO_URI);
            return reject(ErrorMessages.INVALID_MONGO_URI);
        }

        if (!mongoDbName || !isString(mongoDbName)) {
            log.error(ErrorMessages.INVALID_MONGO_DBNAME);
            return reject(ErrorMessages.INVALID_MONGO_DBNAME);
        }

        return resolve(
            mongoose.connect(mongoDbUri, {
                dbName: mongoDbName,
                autoCreate: true,
                serverSelectionTimeoutMS: SERVER_CONNECTION_TIMEOUT,
            }),
        );
    });

export default connectDatabase;
