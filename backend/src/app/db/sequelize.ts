import { Sequelize } from "sequelize";


export const dbConf = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'tripapp',
    logging: false,
    schemaName: 'backend',
    
}

export const sequelize = new Sequelize(dbConf.database, dbConf.user, dbConf.password, {
  host: dbConf.host,
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: dbConf.logging
});

