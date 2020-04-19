import {ArgsType, Field} from "type-graphql";

@ArgsType()
export class GetOneOrganizationDTO {
    @Field()
    organizationId: string;
}
