import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { consts } from 'consts';
import { AppError } from 'app/routes/middleware/error/AppError';
import { UserDao } from 'app/db/dao/UserDao';
import { sequelize } from 'app/db/sequelize';
import * as HttpStatus from 'http-status-codes'
import { AuthData } from 'app/shared/models/auth.models';
import { UserType } from 'app/db/models/User';


export class AuthService {

    constructor(private userDao: UserDao){}

    private hashingRounds = 10;

    async loginUser(login: string, password: string) {
        return sequelize.transaction(async () => {
            const userModel = await this.userDao.findUserByLogin(login);
            if(userModel) {
                const isMatch = await this.comparePassword(password, userModel.password);
                if(isMatch) {
                    return this.createAuthData(userModel.id, userModel.type);
                }
            }
            throw new AppError('Invalid user or password', {errCode: HttpStatus.UNAUTHORIZED});
        });        
    }

    async getUserIdInToken(token: string) {
        return new Promise<number>((resolve, reject) => {
            jwt.verify(token, consts.jwtTokenKey, async (err, payload: {userId: number}) => {
                if(err) {
                    reject(new AppError(`Can't verify user token`, {...err, errCode: HttpStatus.UNAUTHORIZED}));
                }
                const userId = payload ? payload.userId : null;
                if(userId) {
                    resolve(userId);
                } else {
                    reject(new AppError('Token is invalid', {errCode: HttpStatus.UNAUTHORIZED}));
                }
            });
        });
    }

    hashPassword(password: string) {
        return bcrypt.hash(password, this.hashingRounds);
    }

    private comparePassword(password: string, hash: string) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, isMatch) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(isMatch);
                }     
            });
        });
    }

    private createAuthData(userId: number, userType: UserType): AuthData {
        const options = consts.jwtTokenExpiration ? { expiresIn: consts.jwtTokenExpiration } : null;
        const token = jwt.sign({userId: userId}, consts.jwtTokenKey, options);
        return {
            userId,
            token,
            type: userType
        };
    }
}