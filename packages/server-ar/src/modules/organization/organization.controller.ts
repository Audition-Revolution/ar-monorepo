import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";
import {OrganizationService} from "./organization.service";
import {ApiUseTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {Organization} from "./Organization.entity";
import {User} from "../user/User.entity";

@ApiUseTags("Organizations")
@Controller("api/v1/organizations")
export class OrganizationController {
    constructor(
        private readonly orgService: OrganizationService,
    ) {
    }

    @Get("/all")
    @UseGuards(AuthGuard("jwt"))
    async findAll(@Req() request: Request): Promise<Organization[]> {
        return await this.orgService.findAll();
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async findAllForUser(@Req() request: Request & {user: any}): Promise<Organization[]> {
        return await this.orgService.findAllForUser(request.user);
    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async create(@Body() body: Organization, @Req() request: Request & {user: User}): Promise<Organization> {
        return await this.orgService.create(body, request.user);
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async findOne(@Param("id") id: number): Promise<Organization> {
        return await this.orgService.findOne(id);
    }

    @Put(":id")
    @UseGuards(AuthGuard("jwt"))
    async update(@Param("id") id: number, @Body() body: Organization): Promise<Organization> {
        return await this.orgService.update(id, body);
    }

    @Put(":id/member")
    @UseGuards(AuthGuard("jwt"))
    async addMemberToOrganization(@Param("id") id: string, @Body() body: any, @Req() request): Promise<Organization> {
        return await this.orgService.addMember(id, request.user.id, body.memberId);
    }

    @Put(":id/removeMember")
    @UseGuards(AuthGuard("jwt"))
    async removeMemberFromOrganization(@Param("id") id: string, @Body() body: any, @Req() request): Promise<Organization> {
        return await this.orgService.removeMember(id, request.user.id, body.memberId);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: number): Promise<any> {
        await this.orgService.delete(id);
        return {
            message: "Success",
        };
    }
}
