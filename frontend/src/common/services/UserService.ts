import * as React from 'react';
import { observable, action } from "mobx"
import { GetUserData, CreateUpdateUserData, UserType } from '../models/user.models';
import { ServiceUtils, serviceUtils } from './ServiceUtils';
import { AuthService, authService } from './AuthService';
import HttpStatus from 'http-status-codes';

export class UserService {
    private userApi = '/api/user'
    @observable users: GetUserData[] = null;
    @observable editedUser: GetUserData = null;

    constructor(private serviceUtils: ServiceUtils,
        private authService: AuthService) {}

    @action
    fetchUsers() {
        this.users = null;
        
        return fetch(this.userApi, {
            method: 'GET',
            headers: this.authService.getJsonAuthHeaders()
        })
            .then(this.serviceUtils.checkError)
            .then(response => <GetUserData[]>response.json())
            .then(users => {
                this.users = users;
                return this.users;
            });
            // .catch(this.serviceUtils.handleError)
    }

    @action
    fetchEditedUser(userId: number) {
        this.editedUser = null;
        return fetch(`${this.userApi}/${userId}`, {
            method: 'GET',
            headers: this.authService.getJsonAuthHeaders()
        })
            .then(this.serviceUtils.checkError)
            .then(response => <GetUserData>response.json())
            .then(user => {
                this.editedUser = user;
                return this.editedUser;
            });
            // .catch(this.serviceUtils.handleError)
    }

    @action
    updateUser(userId: number, userData: CreateUpdateUserData) {
        return fetch(`${this.userApi}/${userId}`, {
            method: 'PUT',
            headers: this.authService.getJsonAuthHeaders(),
            body: JSON.stringify(userData)
        })
            .then(this.serviceUtils.checkError)
            .catch((err) => this.serviceUtils.handleErrors(err, {
                [HttpStatus.CONFLICT]: 'User with this login already exists'
            }))
    }

    @action
    deleteUser(userId: number) {
        return fetch(`${this.userApi}/${userId}`, {
            method: 'DELETE',
            headers: this.authService.getJsonAuthHeaders()
        })
            .then(this.serviceUtils.checkError);
    }

    @action
    createUser(userData: CreateUpdateUserData) {
        return fetch(`${this.userApi}`, {
            method: 'POST',
            headers: this.authService.getJsonAuthHeaders(),
            body: JSON.stringify(userData)
        })
            .then(this.serviceUtils.checkError)
            .catch((err) => this.serviceUtils.handleErrors(err, {
                [HttpStatus.CONFLICT]: 'User with this login already exists'
            }))
    }

    canEditOwnUserType() {
        return this.canEditOtherUsers();
    }

    canEditOtherUsers() {
        const userType = this.authService.authenticatedUser ? this.authService.authenticatedUser.type : null;
        return userType === UserType.Admin || userType === UserType.Manager;
    }


    canEditOthersTrips() {
        const userType = this.authService.authenticatedUser ? this.authService.authenticatedUser.type : null;
        return userType === UserType.Admin;
    }
}

export const UserServiceCtx = React.createContext(new UserService(serviceUtils, authService));
