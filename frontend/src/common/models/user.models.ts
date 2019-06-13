
export enum UserType {
    Admin = 'admin',
    Manager = 'manager',
    Regular = 'regular'
}

interface UserData {
    login: string;
    firstName: string;
    lastName: string;
    type: UserType;
}

export interface GetUserData extends UserData {
    id: number;
}

export interface CreateUpdateUserData extends UserData {
    password: string;
}

