import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../../../../user/User.entity";
import {Audition} from "./Audition.entity";
import {ProjectRole} from "../../ProjectRole.entity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class AuditionCollateral {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    s3Key: string;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    @Field(() => Audition)
    @ManyToOne(() => Audition, a => a.collateral, {nullable: true, cascade: true})
    audition: string;

    @Field(() => ProjectRole)
    @ManyToOne(() => ProjectRole, a => a.collateral, {nullable: true, cascade: true})
    role: ProjectRole | string;

    @Field(() => User)
    @ManyToOne(() => User, {cascade: true})
    user: User;
}
