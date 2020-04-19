import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export abstract class SpecialSkill {
    @Field({nullable: true})
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    text: string;

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.specialSkills, {
        nullable: true,
    })
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;

    @Field({nullable: true})
    @Column({default: 0})
    index: number;
}
