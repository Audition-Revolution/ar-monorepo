import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, In, Repository, WhereExpression} from "typeorm";
import {Audition} from "./Audition.entity";
import {AuditionTalentInstance, TALENT_INSTANCE_STATUS} from "./AuditionTalentInstance.entity";
import {AuditionQuestion} from "./AuditionQuestion.entity";
import {AuditionAnswers} from "./AuditionAnswer.entity";
import {ProjectRole} from "../../ProjectRole.entity";
import {User} from "../../../../../user/User.entity";

@Injectable()
export class AuditionService {
    constructor(
        @InjectRepository(Audition)
        private readonly auditionRepo: Repository<Audition>,
        @InjectRepository(AuditionTalentInstance)
        private readonly talentInstanceRepo: Repository<AuditionTalentInstance>,
        @InjectRepository(AuditionQuestion)
        private readonly auditionQuestionRepo: Repository<AuditionQuestion>,
        @InjectRepository(AuditionAnswers)
        private readonly auditionAnswersRepo: Repository<AuditionAnswers>,
        @InjectRepository(ProjectRole)
        private readonly projectRoleRepo: Repository<ProjectRole>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
    }

    async search(query: string): Promise<Audition[]> {
        return await this.auditionRepo
            .createQueryBuilder("audition")
            .leftJoinAndSelect("audition.timeSlots", "timeSlots")
            .leftJoinAndSelect("audition.forRoles", "forRoles")
            .leftJoinAndSelect("audition.project", "project")
            .leftJoinAndSelect("project.organization", "organization")
            .where("audition.private = false")
            .andWhere(new Brackets((qb: WhereExpression) => (
                qb.where("LOWER(audition.name) LIKE LOWER(:name)", {name: `%${query}%`})
                    .orWhere("LOWER(project.name) LIKE LOWER(:name)", {name: `%${query}%`})
                    .orWhere("LOWER(organization.name) LIKE LOWER(:name)", {name: `%${query}%`})
            )))
            .andWhere("audition.auditionType IN('general', 'callForSubmission')")
            .getMany();
    }

    async findAllForProject(project: string): Promise<Audition[]> {
        const auditions = await this.auditionRepo.find({
            where: {project},
            relations: ["timeSlots", "talent", "forRoles"],
        });
        return auditions.map((audition: Audition) => {
            audition.timeSlots = audition.timeSlots.sort((a: any, b: any) => a.startTime - b.startTime);
            audition.talent = audition.talent.filter((talent: any) => talent.status === "confirmed");
            return audition;
        });
    }

    async findOne(id: string, relations?: string[]): Promise<Audition> {
        const defaultRelations = ["timeSlots", "timeSlots.talent", "talent", "talent.user", "questions", "questions.answers", "forRoles", "project"];
        const audition = await this.auditionRepo.findOne({
            id,
        }, {
            relations: relations || defaultRelations,
        });
        if (audition.timeSlots) {
            audition.timeSlots = audition.timeSlots.sort((a: any, b: any) => a.startTime - b.startTime);
        }
        return audition;
    }

    async create(body: any, THISISABUG: any): Promise<Audition> {
        const {audition, projectId} = body;
        let projects = [];
        if (audition.forRoles.length >= 1) {
            projects = await this.projectRoleRepo.find({
                where: {
                    id: In(audition.forRoles),
                },
            });
        }
        const savedAudition = await this.auditionRepo.save({
            project: projectId,
            ...audition,
            forRoles: projects,
            private: audition.status === "private",
        });

        const saveQuestions = audition.questions.map((q: any) => {
            this.auditionQuestionRepo.save({
                audition: savedAudition.id,
                text: q,
            });
        });

        await Promise.all(saveQuestions);
        return savedAudition;
    }

    async update(auditionId: string, body: any) {
        return await this.auditionRepo.update(auditionId, body);
    }

    async delete(auditionId: string): Promise<any> {
        await this.auditionRepo.delete(auditionId);
        return {
            name: "success",
        };
    }

    async addTalentToAudition(id: any, user: User, timeSlot?: string): Promise<AuditionTalentInstance> {
        try {
            const status = timeSlot ? TALENT_INSTANCE_STATUS.UNCONFIRMED : TALENT_INSTANCE_STATUS.CONFIRMED;
            return await this.talentInstanceRepo.save({
                audition: id,
                user,
                status,
            }, {chunk: 10});
        } catch (err) {
            throw new Error(err);
        }

    }

    async findInstanceBy(criteria: any): Promise<AuditionTalentInstance> {
        return await this.talentInstanceRepo.findOne(criteria);
    }

    async saveAnswerToAuditionQuestion(answer: any) {
        try {
            return await this.auditionAnswersRepo.save({
                text: answer.text,
                questionId: answer.questionId,
                userId: answer.userId,
            });
        } catch (e) {
            if (e.message.includes("duplicate key value violates unique constraint")) {
                await this.auditionAnswersRepo.update({
                    questionId: answer.questionId,
                    userId: answer.userId,
                }, {text: answer.text});
            }
        }
    }

    async respondToAuditionInvite(email: string, responseCode: string, response: string) {
        let foundUser = await this.userRepo.findOne({
            where: {id: email},
        });

        if (!foundUser) {
            foundUser = await this.userRepo.findOne({
                where: {email},
            });
        }
        // TODO THIS CODE IS SO BAD!
        let talentInstance = await this.talentInstanceRepo.findOne({
            responseCode,
            user: foundUser,
        });
        if (!talentInstance) {

            try {
                talentInstance = await this.addTalentToAudition(responseCode, foundUser);
            } catch (e) {
                if (e.message.includes("duplicate key value")) {
                    throw new Error("Actor is already registered for this audition.");
                } else {
                    throw new Error(e.message);
                }
            }

            if (response === "confirmed") {
                talentInstance.status = TALENT_INSTANCE_STATUS.CONFIRMED;
            } else if (response === "denied") {
                talentInstance.status = TALENT_INSTANCE_STATUS.DENIED;
            }
        } else {
            const user: any = talentInstance.user;
            const userEmail = user.email as any;
            // TODO reimplement this
            // if (userEmail === email || userEmail === 'jamie@auditionrevolution.com') {
            if (response === "confirmed") {
                talentInstance.status = TALENT_INSTANCE_STATUS.CONFIRMED;
            } else if (response === "denied") {
                talentInstance.status = TALENT_INSTANCE_STATUS.DENIED;
            }
            // }
        }

        return await this.talentInstanceRepo.save(talentInstance);
    }

    async updateInstance(instanceId: string, body: any) {
        return await this.talentInstanceRepo.update(instanceId, body);
    }
}
