import {BadRequestException, Injectable, UnprocessableEntityException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import ProjectRejectedUser from "./ProjectRejectedUser.entity";
import {Project} from "./Project.entity";
import {User} from "../../../user/User.entity";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(ProjectRejectedUser)
        private readonly prUserRepo: Repository<ProjectRejectedUser>,
    ) {
    }

    async findAll(organizationId?: string): Promise<Project[]> {
        try {
            return await this.projectRepo.find({
                where: {organization: organizationId},
                relations: ["auditions", "organization"],
            });
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async findOne(id: string): Promise<Project> {
        try {
            return await this.projectRepo.findOne(id, {
                relations: ["roles", "auditions", "rejected"],
            });
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async create(body: any): Promise<Project> {
        return await this.projectRepo.save({
            ...body,
            organization: body.organizationId,
        });
    }

    async update(id: string, updatedProject: Project): Promise<Project> {
        try {
            delete updatedProject.id;
            await this.projectRepo.update(id, updatedProject);
            return await this.projectRepo.findOne(id);
        } catch (err) {
            throw new UnprocessableEntityException();
        }
    }

    async addRejection(projectId: any, userId: string): Promise<any> {
        try {
            const project = await this.projectRepo.findOne(projectId);
            const user = await this.userRepo.findOne(userId);
            return await this.prUserRepo.save({
                user,
                project,
            });
        } catch (err) {
            throw new Error(err);
        }

    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.projectRepo.delete(id);
    }
}
