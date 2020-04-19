export enum EnvType {
    Dev = 'dev',
    Prod = 'production'
}

const env = <EnvType>process.env.NODE_ENV;

export const consts = {
    env: env,
    port: <number>(process.env.PORT || 5000),
    logLevel: <string>process.env.LOG_LEVEL || env === EnvType.Dev ? 'http' : 'info',
    formats: {
        timeNumeric: 'HHmmss',
        time: 'HH:mm:ss',
        date: 'YYYY-MM-DD',
        dateTime: 'YYYY-MM-DD HH:mm:ss'
    },
    jwtTokenKey: process.env.JWT_TOKEN || 'gfgfdgsfd',
    jwtTokenExpiration: process.env.JWT_TOKEN_EXPIRATION || null
}
