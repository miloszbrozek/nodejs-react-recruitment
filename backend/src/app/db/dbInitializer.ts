import { DbInitializer, ModelInitializationEntry } from "utils/data-initializing/DbInitializer";
import { sequelize } from "app/db/sequelize";
import { initUsers } from "app/db/init/initUsers";
import { User, initUserRelations } from "app/db/models/User";
import { Trip, initTripRelations } from "./models/Trip";

const config: ModelInitializationEntry[]  = [
    {model: User, initDataFn: initUsers, initRelations: initUserRelations},
    {model: Trip, initRelations: initTripRelations},
]

export const createDbInitializer = () => new DbInitializer(sequelize, config);