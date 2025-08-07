import { IsNotEmpty, IsString } from "class-validator"
import { Doctor } from "src/doctor/entities/doctor.entity"
import { Patient } from "src/patient/entities/patient.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class CheckUp {
    @PrimaryGeneratedColumn()
    id:number

    @IsNotEmpty()
    @ManyToOne(()=>Patient , (patient)=>patient.checkups , {
        onDelete:"CASCADE"
    })
    @JoinColumn({name:"patientId"})
    patientId:Patient
    
    @ManyToOne(()=>Doctor , (doctor)=>doctor.checkups , {
        onDelete:"CASCADE"
    })
    @IsNotEmpty()
    @JoinColumn({name:"doctorId"})
    doctorId:Doctor

    @Column()
    @IsString()
    @IsNotEmpty()
    title:string
    
    @Column()
    @IsString()
    @IsNotEmpty()
    notes:string
    
    @Column()
    @IsString()
    @IsNotEmpty()
    diagnosis:string
    
    @Column()
    @IsString()
    @IsNotEmpty()
    prescription:string

    @CreateDateColumn()
    checkUpDate:Date
    @UpdateDateColumn()
    updatedAt:Date
}
