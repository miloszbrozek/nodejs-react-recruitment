import * as React from 'react';
import { observable, runInAction, action } from "mobx"
import { consts } from '~/common/consts';
import moment from 'moment';
import { ServiceUtils, serviceUtils } from '~/common/services/ServiceUtils';
import { AuthService, authService } from '~/common/services/AuthService';
import { TripData, TripDataSerialized } from '../models/trip.models';
import { UserType } from '~/common/models/user.models';
import queryString from 'query-string';

export class TripService {
    private tripApi = '/api/trip'
    @observable trips: TripData[] = [];
    @observable editedTrip: TripData = null;

    constructor(private serviceUtils: ServiceUtils,
        private authService: AuthService) {}

    @action
    fetchTrips(userId: number) {
        this.trips = [];
        return fetch(`${this.tripApi}?userId=${userId}`, {
            method: 'GET',
            headers: this.authService.getJsonAuthHeaders()
        })
            .then(this.serviceUtils.checkError)
            .then(response => response.json())
            .then((trips: TripDataSerialized[]) => trips.map(this.convertToTripData))
            .then(trips => {
                this.trips = trips;
                return this.trips;
            })
            // .catch(this.serviceUtils.handleError)
    }

    @action
    fetchEditedTrip(tripId: number) {
        this.editedTrip = null;
        return fetch(`${this.tripApi}/${tripId}`, {
            method: 'GET',
            headers: this.authService.getJsonAuthHeaders()
        })
            .then(this.serviceUtils.checkError)
            .then(response => <TripDataSerialized>response.json())
            .then(trip => {
                this.editedTrip = this.convertToTripData(trip);
                return this.editedTrip;
            });
            // .catch(this.serviceUtils.handleError)
    }

    @action
    deleteTrip(tripId: number) {
        return fetch(`${this.tripApi}/${tripId}`, {
            method: 'DELETE',
            headers: this.authService.getJsonAuthHeaders()
        })
            .then(this.serviceUtils.checkError);
    }

    @action
    updateTrip(tripId: number, tripData: TripData) {
        return fetch(`${this.tripApi}/${tripId}`, {
            method: 'PUT',
            headers: this.authService.getJsonAuthHeaders(),
            body: JSON.stringify(this.convertToTripDataSerialized(tripData))
        })
            .then(this.serviceUtils.checkError);
    }

    @action
    createTrip(tripData: TripData) {
        return fetch(`${this.tripApi}`, {
            method: 'POST',
            headers: this.authService.getJsonAuthHeaders(),
            body: JSON.stringify(this.convertToTripDataSerialized(tripData))
        })
            .then(this.serviceUtils.checkError);
    }

    private convertToTripData = (trip: TripDataSerialized): TripData => {
        return {
            destination: trip.destination,
            startDate: moment(trip.startDate, consts.dateFormat).toDate(),
            endDate: moment(trip.endDate, consts.dateFormat).toDate(),
            comment: trip.comment,
            userId: trip.userId,
            id: trip.id
        };
    }

    private convertToTripDataSerialized = (tripData: TripData): TripDataSerialized => {
        return {
            destination: tripData.destination,
            startDate: moment(tripData.startDate).format(consts.dateFormat),
            endDate: moment(tripData.endDate).format(consts.dateFormat),
            comment: tripData.comment,
            userId: tripData.userId,
            id: tripData.id
        };
    }

    getUserIdFromQueryString = (qString: string): number => {
        if(!qString){
            return null;
        }
        const values = queryString.parse(qString);
        const userId = values ? values.userId : null;
        return userId ? parseInt(userId) : null;
    }
}

export const TripServiceCtx = React.createContext(new TripService(serviceUtils, authService));
