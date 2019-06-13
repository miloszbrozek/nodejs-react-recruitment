import { ErrorMappingConfig, ErrorData } from "../models/error.models";
import HttpStatus from 'http-status-codes';

export class ServiceUtils {

    private defaultErrorMappings: ErrorMappingConfig = {
        genericMessage: 'Error occured',
        [HttpStatus.UNAUTHORIZED]: 'User is not logged in',
        [HttpStatus.FORBIDDEN]: 'User is not allowed to do this action',
        [HttpStatus.NOT_FOUND]: 'Item not found'
    }

    public checkError = (response) => {
        if (!response.ok) {
            throw response;
        }
        return response;
    }

    public handleErrors = (err, errorMappings?: ErrorMappingConfig) => {
        const mappings = {...this.defaultErrorMappings, ...(errorMappings || {})};
        if(err) {
            if(err.message) {
                console.error(err.message);
            } else {
                console.error(err);
            }

            throw this.createError(err.status, mappings);
        }
    }

    private createError(errStatus: number, errorMappings: ErrorMappingConfig): ErrorData {
        const errConfig = errStatus ? errorMappings[errStatus] : null;
        if(errConfig) {
            return {
                message: errConfig,
                status: errStatus
            };
        } else {
            return {
                message: errorMappings.genericMessage,
                status: null
            };
        }
    }

    public getJsonHeaders = () => {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
}

export const serviceUtils = new ServiceUtils();