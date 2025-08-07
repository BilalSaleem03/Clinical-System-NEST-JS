import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator"
import { CreateProfileDto } from "src/profile/dto/create-profile.dto"

 



export class CreateDoctorDto {
    
    
    @IsNotEmpty()
    @IsEmail()
    email:string
    
    @IsNotEmpty()
    @IsString()
    password:string
    
    @IsNotEmpty()
    @IsString()
    specialization:string
    
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    licenseNumber:number
    
    @IsNotEmpty()
    @IsString()
    clinicName:string
    
    
    @IsNotEmpty()
    profileId:CreateProfileDto
}
