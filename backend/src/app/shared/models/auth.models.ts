import { UserType } from "app/db/models/User";

export interface AuthData {
    userId: number,
    type: UserType,
    token: string
}