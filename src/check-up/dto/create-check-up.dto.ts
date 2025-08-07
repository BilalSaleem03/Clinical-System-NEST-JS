import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator"

export class CreateCheckUpDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    patientId:number
        
    @IsString()
    @IsNotEmpty()
    title:string
    
    
    @IsString()
    @IsNotEmpty()
    notes:string
    
    
    @IsString()
    @IsNotEmpty()
    diagnosis:string
    
    
    @IsString()
    @IsNotEmpty()
    prescription:string
}
