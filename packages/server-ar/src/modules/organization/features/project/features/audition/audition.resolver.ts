import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {AuditionService} from "./audition.service";
import {AuditionTimeSlotService} from "./audition-time-slot/audition-time-slot.service";
import {S3Service} from "../../../../../s3/s3.service";
import {UserService} from "../../../../../user/user.service";
import {
    AuditionCheckInDTO,
    AuditionInstanceDTO,
    CreateAuditionDTO,
    GetAuditionDTO,
    GetAuditionsForProjectDTO,
    RespondToAuditionDTO,
    SearchAuditionDTO,
} from "./types/GetAudition.dto";
import {UseFilters, UseGuards} from "@nestjs/common";
import {Arg, ArgsType, Field} from "type-graphql";
import {GqlAuthGuard} from "../../../../../../common/guards/GqlAuthGuard";
import {auditionInvite} from "../../../../../../util/send_email";
import {RoleService} from "../role/role.service";
import {ProjectService} from "../../project.service";
import {HttpExceptionFilter} from "../../../../../../common/filters/GqlExceptionsFilter";
import {CurrentUser} from "../../../../../../common/decorators/CurrentUser.decorator";
import {Audition} from "./Audition.entity";
import {User} from "../../../../../user/User.entity";
import {AuditionTalentInstance} from "./AuditionTalentInstance.entity";

@ArgsType()
class InviteToAuditionDTO {
    @Field()
    auditionId: string;
    @Field({nullable: true})
    userId: string;
    @Field(() => [String], {nullable: true})
    users: string[];
    @Field({nullable: true})
    timeSlotId: string;
    @Field()
    projectId: string;
}

