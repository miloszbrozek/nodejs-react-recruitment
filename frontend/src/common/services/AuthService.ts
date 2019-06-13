import * as React from 'react';
import { observable, action } from "mobx"
import { ServiceUtils, serviceUtils } from './ServiceUtils';
import { AuthData } from '../models/auth.models';
import register from '~/registerServiceWorker';
import { CreateUpdateUserData } from '../models/user.models';
import {Promise} from 'es6-promise';

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
            .then(response => <AuthData>response.json())
            .then(data => {
                this.authenticatedUser = data;
                this.saveInStorage();
            });
            // .catch(this.serviceUtils.handleError);
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
            // .catch(this.serviceUtils.handleError)
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
