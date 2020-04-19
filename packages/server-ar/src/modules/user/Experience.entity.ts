import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity";
import {Field, InputType, InterfaceType, ObjectType} from "type-graphql";

@InputType("ExperienceInput")
@InterfaceType()
export abstract class Experience {
    @Field({nullable: true})
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    role: string;

    @Field()
    @Column()
    project: string;

    @Field()
    @Column()
    company: string;

    @Field()
    @Column()
    director: string;

    @Field({nullable: true})
    @Column({default: 0})
    index: number;

    @Field({nullable: true})
    @Column({
        nullable: true,
    })
    imageGuid: string;

    @Field({nullable: true})
    @Column({
        nullable: true,
        type: "text",
    })
    description: string;

    @Field({nullable: true})
    @Column({
        type: "boolean",
        default: true,
    })
    showOnResume: boolean;
}

@ObjectType({implements: Experience})
@Entity()
export class TheatreExperience extends Experience {
    @Field(() => User)
    @ManyToOne(() => User, u => u.theatreExperience)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;
}

@ObjectType({implements: Experience})
@Entity()
export class MusicalTheatreExperience extends Experience {
    @Field(() => User)
    @ManyToOne(() => User, u => u.musicalTheatreExperience)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;
}

@ObjectType({implements: Experience})
@Entity()
export class OperaExperience extends Experience {
    @Field(() => User)
    @ManyToOne(() => User, u => u.operaExperience)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;
}

@ObjectType({implements: Experience})
@Entity()
export class FilmExperience extends Experience {
    @Field(() => User)
    @ManyToOne(() => User, u => u.filmExperience)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;
}

@ObjectType({implements: Experience})
@Entity()
export class TelevisionExperience extends Experience {
    @Field(() => User)
    @ManyToOne(() => User, u => u.televisionExperience)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;
}

@ObjectType({implements: Experience})
@Entity()
export class CommercialExperience extends Experience {
    @Field(() => User)
    @ManyToOne(() => User, u => u.commercialExperience)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    userId: string;
}