@UseFilters(new HttpExceptionFilter())
@Resolver(of => Audition)
export class AuditionResolver {
    constructor(
        private readonly auditionService: AuditionService,
        private readonly auditionTimeSlotService: AuditionTimeSlotService,
        private readonly s3Service: S3Service,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly projectService: ProjectService,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Audition])
    async getAuditionsForProject(@Args() {projectId}: GetAuditionsForProjectDTO, @CurrentUser() user: any) {
        return await this.auditionService.findAllForProject(projectId);
    }

    @Query(() => Audition)
    async getAudition(@Args() {auditionId}: GetAuditionDTO) {
        const audition = await this.auditionService.findOne(auditionId);
        const promises = audition.talent.map((tal: any) => {
            const withPicture = this.getProfilePhotoForUser(tal.user);
            return {
                ...tal,
                user: withPicture,
            };
        });
        // @ts-ignore
        audition.talent = await Promise.all(promises);
        return audition;
    }

    @Query(() => Audition)
    async getAuditionForRSVP(@Args() {auditionId}: GetAuditionDTO) {
        return await this.auditionService.findOne(auditionId, ["questions", "questions.answers", "timeSlots"]);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Audition])
    async searchForAuditions(@Args() {query}: SearchAuditionDTO) {
        return await this.auditionService.search(query);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Audition)
    async createAudition(
        @Arg("audition") fakeaudition?: CreateAuditionDTO,
        @Arg("projectId") audition?: string,
    ): Promise<Audition> {
        const newAudition = await this.auditionService.create(audition, fakeaudition);
        // @ts-ignore
        audition.audition.cloneAuditions.map(async (auditionId: string) => {
            const auditionToClone = await this.auditionService.findOne(auditionId, ["talent"]);
            return auditionToClone.talent.filter((talent: any) => {
                return talent.decision === "on_hold" || talent.decision === "callback";
            }).map(async (filtered: any) => {
                return await this.auditionService.addTalentToAudition(newAudition.id, filtered.user.id);
            });
        });
        return newAudition;
    }

    @Mutation(() => Audition)
    async respondToAuditionInvite(
        @Args() {email, responseCode, response, answerToQuestions}: RespondToAuditionDTO,
    ): Promise<AuditionTalentInstance> {
        const answers = JSON.parse(answerToQuestions as unknown as string);
        const promises = answers.map((answer: any) => {
            return this.auditionService.saveAnswerToAuditionQuestion(answer);
        });
        await Promise.all(promises);
        return await this.auditionService.respondToAuditionInvite(email, responseCode, response);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Audition)
    async closeAudition(@Args() {auditionId}: GetAuditionDTO) {
        await this.auditionService.update(auditionId, {open: false});
        const audition = await this.auditionService.findOne(auditionId);
        const cast = audition.talent.filter((talent: any) => {
            return !(["on_hold", "callback", "no_thanks"].includes(talent.decision));
        }).map(async (filtered: any) => {
            if (!filtered.decision) {
                return Promise.resolve(null);
            }
            return await this.roleService.castRole(filtered.decision, filtered.user.id);
        });

        const reject = audition.talent.filter((talent: any) => {
            return talent.decision === "no_thanks";
        }).map(async (filtered: any) => {
            // @ts-ignore
            return await this.projectService.addRejection(audition.project.id, filtered.user.id);
        });
        await Promise.all([...cast, ...reject]);
        return audition;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Audition)
    async deleteAudition(@Args() {auditionId}: GetAuditionDTO) {
        return await this.auditionService.delete(auditionId);
    }

    @Mutation(() => Boolean, {nullable: true})
    async checkIn(
        @Args() {status, instanceId}: AuditionCheckInDTO,
    ) {
        await this.auditionService.updateInstance(instanceId, {status});
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async updateTalentInstance(
        @Args() {decision, instanceId}: AuditionInstanceDTO,
    ) {
        await this.auditionService.updateInstance(instanceId, {decision});
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => AuditionTalentInstance)
    async inviteToAudition(
        @Args() {auditionId, userId, timeSlotId, projectId, users}: InviteToAuditionDTO,
    ) {
        if (users) {
            let instance = null;
            for (const id of users) {
                const user = await this.userService.findById(id, [], ["displayName", "email", "id"]);
                instance = await this.auditionService.findInstanceBy({audition: auditionId, user});
                if (!instance) {
                    instance = await this.auditionService.addTalentToAudition(auditionId, user, timeSlotId);
                }
                if (timeSlotId) {
                    await this.auditionTimeSlotService.addTalentToTimeSlot(timeSlotId, instance.id);
                    const audition = await this.auditionService.findOne(auditionId, []);
                    await auditionInvite(user.email, projectId, audition, instance.responseCode);
                }
            }
            return instance;
        }
        try {
            const user = await this.userService.findById(userId, [], ["displayName", "email", "id"]);
            let instance = await this.auditionService.findInstanceBy({audition: auditionId, user});
            if (!instance) {
                instance = await this.auditionService.addTalentToAudition(auditionId, user, timeSlotId);
            }
            if (timeSlotId) {
                await this.auditionTimeSlotService.addTalentToTimeSlot(timeSlotId, instance.id);
                const audition = await this.auditionService.findOne(auditionId, []);
                await auditionInvite(user.email, projectId, audition, instance.responseCode);
            }

            return instance;
        } catch (e) {
            throw new Error("User cannot be invited to this timeslot.");
        }

    }

    async getProfilePhotoForUser(user: User) {
        try {
            const urls = user.profileImages.map(async (img: any) => {
                return await this.s3Service.getUrlForObject(img.s3Key).then((url) => {
                    return {
                        url,
                        s3Key: img.s3Key,
                    };
                });
            });
            const profilePic = (user.profilePicture && user.profilePicture.s3Key) || (user.profileImages[0] && user.profileImages[0].s3Key) || "";
            if (!profilePic) {
                return {
                    ...user,
                    profileImages: [],
                };
            }

            const profilePicture = await this.s3Service.getUrlForObject(profilePic).then((url) => {
                if (!url) {
                    return {
                        url: "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg",
                    };
                } else {
                    return {
                        url,
                        s3Key: profilePic,
                    };
                }
            });
            const resolvedUrls = await Promise.all(urls);
            return {
                ...user,
                profileImages: resolvedUrls,
                profilePicture: {
                    url: "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg",
                    ...profilePicture,
                },
            };
        } catch (e) {throw new Error(e.message);
        }

    }
}
