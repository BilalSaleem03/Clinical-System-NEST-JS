import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { Doctor } from "src/doctor/entities/doctor.entity"
import { Patient } from "src/patient/entities/patient.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { AppointmentStatus } from "../enum/appointment-status.enum"
import { Type } from "class-transformer"

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id:number

    @IsNotEmpty()
    @ManyToOne(()=>Patient , (patient)=>patient.appointments , {
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"patientId"})
    patientId:Patient
    
    @ManyToOne(()=>Doctor , (doctor)=>doctor.appointments , {
        onDelete:"CASCADE"
    })
    @IsNotEmpty()
    @JoinColumn({name:"doctorId"})
    doctorId:Doctor

    @Column()
    @IsNotEmpty()
    @IsDate()
    @Type(()=>Date)
    appointmentDateTime:Date

    @Column()
    @IsNotEmpty()
    location:string

    @Column({
        type:"enum",
        enum:AppointmentStatus,
        default:AppointmentStatus.Scheduled
    })
    @IsNotEmpty()
    status:AppointmentStatus
    

    @Column()
    @IsNotEmpty()
    @IsString()
    description:string


    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date


    @Column()
    @IsString()
    @IsNotEmpty()
    googleCalendarEventId:string
}
