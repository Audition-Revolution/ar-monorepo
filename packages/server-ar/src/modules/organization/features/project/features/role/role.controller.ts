import {Body, Controller, Delete, Param, Post, Put, Req, Res, UseGuards} from "@nestjs/common";
import {RoleService} from "./role.service";
import {DeleteResult} from "typeorm";
import {ApiUseTags} from "@nestjs/swagger";
import {BreakdownService} from "../../../../../common/breakdown/breakdown.service";
import {AuthGuard} from "@nestjs/passport";
import {S3Service} from "../../../../../s3/s3.service";
import {ProjectRole} from "../../ProjectRole.entity";

@ApiUseTags("Project Roles")
@Controller("api/v1/projects/:projectId/roles")
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
        private readonly breakdownService: BreakdownService,
        private readonly s3Service: S3Service,
    ) {
    }

    @Post()
    async createRole(@Param() params, @Body() body): Promise<ProjectRole> {
        const {projectId} = params;
        const {roleSearchCriteria, ...newRole} = body;
        const savedRole = await this.roleService.create(projectId, newRole);
        await this.breakdownService.addRoleBreakdown(body.searchCriteria, savedRole);
        return savedRole;
    }

    @Put(":id")
    async update(@Param() params, @Body() body): Promise<ProjectRole> {
        return await this.roleService.update(params.id, body);
    }

    @Put(":id/cast")
    async castRole(@Param() params, @Body() body): Promise<ProjectRole> {
        return await this.roleService.castRole(params.id, body.userId);
    }

    @Put(":id/document")
    @UseGuards(AuthGuard("jwt"))
    async addDocumentToRole(@Req() req, @Res() res, @Param() params): Promise<ProjectRole> {
        return await this.s3Service.auditionCollateralUpload(params.id, req, res);
    }

    @Delete(":id")
    async delete(@Param() params): Promise<DeleteResult> {
        return await this.roleService.delete(params.id);
    }
}
