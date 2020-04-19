import {BadRequestException, Injectable, UnprocessableEntityException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {ProjectRole} from "../../ProjectRole.entity";
import {BreakdownService} from "../../../../../common/breakdown/breakdown.service";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(ProjectRole)
        private readonly projectRoleRepo: Repository<ProjectRole>,
    ) {
    }

    async findAll(id: string): Promise<any> {
        try {
            const roles = await this.projectRoleRepo.find({
                where: {project: id},
                relations: ["breakdown", "castTo"],
                order: {characterName: "ASC"},
            });
            const formatted = roles.map(role => ({
                ...role,
                breakdown: BreakdownService.formatBreakdown(role.breakdown),
            }));
            return formatted;
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async findOne(id: string): Promise<ProjectRole> {
        try {
            return await this.projectRoleRepo.findOne(id, {
                relations: ["collateral"],
            });
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async castRole(id: number, userId: any): Promise<ProjectRole> {
        try {
            await this.projectRoleRepo.update(id, {castTo: userId});
            return await this.projectRoleRepo.findOne(id);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async create(projectId: number, newRole: ProjectRole) {
        return await this.projectRoleRepo.save({
            project: projectId,
            ...newRole,
        });
    }

    async update(id: number, updatedProject: any): Promise<ProjectRole> {
        try {
            delete updatedProject.id;
            await this.projectRoleRepo.update(id, updatedProject);
            return await this.projectRoleRepo.findOne(id);
        } catch (err) {
            throw new UnprocessableEntityException();
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        try {
            return await this.projectRoleRepo.delete(id);
        } catch (err) {
            throw new UnprocessableEntityException();
        }
    }
}
