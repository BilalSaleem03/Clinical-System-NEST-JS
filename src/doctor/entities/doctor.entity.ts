import { IsNotEmpty } from "class-validator"
import { Appointment } from "src/appointment/entities/appointment.entity"
import { CheckUp } from "src/check-up/entities/check-up.entity"
import { Profile } from "src/profile/entities/profile.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id:number
    
    @OneToOne(()=>Profile , {
        cascade:true,
        eager:true,
        onDelete:'CASCADE'
    })
    @JoinColumn()
    profileId:Profile

    @OneToMany(()=>CheckUp , (checkup)=>checkup.doctorId )
    checkups?:CheckUp[]
    
    @OneToMany(()=>Appointment , (appointment)=>appointment.doctorId )
    appointments?:Appointment[]

    
    @Column({
        nullable:true
    })
    refreshToken?:string


    @Column({
        nullable:true
    })
    emailVerificationHash?:string

    @Column({
        nullable:true
    })
    emailVerificationHashExpiresIN?:Date

    @Column({
        unique:true
    })
    @IsNotEmpty()
    email:string

    @Column()
    @IsNotEmpty()
    password:string

    @Column()
    @IsNotEmpty()
    specialization:string

    @Column()
    @IsNotEmpty()
    licenseNumber:number

    @Column()
    @IsNotEmpty()
    clinicName:string

    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date
}
