import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import {AuditionTalentInstance} from "../organization/features/project/features/audition/AuditionTalentInstance.entity";
import * as crypto from "crypto";
import {
    CommercialExperience,
    FilmExperience,
    MusicalTheatreExperience,
    OperaExperience,
    TelevisionExperience,
    TheatreExperience,
} from "./Experience.entity";
import {Organization} from "../organization/Organization.entity";
import {BreakdownAttribute} from "../common/breakdown/BreakdownAttribute.entity";
import {IsEmail} from "class-validator";
import {ProjectRole} from "../organization/features/project/ProjectRole.entity";
import {ActorNote} from "./features/actor-note/ActorNote.entity";
import {Field, ObjectType, registerEnumType} from "type-graphql";
import ProjectRejectedUser from "../organization/features/project/ProjectRejectedUser.entity";
import {SpecialSkill} from "./SpecialSkills.entity";
import {Training} from "./Training.entity";
import {UserImage} from "./UserImage.entity";

export enum Gender {
    Male = "male",
    Female = "female",
    NonBinary = "nonbinary",
    Private = "private",
}

registerEnumType(Gender, {
    name: "Gender", // this one is mandatory
    description: "GenderOptions", // this one is optional
});

export enum UserType {
    admin = "admin",
    actor = "actor",
    theatre = "theatre",
}

export enum ExperienceType {
    theatreExperience = "theatreExperience",
    musicalTheatreExperience = "musicalTheatreExperience",
    operaExperience = "operaExperience",
    filmExperience = "filmExperience",
    televisionExperience = "televisionExperience",
    commercialExperience = "commercialExperience",
}

export enum EyeColor {
    brown = "brown",
    hazel = "hazel",
    blue = "blue",
    green = "green",
    gray = "gray",
    amber = "amber",
    other = "other",
    unknown = "unknown",
}

registerEnumType(EyeColor, {
    name: "EyeColor", // this one is mandatory
    description: "Eye Color", // this one is optional
});

export enum HairColor {
    black = "black",
    brown = "brown",
    red = "red",
    blonde = "blonde",
    gray = "gray",
    white = "white",
    other = "other",
    unknown = "unknown",
}

registerEnumType(HairColor, {
    name: "HairColor", // this one is mandatory
    description: "Hair Color", // this one is optional
});

registerEnumType(ExperienceType, {
    name: "ExperienceType", // this one is mandatory
    description: "Experience Order", // this one is optional
});

registerEnumType(UserType, {
    name: "UserType", // this one is mandatory
    description: "What type of user is this? Admin or Actor", // this one is optional
});

