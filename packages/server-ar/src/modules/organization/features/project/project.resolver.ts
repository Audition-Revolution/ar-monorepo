import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../../../common/guards/GqlAuthGuard";
import {ProjectService} from "./project.service";
import {GetAllProjectsDTO, GetOneProjectDTO} from "./types/project.dto";
import {rejectionEmail} from "../../../../util/send_email";
import {InjectRepository} from "@nestjs/typeorm";
import ProjectRejectedUser from "./ProjectRejectedUser.entity";
import {In, Repository} from "typeorm";
import {Field, InputType} from "type-graphql";
import {Project} from "./Project.entity";

@InputType()
class CreateProjectDTO {
    @Field()
    name: string;
    @Field()
    writer: string;
    @Field()
    director: string;
    @Field()
    notes: string;
    @Field()
    performanceDateEnd: Date;
    @Field()
    performanceDateStart: Date;
    @Field()
    rehearsalDateEnd: Date;
    @Field()
    rehearsalDateStart: Date;
    @Field()
    shortName: string;
    @Field()
    summary: string;
    @Field()
    organizationId: string;
}

@Resolver(of => Project)
export class ProjectResolver {
    constructor(
        private readonly projectService: ProjectService,
        @InjectRepository(ProjectRejectedUser)
        private readonly prUserRepo: Repository<ProjectRejectedUser>,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Project])
    async getAllProjects(@Args() {organizationId}: GetAllProjectsDTO) {
        const projects = await this.projectService.findAll(organizationId);
        return projects;
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Project)
    async getOneProject(@Args() {projectId}: GetOneProjectDTO) {
        const project = await this.projectService.findOne(projectId);
        project.rejected = project.rejected.filter(r => r.user);
        return project;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Project)
    async createProject(@Args("data") data: CreateProjectDTO) {
        const project = await this.projectService.create(data);
        return project;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean)
    async deleteProject(@Args() {projectId}: GetOneProjectDTO) {
         await this.projectService.delete(projectId);
         return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean, {nullable: true})
    async sendRejectionEmails(@Args() {projectId}: GetOneProjectDTO) {
        const project = await this.projectService.findOne(projectId);
        const rejectionIds = project.rejected.map((rejection) => {
            if (!rejection.rejectionEmailSent) {
                rejectionEmail(rejection.user.email, rejection.project);
            }
            return rejection.user.id;
        });
        // @ts-ignore
        const prUsers = await this.prUserRepo.find({
            where: {
                userId: In(rejectionIds),
                projectId,
            },
        });
        prUsers.map((pr) => {
            pr.rejectionEmailSent = true;
            this.prUserRepo.save(pr);
        });

        return true;
    }
}
