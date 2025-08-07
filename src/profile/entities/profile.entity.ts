import { Column, CreateDateColumn, Entity, Long, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Role } from "../enums/role.enum"
import { IsNotEmpty } from "class-validator"


@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id:number


    @IsNotEmpty()
    @Column({
        type:'enum',
        enum:Role,
    })
    role:Role                                      // (DOCTOR, PATIENT, ADMIN)
    
    @Column()
    @IsNotEmpty()
    fullName:string

    

    @Column({
        type:'bigint'
    })
    @IsNotEmpty()
    phoneNumber:number

    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date
}
