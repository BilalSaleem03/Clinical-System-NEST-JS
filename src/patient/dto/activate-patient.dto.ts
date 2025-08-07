import { IsEmail, IsNotEmpty, IsString } from "class-validator"


export class ActivatePatientDto{

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsNotEmpty()
    @IsString()
    newPassword:string
    
    @IsNotEmpty()
    @IsString()
    hash:string
}