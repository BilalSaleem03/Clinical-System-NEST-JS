import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Role } from "src/profile/enums/role.enum"


export class ResetPasswordDto{
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsNotEmpty()
    @IsEnum(Role)
    role:Role
    
    @IsNotEmpty()
    @IsString()
    newPassword:string
    
    @IsNotEmpty()
    @IsString()
    hash:string
}