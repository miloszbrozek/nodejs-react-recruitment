import * as React from 'react';
import { observable, action } from "mobx"
import { ServiceUtils, serviceUtils } from './ServiceUtils';
import { AuthData } from '../models/auth.models';
import { CreateUpdateUserData } from '../models/user.models';
import {Promise} from 'es6-promise';
import HttpStatus from 'http-status-codes';

export class AuthService {
    private authApi = '/api/auth';
    private storageKey = 'authenticatedUser';
    @observable authenticatedUser: AuthData = null;

    constructor(private serviceUtils: ServiceUtils) {
        this.readFromStorage();
    }

    @action
    login(login: string, password: string) {
        this.authenticatedUser = null;
        this.saveInStorage();
        return fetch(`${this.authApi}/login`, {
            method: 'POST',
            headers: this.serviceUtils.getJsonHeaders(),
            body: JSON.stringify({login, password})
        })
            .then(this.serviceUtils.checkError)
            .then(this.checkResponse)
            .then(response => <AuthData>response.json())
            .then(data => {
                this.authenticatedUser = data;
                this.saveInStorage();
            })
            .catch(err => this.serviceUtils.handleErrors(err, {
                [HttpStatus.UNAUTHORIZED]: 'Unknown user and/or password',
                genericMessage: 'Failed to login'
            }));
    }

    private checkResponse = (response) => {
        return response;
    }

    @action
    logout() {
        this.authenticatedUser = null;
        this.saveInStorage();
        return Promise.resolve();
    }

    @action
    register(userData: CreateUpdateUserData) {
        return fetch(`${this.authApi}/register`, {
            method: 'POST',
            headers: this.serviceUtils.getJsonHeaders(),
            body: JSON.stringify(userData)
        })
            .then(this.serviceUtils.checkError)
            .then(response => response.json())
            .catch((err) => this.serviceUtils.handleErrors(err, {
                [HttpStatus.CONFLICT]: 'User with this login already exists'
            }))
    }

    getJsonAuthHeaders() {
        const token = this.authenticatedUser ? this.authenticatedUser.token : '';
        if(!token) {
            throw new Error('User is not authenticated');
        }
        return {
            ...this.serviceUtils.getJsonHeaders(),
            'Authorization': `Bearer ${token}`
        }
    }

    getCurrentUserId() {
        return this.authenticatedUser ? this.authenticatedUser.userId : null;
    }

    isAuhenticated() {
        return !!this.authenticatedUser;
    }

    @action
    private readFromStorage() {
        const dataStr = localStorage.getItem(this.storageKey);
        this.authenticatedUser = dataStr ? JSON.parse(dataStr) : null;
    }

    @action
    private saveInStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.authenticatedUser));
    }
    
}

export const authService = new AuthService(serviceUtils);
export const AuthServiceCtx = React.createContext(authService);
