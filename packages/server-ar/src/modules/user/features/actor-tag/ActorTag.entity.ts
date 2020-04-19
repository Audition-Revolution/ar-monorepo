import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {User} from "../../User.entity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class ActorTag {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(() => User)
    @ManyToOne(() => User, u => u.notes)
    @JoinColumn({name: "ownerId"})
    owner: User;

    @Column()
    ownerId: string;

    @Field()
    @Column({length: 50})
    tag: string;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn({name: "forId"})
    for: User;

    @Column()
    forId: string;

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: string;

    @Field()
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: number;
}
