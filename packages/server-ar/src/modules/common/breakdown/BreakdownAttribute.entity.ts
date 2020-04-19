import {CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique} from "typeorm";
import {User} from "../../user/User.entity";
import {ProjectRole} from "../../organization/features/project/ProjectRole.entity";
import {Field, ObjectType} from "type-graphql";

export enum BreakdownType {
    TALENT,
    ROLE,
}

export enum BreakdownCategory {
    UNION,
    GENDER,
    AGE_RANGE,
    ETHNICITY,
    VOCAL_RANGE,
}

@ObjectType()
@Unique(["value", "userId"])
@Entity()
export class BreakdownAttribute {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: string;

    @Field()
    @Column("int")
    type: BreakdownType;

    @Field()
    @Column("int")
    category: BreakdownCategory;

    @Field()
    @Column()
    value: string;

    @Field(() => User)
    @ManyToOne(() => User, u => u.breakdown)
    @JoinColumn({name: "userId"})
    user: User;

    @Column({nullable: true})
    userId: string;

    @Field(() => ProjectRole)
    @ManyToOne(() => ProjectRole, u => u.breakdown)
    @JoinColumn()
    projectRole: ProjectRole;
}
