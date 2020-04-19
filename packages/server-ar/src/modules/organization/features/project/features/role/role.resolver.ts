import {Args, Query, Resolver} from "@nestjs/graphql";
import {RoleService} from "./role.service";
import {BreakdownService} from "../../../../../common/breakdown/breakdown.service";
import {S3Service} from "../../../../../s3/s3.service";
import {UseGuards} from "@nestjs/common";
import {GetAllRolesDTO, GetOneRoleDTO} from "./types/role.dto";
import {GqlAuthGuard} from "../../../../../../common/guards/GqlAuthGuard";
import {ProjectRole} from "../../ProjectRole.entity";

@Resolver(of => ProjectRole)
export class RoleResolver {
    constructor(
        private readonly roleService: RoleService,
        private readonly breakdownService: BreakdownService,
        private readonly s3Service: S3Service,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ProjectRole])
    async getAllRoles(@Args() {projectId}: GetAllRolesDTO) {
        return await this.roleService.findAll(projectId);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => ProjectRole)
    async getRole(@Args() {roleId}: GetOneRoleDTO) {
        const role = await this.roleService.findOne(roleId);
        const collateralPromises = role.collateral.map((c: any) => {
            return this.s3Service.getUrlForObject(c.s3Key).then((url: string) => ({
                url,
                key: c.s3Key,
            }));
        });
        const collateral = await Promise.all(collateralPromises) as any;
        role.collateral = collateral;
        return role;
    }

    // @UseGuards(GqlAuthGuard)
    // @Query(() => Project)
    // async getOneProject(@Args() {projectId}: GetOneProjectDTO) {
    //     return await this.projectService.findOne(projectId);
    // }

    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => ProjectRole)
    // async addDocumentToRole(
    //     @Arg('picture', () => GraphQLUpload) picture: Upload
    //     // @Args('project') project: CreateProjectDTO,
    // ): Promise<ProjectRole> {
    //     return await this.s3Service.auditionCollateralUpload(params.id, req, res);
    // }

    // @UseGuards(GqlAuthGuard)
    // @Query(() => [Audition])
    // async searchForAuditions(@Args() {query}: SearchAuditionDTO) {
    //     return await this.auditionService.search(query);
    // }
    //
    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => Audition)
    // async createAudition(
    //     @Arg('audition') audition?: CreateAuditionDTO,
    //     @Arg('projectId') projectId?: string
    // ): Promise<Audition> {
    //     return await this.auditionService.create(projectId, audition);
    // }
    //
    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => Audition)
    // async deleteAudition(@Args() {auditionId}: GetAuditionDTO) {
    //     return await this.auditionService.delete(auditionId);
    // }
    //
    // @UseGuards(GqlAuthGuard)
    // @Mutation(() => ActorNote)
    // async updateTalentInstance(
    //     @Arg('instanceId') instanceId: string,
    //     @Arg('instance') instance: AuditionInstanceDTO,
    // ) {
    //     return await this.auditionService.updateInstance(instanceId, instance);
    // }
}
