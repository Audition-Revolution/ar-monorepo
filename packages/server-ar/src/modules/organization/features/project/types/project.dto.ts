import {ArgsType, Field} from "type-graphql";
import {Project} from "../Project.entity";

@ArgsType()
export class GetAllProjectsDTO {
    @Field()
    organizationId: string;
}

@ArgsType()
export class GetOneProjectDTO {
    @Field()
    projectId: string;
}

@ArgsType()
export class CreateProjectDTO implements Partial<Project> {
    @Field()
    name: string;
}
