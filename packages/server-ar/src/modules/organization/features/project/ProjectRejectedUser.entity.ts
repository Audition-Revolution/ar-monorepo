import {Column, Entity, ManyToOne} from "typeorm";
import {User} from "../../../user/User.entity";
import {Project} from "./Project.entity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export default class ProjectRejectedUser {
    @Field({nullable: true})
    @Column({default: false, nullable: true})
    rejectionEmailSent: boolean;
    @Field(() => User, {nullable: true})
    @ManyToOne(type => User, user => user.rejections, {primary: true, eager: true})
    user: User;
    @Field(() => Project, {nullable: true})
    @ManyToOne(type => Project, group => group.rejected, {primary: true, eager: true})
    project: Project;
}
