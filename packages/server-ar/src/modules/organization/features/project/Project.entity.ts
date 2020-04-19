import {Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Organization} from "../../Organization.entity";
import {ProjectRole} from "./ProjectRole.entity";
import {Audition} from "./features/audition/Audition.entity";
import {Field, ObjectType} from "type-graphql";
import ProjectRejectedUser from "./ProjectRejectedUser.entity";

@ObjectType()
@Entity()
export class Project {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    name: string;

    @Field({nullable: true})
    @Column({nullable: true})
    status: string;

    @Field()
    @Column()
    writer: string;

    @Field()
    @Column()
    director: string;

    @Field({nullable: true})
    @Column({type: "text", nullable: true})
    summary: string;

    @Field({nullable: true})
    @Column({type: "text", nullable: true})
    notes: string;

    @Field({nullable: true})
    @Column({nullable: true})
    photoS3Key: string;

    @Field({nullable: true})
    @Column({type: "date", nullable: true})
    rehearsalDateStart: string;

    @Field({nullable: true})
    @Column({type: "date", nullable: true})
    rehearsalDateEnd: string;

    @Field({nullable: true})
    @Column({type: "date", nullable: true})
    performanceDateStart: string;

    @Field({nullable: true})
    @Column({type: "date", nullable: true})
    performanceDateEnd: string;

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

    @Field(() => [ProjectRole])
    @OneToMany(() => ProjectRole, projectRole => projectRole.project)
    roles: ProjectRole[];

    @Field(() => [Audition])
    @OneToMany(() => Audition, audition => audition.project)
    auditions: Audition[];

    @Field(() => [ProjectRejectedUser], {nullable: true})
    @OneToMany(() => ProjectRejectedUser, u => u.project, {nullable: true, cascade: true})
    @JoinTable()
    rejected: ProjectRejectedUser[];

    @Field(() => Organization)
    @ManyToOne(() => Organization, organization => organization.projects, {
        cascade: true,
        onDelete: "CASCADE",
    })
    organization: Organization;

}
