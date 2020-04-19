import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {UseFilters, UseGuards} from "@nestjs/common";
import {ArgsType, Field} from "type-graphql";
import {HttpExceptionFilter} from "../../../../../../common/filters/GqlExceptionsFilter";
import {AuditionInstanceService} from "./auditionInstance.service";
import {GqlAuthGuard} from "../../../../../../common/guards/GqlAuthGuard";
import {CurrentUser} from "../../../../../../common/decorators/CurrentUser.decorator";
import {AuditionQuestionsService} from "./auditionQuestions.service";
import {AuditionTalentInstance} from "./AuditionTalentInstance.entity";

@ArgsType()
class TimeSlotDTO {
    @Field()
    instanceId: string;
}

@ArgsType()
class NewAnswerDTO {
    @Field()
    text: string;
    @Field()
    answerId: string;
}

@UseFilters(new HttpExceptionFilter())
@Resolver(of => AuditionTalentInstance)
export class AuditionInstanceResolver {
    constructor(
        private readonly auditionInstanceService: AuditionInstanceService,
        private readonly auditionQuestionsService: AuditionQuestionsService,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => AuditionTalentInstance)
    async getInstance(@Args() {instanceId}: TimeSlotDTO, @CurrentUser() user) {
        try {
            const instance = await this.auditionInstanceService.getInstance(instanceId);
            const questions = await this.auditionQuestionsService.getAnswersWithQuestionsForAudition(instance.audition.id, user.id);
            return {...instance, questions};
        } catch (e) {
            throw new Error(e);
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean)
    async updateAnswer(@Args() {answerId, text}: NewAnswerDTO, @CurrentUser() user) {
        try {
            await this.auditionQuestionsService.updateAnswer(answerId, text);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
}
