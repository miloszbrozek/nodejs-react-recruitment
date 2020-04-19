import { ErrorRequestHandler } from "express";
import { container } from "app/services/injection-config";
import { consts, EnvType } from "consts";
import * as HttpStatus from 'http-status-codes'

const logger = container.Logger;
export const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    logger.logErrorObject(err);
    const error = {
        ...err,
        message: err.message,
        name: err.name,
        stack: consts.env === EnvType.Prod ? err.stack : ''
    };
    const errCode = (err as any).errCode || HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(errCode).json(error);
}