import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import {AuditionTimeSlot} from "./audition-time-slot/AuditionTimeSlot.entity";
import {User} from "../../../../../user/User.entity";
import {GuestUser} from "../../../../../user/GuestUser.entity";
import {Audition} from "./Audition.entity";
import uuidV4 from "uuid/v4";
import {Field, ObjectType} from "type-graphql";

export enum TALENT_INSTANCE_STATUS {
    UNCONFIRMED = "unconfirmed",
    CONFIRMED = "confirmed",
    DENIED = "denied",
    CHECKED_IN = "checkedIn",
}

export enum AUDITION_DECISION {
    NO_THANKS = "no_thanks",
    ON_HOLD = "on_hold",
    CALLBACK = "callback",
    CAST = "cast",
}

@ObjectType()
export class FormattedAnswer {
    @Field()
    id: string;
    @Field()
    text: string;
}

@ObjectType()
export class FormattedQuestionAnswer {
    @Field()
    id: string;
    @Field()
    text: string;
    @Field({nullable: true})
    answer: FormattedAnswer;
}

@ObjectType()
@Unique(["audition", "user"])
@Entity()
export class AuditionTalentInstance {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({nullable: true})
    @Column({nullable: true})
    projectId: number;

    @Field({nullable: true})
    @Column({default: true})
    registered: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    selfSignup: string;

    @Field({nullable: true})
    @Column({nullable: true})
    walkIn: string;

    @Field({nullable: true})
    @Column({nullable: true})
    callBack: string;

    @Field({nullable: true})
    @Column({nullable: true})
    hasConflicts: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    decision: AUDITION_DECISION | string;

    @Field()
    @Column("enum", {nullable: false, enum: TALENT_INSTANCE_STATUS, default: TALENT_INSTANCE_STATUS.UNCONFIRMED})
    status: TALENT_INSTANCE_STATUS;

    @Field(() => Audition)
    @ManyToOne(() => Audition, audition => audition.talent, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn({name: "auditionId"})
    audition: Audition;

    @Field(() => AuditionTimeSlot, {nullable: true})
    @ManyToOne(() => AuditionTimeSlot, ts => ts.talent, {onDelete: "CASCADE", cascade: true, nullable: true})
    timeSlot: AuditionTimeSlot;

    @Field()
    @Column({default: uuidV4()})
    responseCode: string;

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.instances, {
        nullable: true,
    })
    @JoinColumn()
    user: User | string;

    @ManyToOne(() => GuestUser, user => user.instances, {
        nullable: true,
    })
    @JoinColumn()
    guest: string;

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

    @Field(() => [FormattedQuestionAnswer])
    questions: FormattedQuestionAnswer[];
}
