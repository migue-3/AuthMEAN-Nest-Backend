import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {

    //Definimos la informacion que yo necesito para crear un usuario en BD --Analizemos nuestra entity
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}
