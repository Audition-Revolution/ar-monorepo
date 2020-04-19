import {ArgsType, Field} from "type-graphql";

@ArgsType()
export class GetNotesDTO {
    @Field()
    actorId: string;
}
