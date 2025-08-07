import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { AccessLevel } from "../enum/access-level.enum"
import { CreateProfileDto } from "src/profile/dto/create-profile.dto"

export class CreateAdminDto {
    @IsNotEmpty()
    @IsEmail()
    email:string
    
    @IsNotEmpty()
    @IsString()
    password:string
    
    @IsString()
    @IsNotEmpty()
    department:string
    
    @IsNotEmpty()
    @IsEnum(AccessLevel)
    accessLevel:AccessLevel

    @IsNotEmpty()
    profileId:CreateProfileDto
}
