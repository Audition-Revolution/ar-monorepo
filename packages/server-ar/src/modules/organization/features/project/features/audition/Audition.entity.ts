import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {AuditionTimeSlot} from "./audition-time-slot/AuditionTimeSlot.entity";
import {Field, ObjectType} from "type-graphql";
import {AuditionTalentInstance} from "./AuditionTalentInstance.entity";
import {AuditionQuestion} from "./AuditionQuestion.entity";
import {ProjectRole} from "../../ProjectRole.entity";
import {AuditionCollateral} from "./AuditionCollateral.entity";
import {Project} from "../../Project.entity";

@ObjectType()
@Entity()
export class Audition {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column({enum: ["general", "callback", "callForSubmission"]})
    auditionType: string;

    @Field({nullable: true})
    @Column({nullable: true})
    requirementSummary: string;

    @Field()
    @Column({type: "float"})
    lat: number;

    @Field()
    @Column({type: "float"})
    long: number;

    @Field()
    @Column()
    address: string;

    @Field({nullable: true})
    @Column({type: "timestamp", nullable: true})
    startDate: Date;

    @Field({nullable: true})
    @Column({type: "timestamp", nullable: true})
    endDate: Date;

    @Field({nullable: true})
    @Column({type: "text", nullable: true})
    description: string;

    @Field({nullable: true})
    @Column({type: "boolean", default: false})
    private: boolean;

    @Field({nullable: true})
    @Column({type: "text", nullable: true})
    prep: string;

    @Field({nullable: true})
    @Column({type: "boolean", default: true})
    open: boolean;

    @Field(() => Project)
    @ManyToOne(() => Project, project => project.auditions)
    @JoinColumn()
    project: Project | number;

    @Field(() => [AuditionTimeSlot])
    @OneToMany(() => AuditionTimeSlot, ts => ts.audition)
    timeSlots: AuditionTimeSlot[];

    @Field(() => [AuditionTalentInstance], {nullable: true})
    @OneToMany(() => AuditionTalentInstance, talent => talent.audition, {nullable: true})
    talent: AuditionTalentInstance[];

    @Field(() => [AuditionQuestion], {nullable: true})
    @OneToMany(() => AuditionQuestion, q => q.audition, {nullable: true})
    questions: AuditionQuestion[];

    @Field(() => [AuditionCollateral], {nullable: true})
    @OneToMany(() => AuditionCollateral, c => c.audition, {nullable: true})
    collateral: AuditionCollateral[];

    @Field(() => [ProjectRole], {nullable: true})
    @ManyToMany(() => ProjectRole, p => p.inAuditions, {nullable: true, cascade: true})
    @JoinTable()
    forRoles: ProjectRole[];

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

    @Field()
    cloneAuditions?: string;
}
