const path = require('path');

export enum EnvType {
    Dev = 'dev',
    Prod = 'production'
}

const env = <EnvType>process.env.NODE_ENV || EnvType.Prod;

export const consts = {
    env: env,
    dbConnectionUrl: <string>process.env.DATABASE_URL,
    port: <number>(process.env.PORT || 5000),
    logLevel: <string>process.env.LOG_LEVEL || env === EnvType.Dev ? 'http' : 'info',
    formats: {
        timeNumeric: 'HHmmss',
        time: 'HH:mm:ss',
        date: 'YYYY-MM-DD',
        dateTime: 'YYYY-MM-DD HH:mm:ss'
    },
    frontendLocation: <string>process.env.FRONTEND_LOCATION || path.join(__dirname, '../../../frontend/dist'),
    jwtTokenKey: process.env.JWT_TOKEN || 'gfgfdgsfd',
    jwtTokenExpiration: process.env.JWT_TOKEN_EXPIRATION || null
}
