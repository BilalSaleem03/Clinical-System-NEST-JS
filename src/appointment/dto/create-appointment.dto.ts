import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator"
import { AppointmentStatus } from "../enum/appointment-status.enum"
import { Type } from "class-transformer"

export class CreateAppointmentDto {

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    patientId:number
    
    @IsNotEmpty()
    @IsDate()
    @Type(()=>Date)
    appointmentDateTime:Date
    
    
    @IsNotEmpty()
    @IsString()
    location:string

    @IsNotEmpty()
    @IsEnum(AppointmentStatus)
    status:AppointmentStatus
    
    
    // googleCalendarEventId

    @IsNotEmpty()
    @IsString()
    description:string
}
