import { User } from "../entities/user.entity";

//esto nos va a indicar como van a lucir nuestrar respuestas
export interface LoginResponse {
    user: User;
    token: string;
}