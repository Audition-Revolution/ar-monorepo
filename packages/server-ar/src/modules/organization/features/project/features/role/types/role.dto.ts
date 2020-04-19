import {ArgsType, Field} from "type-graphql";

@ArgsType()
export class GetAllRolesDTO {
    @Field()
    projectId: string;
}

@ArgsType()
export class GetOneRoleDTO {
    @Field()
    roleId: string;
}

// @ArgsType()
// export class GetOneProjectDTO {
//     @Field()
//     projectId: string;
// }
//
// @ArgsType()
// export class CreateProjectDTO implements Partial<Project> {
//     @Field()
//     name: string;
// }
