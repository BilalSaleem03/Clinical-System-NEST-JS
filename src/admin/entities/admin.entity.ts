import { Profile } from "src/profile/entities/profile.entity"
import { AccessLevel } from "../enum/access-level.enum"
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { IsNotEmpty } from "class-validator"

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id:number

    @OneToOne(()=>Profile , {
        cascade:true,
        eager:true,
        onDelete:'CASCADE'
    })
    @JoinColumn()
    profileId:Profile

    
    @Column({
        nullable:true
    })
    refreshToken?:string

    @Column({
        unique:true
    })
    @IsNotEmpty()
    email:string

    @Column()
    @IsNotEmpty()
    password:string

    @IsNotEmpty()
    @Column()
    department:string

    @Column({
        nullable:true
    })
    emailVerificationHash?:string


    @Column({
        nullable:true
    })
    emailVerificationHashExpiresIN?:Date

    @Column({
        type:"enum",
        enum:AccessLevel,
    })
    @IsNotEmpty()
    accessLevel:AccessLevel

    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date
}