@ObjectType()
export class FormattedBreakdown {
    @Field(type => [String], {nullable: true})
    ageRange: string[];
    @Field(type => [String], {nullable: true})
    gender: string[];
    @Field(type => [String], {nullable: true})
    unions: string[];
    @Field(type => [String], {nullable: true})
    ethnicity: string[];
    @Field(type => [String], {nullable: true})
    vocalRange: string[];
}

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryColumn()
    id: string;

    @Field()
    @Column({default: true})
    theatreVerified: boolean;

    @Field()
    @Column({default: false})
    verified: boolean;

    @Field()
    @Column({default: false})
    emailConfirmed: boolean;

    @Field()
    @IsEmail()
    @Column({
        unique: true,
        nullable: false,
        type: "varchar",
    })
    @Index({unique: true})
    email: string;

    @Field()
    @Column({})
    firstName: string;

    @Field()
    @Column({})
    lastName: string;

    @Field({nullable: true})
    @Column({nullable: true})
    displayName: string;

    @Field({nullable: true})
    @Column({nullable: true})
    representation: string;

    @Field({nullable: true})
    @Column({nullable: true})
    city: string;

    @Field({nullable: true})
    @Column({nullable: true})
    state: string;

    @Field({nullable: true})
    ghostAccount?: boolean;

    // @IsUrl()
    @Field({nullable: true})
    @Column({nullable: true})
    website: string;

    @Field({nullable: true})
    @Column({nullable: true})
    gender: Gender;

    @Field({nullable: true})
    @Column({
        nullable: true,
    })
    phoneNumber: string;

    @Field({nullable: true})
    @Column({
        nullable: true,
    })
    heightInches: number;

    @Field(() => EyeColor)
    @Column("enum", {enum: EyeColor, default: "unknown"})
    eyeColor: EyeColor;

    @Field(() => HairColor)
    @Column("enum", {enum: HairColor, default: "unknown"})
    hairColor: HairColor;

    @Field({nullable: true})
    @Column({
        nullable: true,
    })
    weightLbs: number;

    @Field(() => [Organization])
    @ManyToMany(type => Organization, org => org.members)
    @JoinTable()
    organizations: Organization[];

    @Field(() => Organization)
    @OneToMany(type => Organization, org => org.owner)
    ownedOrgs: Organization[];

    @Field(() => [SpecialSkill], {nullable: true})
    @OneToMany(() => SpecialSkill, instance => instance.user)
    specialSkills: SpecialSkill[];

    @Field(() => [Training], {nullable: true})
    @OneToMany(() => Training, instance => instance.user)
    trainings: Training[];

    @Field(() => [AuditionTalentInstance])
    @OneToMany(() => AuditionTalentInstance, instance => instance.user)
    instances: AuditionTalentInstance[];

    @Field(() => [TheatreExperience])
    @OneToMany(() => TheatreExperience, t => t.user)
    theatreExperience: TheatreExperience[];

    @Field(() => [MusicalTheatreExperience])
    @OneToMany(() => MusicalTheatreExperience, t => t.user)
    musicalTheatreExperience: MusicalTheatreExperience[];

    @Field(() => [OperaExperience])
    @OneToMany(() => OperaExperience, t => t.user)
    operaExperience: OperaExperience[];

    @Field(() => [FilmExperience])
    @OneToMany(() => FilmExperience, t => t.user)
    filmExperience: FilmExperience[];

    @Field(() => [TelevisionExperience])
    @OneToMany(() => TelevisionExperience, t => t.user)
    televisionExperience: TelevisionExperience[];

    @Field(() => [CommercialExperience])
    @OneToMany(() => CommercialExperience, t => t.user)
    commercialExperience: CommercialExperience[];

    @Field(() => [UserImage])
    @OneToMany(() => UserImage, u => u.user, {eager: true})
    profileImages: UserImage[];

    @Field(() => FormattedBreakdown)
    @OneToMany(() => BreakdownAttribute, b => b.user)
    breakdown: FormattedBreakdown;

    @Field(() => [UserType])
    @Column("enum", {enum: ["admin", "actor", "theatre"], array: true, default: "{actor}"})
    userType: UserType[];

    @Field(() => [ExperienceType])
    @Column({
        type: "enum",
        enum: ["theatreExperience", "musicalTheatreExperience", "operaExperience",
            "filmExperience", "televisionExperience", "commercialExperience"],
        array: true,
        default: ["theatreExperience", "musicalTheatreExperience", "operaExperience",
            "filmExperience", "televisionExperience", "commercialExperience"],
    })
    experienceOrder: ExperienceType[];

    @Field(() => [String])
    @Column({
        type: "enum",
        enum: ["experience", "skill", "training"],
        array: true,
        default: ["experience", "skill", "training"],
    })
    profileOrder: Array<"experience" | "skill" | "training">;

    @Field(() => [ProjectRejectedUser], {nullable: true})
    @OneToMany(() => ProjectRejectedUser, u => u.user, {nullable: true})
    rejections: ProjectRejectedUser[];

    @Field(() => ProjectRole)
    @OneToMany(() => ProjectRole, p => p.castTo)
    castIn: ProjectRole[];

    @Column({select: false})
    password?: string;
    @Column({select: false})
    salt?: string;

    @Column({
        nullable: true,
    })
    resetPasswordToken: string;

    @Column({
        nullable: true,
    })
    resetPasswordExpires: Date;

    @Column("text", {array: true, default: {}})
    importSourceEmails: string[];

    @Field(() => [ActorNote])
    @OneToMany(() => ActorNote, a => a.owner)
    notes: ActorNote[];

    @Field()
    @CreateDateColumn({type: "timestamp"})
    createdAt: string;

    @Field()
    @UpdateDateColumn({type: "timestamp"})
    updatedAt: number;

    @Field(() => UserImage, {nullable: true})
    @OneToOne(() => UserImage, {nullable: true, eager: true})
    @JoinColumn()
    profilePicture: UserImage;

    validPassword(password) {
        const hashed = sha512(password, this.salt);
        return hashed === this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password === '0' && this.salt === '0' && this.importSourceEmails.length > 0) {
            return;
        }
        if (!this.password) {
            return;
        }
        this.displayName = `${this.firstName} ${this.lastName}`;
        this.salt = genRandomString(16);
        this.password = sha512(this.password, this.salt);
    }

}

function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString("hex") /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
}

function sha512(password, salt) {
    return crypto.pbkdf2Sync(
        password, salt, 1000,
        64, "sha512")
        .toString("hex");
}
