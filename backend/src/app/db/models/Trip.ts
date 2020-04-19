import {Model, DataTypes, Sequelize, BuildOptions, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyRemoveAssociationMixin} from 'sequelize';
import { sequelize, dbConf } from "../sequelize";
import { User } from './User';


export interface TripAttributes {
    id?: number;
    destination: string;
    startDate: Date;
    endDate: Date;
    comment: string;
    userId?: number;
}


export interface TripModel extends Model, TripAttributes {
};

type TripModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): TripModel;
}
  

export const Trip = <TripModelStatic>sequelize.define('trip', {
    destination: {
        type: DataTypes.STRING
    },
    startDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE,
    },
    comment: {
        type: DataTypes.STRING
    },
    // Set FK relationship (hasMany) with `User`
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    schema: dbConf.schemaName
});

export const initTripRelations = () => {
    Trip.belongsTo(User)
}