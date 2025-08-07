import { Profile } from "src/profile/entities/profile.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Gender } from "../enum/genter.enum"
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator"
import { CheckUp } from "src/check-up/entities/check-up.entity"
import { Appointment } from "src/appointment/entities/appointment.entity"

@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    id:number


    @IsNotEmpty()
    @OneToOne(()=>Profile , {
        eager:true,
        onDelete:'CASCADE',
        cascade:true
    })
    @JoinColumn()
    profileId:Profile


    @OneToMany(()=>CheckUp , (checkup)=>checkup.patientId)
    checkups?:CheckUp[]

    @OneToMany(()=>Appointment , (appointment)=>appointment.patientId)
    appointments?:Appointment[]

    @Column({
        unique:true
    })
    @IsNotEmpty()
    email:string

    @Column({
        nullable:true
    })
    @IsNotEmpty()
    password?:string

    @Column()
    @IsInt()
    @IsPositive()
    age:number
    @Column({
        type:"enum",
        enum:Gender
    })
    gender:Gender

    @Column()
    @IsNotEmpty()
    address:string

    @Column({
        nullable:true
    })
    emailVerificationHash?:string

    @Column({
        nullable:true
    })
    emailVerificationHashExpiresIN?:Date
    
    @Column({
        nullable:true
    })
    refreshToken?:string
   
    @Column({
        nullable:true
    })
    googleAccessToken?:string


    // medicalHistory (optional)


    @Column({
        type:'bigint'
    })
    @IsOptional()
    emergencyContact?:number

    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date
}
