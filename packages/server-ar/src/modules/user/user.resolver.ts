import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {UserService} from "./user.service";
import {UseGuards} from "@nestjs/common";
import {ArgsType, Field, InputType} from "type-graphql";
import {GqlAuthGuard} from "../../common/guards/GqlAuthGuard";
import {BreakdownService} from "../common/breakdown/breakdown.service";
import {S3Service} from "../s3/s3.service";
import {CurrentUser} from "../../common/decorators/CurrentUser.decorator";
import {ExperienceType, User} from "./User.entity";
import {Experience, TheatreExperience} from "./Experience.entity";

@InputType("ExperienceOrder")
export class ExperienceOrder {
    @Field()
    id: string;
    @Field()
    index: number;
}

@ArgsType()
export class AddSkillDTO {
    @Field()
    type: "skill" | "training";
    @Field({nullable: true})
    text?: string;

    @Field(() => [ExperienceOrder], {nullable: true})
    skillOrder?: ExperienceOrder[];
}

@ArgsType()
export class ExperienceOrderDTO {
    @Field(() => [ExperienceType], {nullable: true})
    newExperiences: ExperienceType[];

    @Field(() => [String], {nullable: true})
    order: string[];
}

@ArgsType()
export class ProfileImageDTO {
    @Field()
    key: string;
}

@ArgsType()
export class GetUserDTO {
    @Field()
    id: string;
}

@InputType()
class ReorderExperienceDTO {
    @Field()
    experienceType: string;

    @Field(() => [ExperienceOrder], {nullable: true})
    experienceOrder: ExperienceOrder[];

    @Field({nullable: true})
    userId: string;
}
@InputType()
class UserDataDTO {
    @Field({nullable: true})
    firstName: string;
    @Field({nullable: true})
    lastName: string;
    @Field({nullable: true})
    city: string;
    @Field({nullable: true})
    state: string;
    @Field({nullable: true})
    website: string;
    @Field({nullable: true})
    representation: string;
    @Field({nullable: true})
    gender: string;
    @Field({nullable: true})
    phoneNumber: string;
    @Field({nullable: true})
    heightInches: number;
    @Field({nullable: true})
    eyeColor: string;
    @Field({nullable: true})
    hairColor: string;
}

@InputType()
class AddExperienceDTO {
    @Field()
    experienceType: string;

    @Field({nullable: true})
    experienceId: string;

    @Field({nullable: true})
    experience: Experience;
}

@Resolver(of => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly s3Service: S3Service,
    ) {
    }

    @Query(() => User)
    async getUser(@Args() {id}: GetUserDTO) {
        const user = await this.userService.findById(id as any);
        return await this.getProfilePhotoForUser(user);
    }

    @Query(() => User)
    async getActor(@Args() {id}: GetUserDTO) {
        const user = await this.userService.findById(id as any, ["profileImages", "profilePicture"]);
        return await this.getProfilePhotoForUser(user, false);
    }

    @Query(() => User)
    async getInstances(@Args() {id}: GetUserDTO) {
        const user = await this.userService.findById(id as any, ["instances",
            "instances.timeSlot", "instances.audition",
            "instances.audition.project", "notifications",
        ]);
        return await this.getProfilePhotoForUser(user, false);
    }

    @Query(() => User)
    async getNotifications(@Args() {id}: GetUserDTO) {
        const user = await this.userService.findById(id as any, ["notifications"]);
        return await this.getProfilePhotoForUser(user, false);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [TheatreExperience], {nullable: true})
    async getExperience(@Args("data") {experienceType, userId}: ReorderExperienceDTO, @CurrentUser() user) {
        return await this.userService.getExperience(experienceType, userId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async updateUser(@Args("data") userData: UserDataDTO, @CurrentUser() user) {
        try {
            await this.userService.update(user.id, userData as any as User);
            return true;
        } catch (err) {
            throw new Error(err);
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async addExperience(@Args("data") {experienceType, experience}: AddExperienceDTO, @CurrentUser() user) {
        try {
            await this.userService.addExperience(experienceType, experience, user.id);
            return true;
        } catch (err) {
            throw new Error(err);
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async reorderExperience(@Args("data") {experienceType, experienceOrder}: ReorderExperienceDTO, @CurrentUser() user) {
        await this.userService.reorderExperience(experienceType, experienceOrder);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async removeExperience(@Args("data") {experienceType, experienceId}: AddExperienceDTO, @CurrentUser() user) {
        await this.userService.removeExperience(experienceType, experienceId);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async setProfile(@Args() {key}: ProfileImageDTO, @CurrentUser() user) {
        await this.userService.setProfilePhoto(key, user);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async deleteImage(@Args() {key}: ProfileImageDTO, @CurrentUser() user) {
        await this.userService.update(user.id, {profilePicture: undefined});
        await this.s3Service.deleteImage(key);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async changeExperienceOrder(@Args() {newExperiences}: ExperienceOrderDTO, @CurrentUser() user) {
        await this.userService.update(user.id, {experienceOrder: newExperiences});
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async moveSection(@Args() {order}: ExperienceOrderDTO, @CurrentUser() user) {
        await this.userService.update(user.id, {profileOrder: order as any});
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async addSkillOrTraining(@Args() {type, text}: AddSkillDTO, @CurrentUser() user) {
        await this.userService.addSkillOrTraining(type, text, user.id);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async removeSkillOrTraining(@Args() {type, text}: AddSkillDTO, @CurrentUser() user) {
        await this.userService.removeSkillOrTraining(type, text, user.id);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async reorderSkillOrTraining(@Args() {type, skillOrder}: AddSkillDTO, @CurrentUser() user) {
        await this.userService.reorderSkillOrTraining(type, skillOrder);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async addUserBreakdown(@Args() {key}: ProfileImageDTO, @CurrentUser() user) {
        await this.userService.update(user.id, {profilePicture: undefined});
        await this.s3Service.deleteImage(key);
        return true;
    }

    async getProfilePhotoForUser(user: User, buildBreakdown: boolean = true) {
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
                breakdown: buildBreakdown ? BreakdownService.formatBreakdown(user.breakdown) : {},
            };
        }

        const profilePicture = await this.s3Service.getUrlForObject(profilePic).then((url) => {
            return {
                url,
                s3Key: profilePic,
            };
        });
        const resolvedUrls = await Promise.all(urls);
        return {
            ...user,
            profileImages: resolvedUrls,
            profilePicture: {
                url: "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg",
                ...profilePicture,
            },
            breakdown: buildBreakdown ? BreakdownService.formatBreakdown(user.breakdown) : {},
        };
    }
}
