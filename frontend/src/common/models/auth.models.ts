import { UserType } from "./user.models";

export interface AuthData {
    userId: number,
    type: UserType,
    token: string
}