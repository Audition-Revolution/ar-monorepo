import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import uuidv4 from "uuid/v4";
import { SpecialSkill } from "./SpecialSkills.entity";
import { ActorTag } from "./features/actor-tag/ActorTag.entity";
import {
    CommercialExperience,
    Experience,
    FilmExperience,
    MusicalTheatreExperience,
    OperaExperience,
    TelevisionExperience,
    TheatreExperience,
} from "./Experience.entity";
import { Training } from "./Training.entity";
import { UserImage } from "./UserImage.entity";
import { BreakdownAttribute } from "../common/breakdown/BreakdownAttribute.entity";
import { User } from "./User.entity";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(TheatreExperience)
        private readonly theatreRepo: Repository<TheatreExperience>,
        @InjectRepository(MusicalTheatreExperience)
        private readonly musicalTheatreRepo: Repository<MusicalTheatreExperience>,
        @InjectRepository(OperaExperience)
        private readonly operaRepo: Repository<OperaExperience>,
        @InjectRepository(FilmExperience)
        private readonly filmRepo: Repository<FilmExperience>,
        @InjectRepository(TelevisionExperience)
        private readonly televisionRepo: Repository<TelevisionExperience>,
        @InjectRepository(CommercialExperience)
        private readonly commercialRepo: Repository<CommercialExperience>,
        @InjectRepository(BreakdownAttribute)
        private readonly breakdownRepo: Repository<BreakdownAttribute>,
        @InjectRepository(UserImage)
        private readonly userImageRepo: Repository<UserImage>,
        @InjectRepository(SpecialSkill)
        private readonly specialSkillRepo: Repository<SpecialSkill>,
        @InjectRepository(Training)
        private readonly trainingRepo: Repository<Training>,
        @InjectRepository(ActorTag)
        private readonly tagRepo: Repository<ActorTag>,
    ) {
    }

    async addSkillOrTraining(type: "skill" | "training", value: string, userId: string) {
        if (type === "skill") {
            await this.specialSkillRepo.save({
                text: value,
                userId,
            });
        }
        if (type === "training") {
            await this.trainingRepo.save({
                text: value,
                userId,
            });
        }

        return true;
    }

    async removeSkillOrTraining(type: "skill" | "training", value: string, userId: string) {
        if (type === "skill") {
            await this.specialSkillRepo.delete({
                text: value,
                userId,
            });
        }
        if (type === "training") {
            await this.trainingRepo.delete({
                text: value,
                userId,
            });
        }

        return true;
    }

    async reorderSkillOrTraining(type: string, skillOrder: any) {
        if (type === "skill") {
            const promises = skillOrder.map((skill) => {
                return this.specialSkillRepo.update(skill.id, { index: skill.index });
            });
            await Promise.all(promises);
        }
        if (type === "training") {
            const promises = skillOrder.map((skill) => {
                return this.trainingRepo.update(skill.id, { index: skill.index });
            });
            await Promise.all(promises);
        }

        return true;
    }

    async searchUserByName(query: string): Promise<User[]> {
        return this.userRepo.find({
            where: { displayName: Like(`%${query}%`) },
            cache: true,
        });
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepo.findOne({
            where: { email },
            select: ["id", "firstName", "lastName", "displayName", "email", "userType", "theatreVerified", "verified"],
            cache: true,
        });
    }

    async findByEmailPassword(email: string): Promise<User> {
        try {
            return await this.userRepo.findOne({
                where: { email },
                select: ["password", "salt", "id"],
            });
        } catch (e) {
            throw new Error(e);
        }

    }

    async findById(id: string, relations?: string[], select?: string[]): Promise<any> {
        const options: FindOneOptions<User> = {
            relations: relations || [
                "profileImages",
                "breakdown",
                "profilePicture",
                "rejections",
                "instances",
                "specialSkills",
                "trainings",
            ],
            where: { id },
        };
        if (select) {
            options.select = select as any;
        }
        const user = await this.userRepo.findOne(options);

        const isGhost = await this.userRepo
            .createQueryBuilder("user")
            .select("user.id")
            .addSelect("user.password")
            .addSelect("user.salt")
            .where("user.id = :id", { id })
            .getOne();

        const { password, salt, ...cleanUser } = user;
        if (isGhost.password === "0" && isGhost.salt === "0") {
            cleanUser.ghostAccount = true;
        } else {
            cleanUser.ghostAccount = false;
        }

        return cleanUser;
    }

    async create(user: Partial<User>): Promise<User> {
        try {
            const newUser = new User();
            const saved = { ...newUser, ...user };
            const readyToSave = this.userRepo.create(saved);
            if (!readyToSave.id) {
                readyToSave.id = uuidv4();
            }
            return await this.userRepo.save(readyToSave);
        } catch (err) {
            throw new Error(err);
        }
    }

    async update(id: string, updatedUser: Partial<User>): Promise<User> {
        try {
            delete updatedUser.id;
            delete updatedUser.updatedAt;
            updatedUser.displayName = updatedUser.firstName && updatedUser.lastName && `${updatedUser.firstName} ${updatedUser.lastName}`;
            await this.userRepo.update(id, updatedUser);
            return await this.userRepo.findOne(id);
        } catch (err) {
            throw new UnprocessableEntityException();
        }
    }

    async setProfilePhoto(id: string, user: User): Promise<User> {
        try {
            user.profilePicture = await this.userImageRepo.findOne({
                where: {
                    s3Key: id,
                },
            });
            return await this.userRepo.save(user);
        } catch (err) {
            throw new UnprocessableEntityException();
        }
    }

    async setNewPassword(resetPasswordToken, resetPasswordExpires, newPassword) {
        if (resetPasswordExpires < Date.now()) {
            throw Error("Token Expired");
        }
        try {
            const user = await this.userRepo.createQueryBuilder("user")
                .select("user.id")
                .where("user.resetPasswordToken = :resetPasswordToken", { resetPasswordToken })
                .getOne();
            const id = user.id;
            user.password = newPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.hashPassword();
            this.update(id, user);
            return user;
        } catch (err) {
            console.log(err);
            throw Error(err);
        }
    }

    async addExperience(experienceType: string, experience: Experience, userId: string) {
        const types = {
            theatreExperience: "theatreRepo",
            musicalTheatreExperience: "musicalTheatreRepo",
            operaExperience: "operaRepo",
            filmExperience: "filmRepo",
            televisionExperience: "televisionRepo",
            commercialExperience: "commercialRepo",
        };
        const expBody = { ...experience, userId };
        return await this[types[experienceType]].save(expBody);
    }

    async getExperience(experienceType: string, userId: string) {
        const types = {
            theatreExperience: "theatreRepo",
            musicalTheatreExperience: "musicalTheatreRepo",
            operaExperience: "operaRepo",
            filmExperience: "filmRepo",
            televisionExperience: "televisionRepo",
            commercialExperience: "commercialRepo",
        };
        return await this[types[experienceType]].find({
            where: { userId },
        });
    }

    async reorderExperience(experienceType: string, experienceOrder: any) {
        const types = {
            theatreExperience: "theatreRepo",
            musicalTheatreExperience: "musicalTheatreRepo",
            operaExperience: "operaRepo",
            filmExperience: "filmRepo",
            televisionExperience: "televisionRepo",
            commercialExperience: "commercialRepo",
        };
        const promises = experienceOrder.map((experience) => {
            return this[types[experienceType]].update(experience.id, { index: experience.index });
        });
        await Promise.all(promises);
        return true;
    }

    async removeExperience(experienceType: string, experienceId: string) {
        const types = {
            theatreExperience: "theatreRepo",
            musicalTheatreExperience: "musicalTheatreRepo",
            operaExperience: "operaRepo",
            filmExperience: "filmRepo",
            televisionExperience: "televisionRepo",
            commercialExperience: "commercialRepo",
        };
        return await this[types[experienceType]].delete(experienceId);
    }

    async findArAdmins() {
        return await this.userRepo.find({
            select: ["email"],
            where: { userType: In(["admin"]) },
        });
    }
}
