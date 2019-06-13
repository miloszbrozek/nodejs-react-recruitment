import { consts } from 'consts';
import { GetUserData } from 'app/shared/models/user.models';
import { AppError } from 'app/routes/middleware/error/AppError';
import { UserType } from 'app/db/models/User';
import { sequelize } from 'app/db/sequelize';
import * as HttpStatus from 'http-status-codes'
import { TripDao } from 'app/db/dao/TripDao';
import { TripAttributes } from 'app/db/models/Trip';
import { TripData } from 'app/shared/models/trip.models';
import moment = require('moment');


export class TripService {

    constructor(private tripDao: TripDao){}

    private insufficientPrivilegesMessage = 'Insufficient privilages';
    private doesntExistMessage = `Trip doesn't exist`;

    async createTrip(currentUser: GetUserData, trip: TripData) {
        this.validateStartEndDate(trip);
        return sequelize.transaction(async () => {
            this.checkPrivileges(currentUser, trip.userId);
            return this.tripDao.addTrip(this.updateTripDataToAttributesObject(trip))
                .then(this.attributeObjectToGetTripData);         
        });
    }

    async getUserTrips(currentUser: GetUserData, userId: number) {
        return sequelize.transaction(async () => {
            this.checkPrivileges(currentUser, userId);
            return this
                .tripDao.getUserTrips(userId)
                .then(trips => trips.map(this.attributeObjectToGetTripData));
        });
    }

    async getTripById(currentUser: GetUserData, tripId: number) {
        return sequelize.transaction(async () => {
            const trip = await this
                .tripDao.findById(tripId)
                .then(trip => this.attributeObjectToGetTripData(trip));

            if(trip) {
                this.checkPrivileges(currentUser, trip.userId);
            }

            return trip;
        });
    }
    
    async deleteTrip(currentUser: GetUserData, tripId: number) {
        return sequelize.transaction(async () => {
            const trip = await this.tripDao.findById(tripId);
            if(!trip){
                throw new AppError(this.doesntExistMessage, {errCode: HttpStatus.NOT_FOUND});
            }
            this.checkPrivileges(currentUser, trip.userId);
            return this.tripDao.deleteTrip(tripId)
                .then(this.checkRowWasModified);
        });
    }

    async updateTrip(currentUser: GetUserData, trip: TripData) {
        this.validateStartEndDate(trip);
        return sequelize.transaction(async () => {
            const currentTrip = await this.tripDao.findById(trip.id);
            if(currentTrip) {
                this.checkPrivileges(currentUser, currentTrip.userId);
                trip.userId = currentTrip.userId;
            } else {
                throw new AppError(this.doesntExistMessage, {errCode: HttpStatus.NOT_FOUND});
            }
            return this.tripDao.updateTrip(this.updateTripDataToAttributesObject(trip));
        });
    }

    private checkPrivileges(currentUser: GetUserData, editedUserId: number) {
        if(!this.canAccessOtherUsers(currentUser.type) && currentUser.id !== editedUserId) {
            throw new AppError(this.insufficientPrivilegesMessage, {errCode: HttpStatus.FORBIDDEN});   
        }
    }

    private checkRowWasModified = (userWasFound: boolean) => {
        if(userWasFound) {
            return Promise.resolve();
        } else {
            throw new AppError(this.doesntExistMessage, {errCode: HttpStatus.NOT_FOUND});
        }
    }

    private canAccessOtherUsers(userType: UserType) {
        return userType === UserType.Admin;
    }

    private updateTripDataToAttributesObject = (data: TripData): TripAttributes => {
        if(!data) {
            return null;
        }
        return {
            ...data,
            startDate: moment(data.startDate, consts.formats.date).toDate(),
            endDate: moment(data.endDate, consts.formats.date).toDate()
        };
    }

    private attributeObjectToGetTripData = (attr: TripAttributes): TripData => {
        if(!attr) {
            return null;
        }
        const {id, startDate, endDate, comment, destination, userId} = attr;
        return {
            id, 
            startDate: moment(startDate).format(consts.formats.date), 
            endDate: moment(endDate).format(consts.formats.date), 
            comment, 
            destination,
            userId
        };
    }

    private parseDate(date: string) {
        const dateMoment = date ? moment(date, consts.formats.date, true) : null;
        return dateMoment && dateMoment.isValid() ? dateMoment : null;
    }

    private validateStartEndDate(trip: TripData) {
        const startDateMoment = this.parseDate(trip.startDate);
        const endDateMoment = this.parseDate(trip.endDate);
        if(!startDateMoment) {
            throw new AppError('Incorrect start date', {errCode: HttpStatus.BAD_REQUEST});
        }
        if(!endDateMoment) {
            throw new AppError('Incorrect end date', {errCode: HttpStatus.BAD_REQUEST});
        }
        if(!startDateMoment.isBefore(endDateMoment)) {
            throw new AppError('Start date should be before end date', {errCode: HttpStatus.BAD_REQUEST});
        }
        if(startDateMoment.isBefore(moment().startOf('day'))) {
            throw new AppError(`Start date shouldn't be from past`, {errCode: HttpStatus.BAD_REQUEST});
        }
    }
}