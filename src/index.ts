import connectDatabase from '@configs/connectDatabase';
import { ErrorMessages, InfoMessages } from '@configs/types';
import logger from '@logger/index';
import Event from '@models/Event';
import { config } from 'dotenv';
import subscribe from 'services/subscribe';

const log = logger('IndexFile');

// Configuring environment variables to be used throughout the project
config();

/**
 * The function to start the application.
 * It calls the subscribe function to subscribe the results api after authentication
 * @returns {void} Returns void
 */
const startApplication = () => {
    subscribe(startApplication)
        .then((resp) => {
            if (resp) {
                const event = new Event(resp);
                event
                    .save()
                    .then(() => {
                        log.info(InfoMessages.EVENT_SAVED);
                        startApplication();
                    })
                    .catch((err) => {
                        log.error(err);
                    });
            }
        })
        .catch((err: string) => {
            log.error(`${ErrorMessages.SUBSCRIBE_ERROR_SHUTDOWN}${err}`);
        });
};

connectDatabase()
    .then(() => {
        log.info(InfoMessages.DATABASE_CONNECTED);
        startApplication();
    })
    .catch((err) => {
        const error = err instanceof Error ? err.message : (err as string);
        log.info(`${ErrorMessages.MONGO_CONNECT_ERROR}${error}`);
    });
