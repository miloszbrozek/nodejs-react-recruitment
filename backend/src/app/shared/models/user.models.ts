import { UserType } from "app/db/models/User";
export interface GetUserData {
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    type: UserType;
}

export interface CreateUpdateUserData extends GetUserData {
    password: string;
}

