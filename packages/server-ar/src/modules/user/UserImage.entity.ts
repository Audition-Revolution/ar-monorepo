import {Field, ObjectType} from "type-graphql";
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity";

@ObjectType()
@Entity()
export class UserImage {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({default: false})
    isPrimary: boolean;

    @Field()
    @Column()
    s3Key: string;

    @Field()
    @CreateDateColumn()
    createdAt: string;

    @Field({nullable: true})
    url?: string;

    @Field(() => User)
    @ManyToOne(() => User, u => u.profileImages, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn({name: "userId"})
    user: User;
    @Column()
    userId: string;
}
