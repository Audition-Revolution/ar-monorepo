import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from "@nestjs/common";
import {ProjectService} from "./project.service";
import {ApiUseTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {Project} from "./Project.entity";

@ApiUseTags("Projects")
@Controller("api/v1/projects")
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard())
    async findAll(@Param() params): Promise<Project[]> {
        return await this.projectService.findAll();
    }

    @Post()
    async create(@Body() body: Project): Promise<Project> {
        const newProject = await this.projectService.create(body);
        return newProject;
    }

    @Get(":id")
    async findOne(@Param() params): Promise<Project> {
        return await this.projectService.findOne(params.id);
    }

    @Put(":id")
    async update(@Param() params, @Body() body): Promise<Project> {
        return await this.projectService.update(params.id, body);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<any> {
        await this.projectService.delete(id);
        return {
            message: "Success",
        };
    }
}
