import { GetUserData, CreateUpdateUserData } from 'app/shared/models/user.models';
import { AppError } from 'app/routes/middleware/error/AppError';
import { UserDao } from 'app/db/dao/UserDao';
import { UserAttributes, UserType } from 'app/db/models/User';
import { sequelize } from 'app/db/sequelize';
import * as HttpStatus from 'http-status-codes';
import { AuthService } from './AuthService';


export class UserService {

    constructor(private userDao: UserDao,
        private authService: AuthService){}

    private insufficientPrivilegesMessage = 'Insufficient privilages';
    private doesntExistMessage = `User doesn't exist`;
    private notFoundMessage = 'User not found';

    async getUserInToken(token: string) {
        return sequelize.transaction(async () => {
            const userId = await this.authService.getUserIdInToken(token);
            const user = userId ? await this.userDao.findUserById(userId) : null;
            if(user) {
                return this.attributeObjectToGetUserData(user);
            } else {
                throw new AppError(this.notFoundMessage, {errCode: HttpStatus.UNAUTHORIZED});
            }
        });
    }

    async findUsers(currentUser: GetUserData): Promise<GetUserData[]> {
        return sequelize.transaction(async () => {
            if(this.canAccessOtherUsers(currentUser.type)) {
                return this.userDao.findAllUsers()
                    .then(userAttrs => userAttrs.map(this.attributeObjectToGetUserData))
            } else {
                return this.userDao.findUserById(currentUser.id)
                    .then(userFound => [this.attributeObjectToGetUserData(userFound)]);
            }
        });
    }

    async getUserById(currentUser: GetUserData, userId: number): Promise<GetUserData> {
        return sequelize.transaction(async () => {
            this.checkPrivileges(currentUser, userId);
            return this.userDao.findUserById(userId)
                .then(userFound => this.attributeObjectToGetUserData(userFound))
                .then(userData => {
                    if(userData) {
                        return userData;
                    } else {
                        throw new AppError(this.notFoundMessage, {errCode: HttpStatus.NOT_FOUND});
                    }
                });
        });
    }

    async createUser(currentUser: GetUserData, user: CreateUpdateUserData) {
        return sequelize.transaction(async () => {
            const canAccessOtherUsers = currentUser && this.canAccessOtherUsers(currentUser.type);
            if (!canAccessOtherUsers && user.type !== UserType.Regular) {
                throw new AppError(this.insufficientPrivilegesMessage, {errCode: HttpStatus.FORBIDDEN});
            }
            const passwordHash = await this.authService.hashPassword(user.password);
            const anotherUser = await this.userDao.findUserByLogin(user.login);
            if(anotherUser) {
                throw new AppError(`User with login '${user.login}' already exists`, {errCode: HttpStatus.CONFLICT});
            }
            return this.userDao.createUser({
                ...user,
                password: passwordHash
            }).then(this.attributeObjectToGetUserData)
        });
    }

    async updateUser(currentUser: GetUserData, user: CreateUpdateUserData) {
        return sequelize.transaction(async () => {
            this.checkPrivileges(currentUser, user.id);
    
            if(user.password) {
                user.password = await this.authService.hashPassword(user.password);
            }
            return this.userDao.updateUser(user, !user.password)
                .then(this.checkRowWasModified);
        });        
    }

    async deleteUser(currentUser: GetUserData, deletedUserId: number) {
        return sequelize.transaction(async () => {
            this.checkPrivileges(currentUser, deletedUserId);
            return this.userDao.deleteUser(deletedUserId)
                .then(this.checkRowWasModified);
        });        
    }

    private checkRowWasModified = (userWasFound: boolean) => {
        if(userWasFound) {
            return Promise.resolve();
        } else {
            throw new AppError(this.doesntExistMessage, {errCode: HttpStatus.NOT_FOUND});
        }
    }

    private checkPrivileges(currentUser: GetUserData, editedUserId: number) {
        if(!this.canAccessOtherUsers(currentUser.type) && currentUser.id !== editedUserId) {
            throw new AppError(this.insufficientPrivilegesMessage, {errCode: HttpStatus.FORBIDDEN});   
        }
    }

    private canAccessOtherUsers(userType: UserType) {
        return userType === UserType.Admin || userType === UserType.Manager;
    }

    private attributeObjectToGetUserData = (userAttributes: UserAttributes): GetUserData => {
        if(!userAttributes) {
            return null;
        }
        const { id, firstName, lastName, login, type} = userAttributes;
        return {
            id, firstName, lastName, login, type
        };
    }  
}