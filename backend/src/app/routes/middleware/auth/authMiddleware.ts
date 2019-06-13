import { RequestHandler, Request } from "express";
import { container } from "app/services/injection-config";
import { consts, EnvType } from "consts";
import { GetUserData } from "app/shared/models/user.models";
import { AppError } from "../error/AppError";
import * as HttpStatus from 'http-status-codes'

const userService = container.UserService;
const logger = container.Logger;

const getToken = (req: Request) => {
    const authHeader = req.headers ? req.headers.authorization : null;
    return authHeader ? authHeader.split(" ").splice(1).join("") : null;
}
const notAuthorizedMessage = 'User is not authorized';

declare global {
  namespace Express {
    interface Request {
      userData: GetUserData;
    }
  }
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const token = getToken(req);
    try {
        if(token) {
            req.userData = await userService.getUserInToken(token);
        } else {
            logger.error('Attempt to execute api when not authorized');
            res.status(HttpStatus.UNAUTHORIZED).send(notAuthorizedMessage);
        }
    } catch(err) {
        logger.error(err);
        res.status(HttpStatus.UNAUTHORIZED).send(notAuthorizedMessage);
    }
    next();
}