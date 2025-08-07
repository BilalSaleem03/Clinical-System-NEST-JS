import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator"
import { Gender } from "../enum/genter.enum"
import { CreateProfileDto } from "src/profile/dto/create-profile.dto"

export class CreatePatientDto {

    @IsNotEmpty()
    profileId:CreateProfileDto
    
    @IsNotEmpty()
    @IsString()
    email:string

    // @IsString()
    // @IsNotEmpty()
    // password:string

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    age:number
    

    @IsNotEmpty()
    @IsEnum(Gender)
    gender:Gender

    
    @IsNotEmpty()
    @IsString()
    address:string


    // medicalHistory (optional)


    @IsInt()
    @IsPositive()
    @IsOptional()
    emergencyContact?:number
}
