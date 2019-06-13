import {Model, Sequelize, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyRemoveAssociationMixin, BuildOptions} from 'sequelize';
import { sequelize, dbConf } from "../sequelize";
import {  TripAttributes, TripModel, Trip } from './Trip';

export interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    login: string;
    password: string;
    type: UserType;
    trips?: TripAttributes[] | TripAttributes['id'][];
}

export enum UserType {
  Regular = 'regular',
  Manager = 'manager',
  Admin = 'admin'
}

export interface UserModel extends Model, UserAttributes {
    getTrips: HasManyGetAssociationsMixin<TripModel>;
};

type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModel;
}

export const User = <UserModelStatic>sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    login: {
        type: DataTypes.STRING,
        unique: true
    },
    type: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
},{
    schema: dbConf.schemaName
});


export const initUserRelations = () => {
    User.hasMany(Trip, {
        foreignKey: 'userId',
        sourceKey: 'id',
        // as: 'trips'
    })
}