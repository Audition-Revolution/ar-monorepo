import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {AuditionAnswers} from "./AuditionAnswer.entity";
import {Audition} from "./Audition.entity";

@ObjectType()
@Entity()
export class AuditionQuestion {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    text: string;

    @Field(() => AuditionAnswers, {nullable: true})
    @OneToMany(() => AuditionAnswers, i => i.question)
    answers: AuditionAnswers;

    @Column()
    auditionId: string;

    @Field(() => Audition)
    @ManyToOne(() => Audition, a => a.questions, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({name: "auditionId"})
    audition: string;
}
