import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project.entity";
import {BreakdownAttribute} from "../../../common/breakdown/BreakdownAttribute.entity";
import {FormattedBreakdown, User} from "../../../user/User.entity";
import {Audition} from "./features/audition/Audition.entity";
import {AuditionCollateral} from "./features/audition/AuditionCollateral.entity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class FormattedCollateral {
    @Field({nullable: true})
    url: string;
    @Field({nullable: true})
    key: string;
}

@ObjectType()
@Entity()
export class ProjectRole {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => Project)
    @ManyToOne(() => Project, project => project.roles)
    @JoinColumn()
    project: Project;

    @Field()
    @Column()
    characterName: string;

    @Field()
    @Column({type: "text"})
    characterSummary: string;

    @Field({nullable: true})
    @Column({nullable: true})
    movementRequirements: string;

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, u => u.castIn, {eager: true})
    castTo: User;

    @Field(() => FormattedBreakdown, {nullable: true})
    @OneToMany(
        type => BreakdownAttribute,
        b => b.projectRole,
        {
            cascade: true,
            onDelete: "CASCADE",
        },
    )
    breakdown: FormattedBreakdown;

    @Field(() => [Audition])
    @ManyToMany(() => Audition, a => a.forRoles)
    inAuditions: Audition[];

    @Field(() => [FormattedCollateral])
    @OneToMany(() => AuditionCollateral, c => c.role)
    collateral: FormattedCollateral[];
}
