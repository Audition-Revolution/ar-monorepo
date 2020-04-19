import {Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {ApiUseTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {S3Service} from "../s3/s3.service";
import {BreakdownService} from "../common/breakdown/breakdown.service";
import {UserSearchService} from "./userSearch.service";
import {User} from "./User.entity";

@ApiUseTags("Users")
@Controller("api/v1/users")
export class UserController {
    constructor(
        private readonly s3Service: S3Service,
        private readonly userService: UserService,
        private readonly userSearchService: UserSearchService,
        private readonly breakdownService: BreakdownService,
    ) {
    }

    @Get("/admins")
    async findAdmins() {
        return await this.userService.findArAdmins();
    }

    @Get("/search")
    @UseGuards(AuthGuard("jwt"))
    async searchUser(@Query() query, @Req() req) {
        const toParse = query.spec || false;
        const spec = toParse ? JSON.parse(toParse) : {};
        let users = [];
        if (query.type === "name") {
            users = await this.userSearchService.searchUser(query.value, spec, req.user.email);
        } else if (query.type === "experienceTalent") {
            users = await this.userSearchService.searchKeyword(query.value, spec);
        }  else if (query.type === "tag") {
            users = await this.userSearchService.searchTag(query.value, req.user.id);
        }
        return users;
    }

    @Get("/search/:query")
    async searchUserByName(@Param() params): Promise<User[]> {
        return await this.userService.searchUserByName(params.query);
    }

    @Post("/me/image")
    @UseGuards(AuthGuard("jwt"))
    async uploadImage(@Req() req, @Res() res) {
        return await this.s3Service.userImageUpload(req, res);
    }

    @Post("/me/breakdown")
    @UseGuards(AuthGuard("jwt"))
    async addBreakdowns(@Body() body, @Req() req) {
        return await this.breakdownService.addUserBreakdown(body, req.user);
    }

}
