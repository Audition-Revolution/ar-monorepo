import {Field, ObjectType} from "type-graphql";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "../../../../../user/User.entity";
import {AuditionQuestion} from "./AuditionQuestion.entity";

@ObjectType()
@Unique(["questionId", "userId"])
@Entity()
export class AuditionAnswers {
    @Field({nullable: true})
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field({nullable: true})
    @Column({default: ""})
    text: string;

    @Column()
    questionId: string;

    @Field(() => AuditionQuestion)
    @ManyToOne(() => AuditionQuestion, i => i.answers, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({name: "questionId"})
    question: AuditionQuestion;

    @Field(() => User)
    @ManyToOne(() => User, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;

}
