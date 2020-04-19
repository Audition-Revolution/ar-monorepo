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
import {Audition} from "../../../organization/features/project/features/audition/Audition.entity";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class ActorNote {
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
    @Column({type: "text"})
    text: string;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn({name: "forId"})
    for: User | string;

    @Column()
    forId: string;

    @Field(() => Audition, {nullable: true})
    @ManyToOne(() => Audition, {nullable: true})
    @JoinColumn()
    audition: Audition | string;

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: string;

    @Field()
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: number;
}
