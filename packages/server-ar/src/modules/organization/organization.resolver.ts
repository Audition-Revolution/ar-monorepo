import {Args, Query, Resolver} from "@nestjs/graphql";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../common/guards/GqlAuthGuard";
import {GetOneOrganizationDTO} from "./types/organization.dto";
import {OrganizationService} from "./organization.service";
import {CurrentUser} from "../../common/decorators/CurrentUser.decorator";
import {ObjectType, Field} from "type-graphql";
import {Organization} from "./Organization.entity";
import {User} from "../user/User.entity";

@ObjectType()
class UserOrganizations {
    @Field(() => [Organization])
    owned: Organization[];

    @Field(() => [Organization])
    member: Organization[];
}

@Resolver(of => Organization)
export class OrganizationResolver {
    constructor(
        private readonly orgService: OrganizationService,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => UserOrganizations)
    async getAllOrganizationsForUser(@CurrentUser() user: User) {
        return await this.orgService.findAllForUser(user);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Organization)
    async getOneOrganization(@Args() {organizationId}: GetOneOrganizationDTO) {
        return await this.orgService.findOne(organizationId);
    }
}
