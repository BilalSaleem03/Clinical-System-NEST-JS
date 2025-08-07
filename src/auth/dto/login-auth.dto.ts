import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Role } from "src/profile/enums/role.enum"

export class LoginAuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @IsString()
    password:string

    @IsNotEmpty()
    @IsEnum(Role)
    role:Role
}
