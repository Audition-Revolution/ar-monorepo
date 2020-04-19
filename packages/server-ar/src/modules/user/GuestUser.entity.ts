import {Entity, Column, PrimaryColumn, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {AuditionTalentInstance} from "../organization/features/project/features/audition/AuditionTalentInstance.entity";
import {IsEmail, IsPhoneNumber} from "class-validator";

@Entity()
export class GuestUser {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsEmail()
    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @IsPhoneNumber("us")
    @Column()
    phoneNumber: number;

    @OneToMany(() => AuditionTalentInstance, instance => instance.user)
    instances: AuditionTalentInstance[];
}
