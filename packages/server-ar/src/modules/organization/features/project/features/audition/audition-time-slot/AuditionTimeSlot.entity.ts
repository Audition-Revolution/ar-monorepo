import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Audition} from "../Audition.entity";
import {AuditionTalentInstance} from "../AuditionTalentInstance.entity";
import {MinDate} from "class-validator";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class AuditionTimeSlot {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({nullable: true})
    @MinDate(new Date())
    @Column({
        type: "timestamp",
        nullable: true,
    })
    startTime: Date;

    @Field({nullable: true})
    @MinDate(new Date())
    @Column({
        type: "timestamp",
        nullable: true,
    })
    endTime: Date;

    @Field(() => Audition, {nullable: true})
    @ManyToOne(() => Audition, audition => audition.timeSlots, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    audition: string;

    @Field(() => [AuditionTalentInstance], {nullable: true})
    @OneToMany(() => AuditionTalentInstance, aTalent => aTalent.timeSlot, {nullable: true})
    @JoinColumn()
    talent: any;

    @Field({nullable: true})
    @Column({
        default: 1,
    })
    capacity: number;
}
