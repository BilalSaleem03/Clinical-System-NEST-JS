import { IsEnum, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateProfileDto {
    @IsNotEmpty()
    @IsEnum(Role)
    role:Role

    @IsNotEmpty()
    @IsString()
    fullName:string

    @IsNotEmpty()
    @IsPositive()
    phoneNumber:number

}
