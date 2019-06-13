import * as Bottle from 'bottlejs';
import { createDbInitializer } from 'app/db/dbInitializer';
import { DbInitializer } from 'utils/data-initializing/DbInitializer';
import { createLogger, ExtLogger } from './logger';
import { UserService } from './UserService';
import { UserDao } from 'app/db/dao/UserDao';
import { AuthService } from './AuthService';
import { TripDao } from 'app/db/dao/TripDao';
import { TripService } from './TripService';

const bottle = new Bottle();
bottle.factory("DbInitializer", () => {
    return createDbInitializer()
});
bottle.factory("Logger", () => createLogger());
bottle.factory("UserDao", () => new UserDao());
bottle.factory('AuthService', (container) => new AuthService(container.UserDao));
bottle.factory("UserService", (container) => new UserService(container.UserDao, container.AuthService));
bottle.factory("TripDao", () => new TripDao());
bottle.factory("TripService", (container) => new TripService(container.TripDao));


export const container = bottle.container;

declare module "bottlejs" { 
    interface IContainer {
        DbInitializer: DbInitializer;
        AuthService: AuthService;
        UserService: UserService;
        UserDao: UserDao;
        TripDao: TripDao;
        TripService: TripService;
        Logger: ExtLogger;
    }
}
