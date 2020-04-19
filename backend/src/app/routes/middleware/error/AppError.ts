export class AppError extends Error {

    isAppError = true;
    errCode: number

    constructor(message?: string, public data?: any) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.errCode = data.errCode;
    }
}