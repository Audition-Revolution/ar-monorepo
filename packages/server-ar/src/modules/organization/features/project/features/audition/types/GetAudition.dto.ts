import {ArgsType, Field, InputType} from "type-graphql";
import {AuditionAnswers} from "../AuditionAnswer.entity";
import {AUDITION_DECISION, TALENT_INSTANCE_STATUS} from "../AuditionTalentInstance.entity";

@ArgsType()
export class SearchAuditionDTO {
    @Field()
    query: string;
}

@ArgsType()
export class GetAuditionsForProjectDTO {
    @Field()
    projectId: string;
}

@ArgsType()
export class GetAuditionDTO {
    @Field()
    auditionId: string;
}

@InputType()
class AnswerToQuestions implements Partial<AuditionAnswers> {
    @Field()
    questionId: string;
    @Field()
    text: string;
    @Field()
    userId: string;
}

@ArgsType()
export class RespondToAuditionDTO {
    @Field()
    email: string;
    @Field()
    responseCode: string;
    @Field()
    response: string;
    @Field(() => [String])
    answerToQuestions: string[];
}

@InputType()
export class CreateAuditionDTO {
    @Field()
    name: string;

    @Field()
    auditionType: string;

    @Field({nullable: true})
    requirementSummary: string;

    @Field()
    lat: number;

    @Field()
    long: number;

    @Field()
    address: string;

    @Field()
    startDate: Date;

    @Field()
    description: string;

    @Field()
    private: boolean;

    @Field({nullable: true})
    prep: string;

    @Field(() => [String])
    forRoles: string[];

    @Field(() => [String])
    questions: string[];

    @Field(() => [String])
    cloneAuditions: string[];
}

@ArgsType()
export class AuditionCheckInDTO {
    @Field({nullable: true})
    status: TALENT_INSTANCE_STATUS;

    @Field({nullable: true})
    instanceId: string;
}

@ArgsType()
export class AuditionInstanceDTO {
    @Field({nullable: true})
    decision: AUDITION_DECISION;

    @Field({nullable: true})
    instanceId: string;
}
