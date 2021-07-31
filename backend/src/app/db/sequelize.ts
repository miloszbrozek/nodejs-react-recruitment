import { Sequelize } from "sequelize";
import { consts, EnvType } from "../../consts";

export const sequelize = new Sequelize(consts.dbConnectionUrl, {
    dialect:  'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: consts.env !== EnvType.Dev,
    }
  });

