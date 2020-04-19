import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./features/project/Project.entity";
import {User} from "../user/User.entity";
import {IsPhoneNumber} from "class-validator";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Organization {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column({type: "float", nullable: true})
    lat?: number;

    @Field()
    @Column({type: "float", nullable: true})
    long?: number;

    @Field()
    @Column()
    address: string;

    @Field()
    @Column({nullable: true})
    contactPhoneNumber?: string;

    @Field()
    @Column({nullable: true})
    irsStatus?: string;

    // @IsUrl()
    @Field()
    @Column({nullable: true})
    website?: string;

    @Field()
    @Column({nullable: true})
    contractsOfferred?: string;

    @Field()
    @Column({type: "text", nullable: true})
    aboutUs?: string;

    @Field()
    @Column({type: "text", default:  ""})
    ein: string;

    @Field(() => Project)
    @OneToMany(() => Project, project => project.organization)
    projects: Project[];

    @Field(() => [User])
    @ManyToMany(type => User, user => user.organizations, {
        cascade: true,
        onDelete: "CASCADE",
    })
    members: User[];

    @Field(() => User)
    @ManyToOne(t => User, user => user.ownedOrgs, {
        cascade: true,
        onDelete: "CASCADE",
    })
    owner: User;
}
