import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Role } from "src/profile/enums/role.enum"



export class VerifyEmailDto{
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
    @IsNotEmpty()
    @IsEnum(Role)
    role:Role
}