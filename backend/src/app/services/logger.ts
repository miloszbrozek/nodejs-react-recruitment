import * as winston from 'winston';
import { consts, EnvType } from 'consts';
import { AppError } from 'app/routes/middleware/error/AppError';

const logColors = {
    error: "red",
    warn: "darkred",
    info: "black",
    http: "green",
    sql: "blue",
    debug: "gray"
}
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    sql: 4,
    debug: 5
};
winston.addColors(logColors);

export interface ExtLogger extends winston.Logger {
    logErrorObject(error: Error);
}

export const createLogger = (): ExtLogger => {
    const logger = winston.createLogger({
        level: consts.logLevel,
        levels: logLevels,
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.json()
        ),
        // defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write to all logs with level `info` and below to `combined.log` 
            // - Write all logs error (and below) to `error.log`.
            //
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' })
        ]
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    // 
    if (consts.env === EnvType.Dev) {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    (<any>logger).logErrorObject = (error: Error) => {
        const appError = error && (<any>error).isAppError ? <AppError>error : null;
        if (appError) {
            const { message, stack, data } = appError;
            const errMessage = `${message}\n${stack}\n${JSON.stringify(data, null, 2)}`;
            logger.error(errMessage);
        } else {
            const { message, stack } = error;
            const errMessage = `${message}\n${stack}`;
            logger.error(errMessage);
        }
    }

    return <ExtLogger>logger;
}
