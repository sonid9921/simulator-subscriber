import path from 'node:path';
import { createLogger, format, transports } from 'winston';

// Log file name that is unique for every run of the application
const logFileName: string = Date.now().toString();

/**
 * Custom format function for logging to the standard console output
 */
const consoleFormat = format.printf((info: { level: string; message: string }) => {
    return `${info.level}: ${info.message}`;
});

/**
 * A logger function with custom format and transports.
 * The transports supported are `Console` and `File`.
 * @param {string} label The module name that will be prefixed to the logs
 * @returns {winston.Logger} Logger function with methods like `.log()`, `.debug()`, etc.
 */
const logger = (label: string) => {
    if (!label) {
        label = 'Unlabelled';
    }

    return createLogger({
        transports: [
            new transports.Console({
                format: consoleFormat,
            }),
            new transports.File({
                dirname: path.join(process.cwd(), './logs'),
                filename: `${logFileName}.log`,
                format: format.combine(format.timestamp(), format.label({ label }), format.json()),
            }),
        ],
        exitOnError: false,
        handleExceptions: true,
        handleRejections: true,
    });
};

export default logger;
