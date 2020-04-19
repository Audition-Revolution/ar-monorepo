import {Field, InputType} from "type-graphql";

@InputType()
export class CreateNoteDTO {
    @Field({nullable: true})
    owner?: string;
    @Field()
    text: string;
    @Field()
    for: string;
    @Field()
    audition: string;
}
