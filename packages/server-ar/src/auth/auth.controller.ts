import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {LoginUserDto} from "./types/loginUser.dto";
import {OrganizationService} from "../modules/organization/organization.service";
import {newOrganizationEmail, sendUserRegistrationEmail} from "../util/send_email";
import {UserService} from "../modules/user/user.service";
import {User, UserType} from "../modules/user/User.entity";
import {Organization} from "../modules/organization/Organization.entity";

interface RegisterCompanyBody {
    user: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        city: string;
        state: string;
    };
    company: {
        name: string;
        type: "nonprofit" | "forProfit" | "filmAndTelevision" | "talentAgency"
        city: string;
        state: string;
        ein
    };
}

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly orgService: OrganizationService,
    ) {
    }

    @Post("login")
    async login(@Body() user: LoginUserDto, @Res() res): Promise<any> {
        const loggedInUser = await this.authService.login(user);
        res.status(loggedInUser.status).send(loggedInUser);
    }

    @Post("register")
    async register(@Res() res, @Body() user: User): Promise<any> {
        try {
            user.displayName = `${user.firstName} ${user.lastName}`;
            const saved = await this.authService.register(user);
            sendUserRegistrationEmail(user.email, `${saved.firstName} ${saved.lastName}`, saved.id);
            const loggedInUser = await this.authService.login(user as LoginUserDto);
            res.status(loggedInUser.status).send(loggedInUser);
        } catch (err) {
            res.status(409).send({message: err.message});
        }

    }

    @Get("/verify/:id")
    async verify(@Param("id") id, @Res() res) {
        await this.authService.verify(id);
        res.redirect("https://app.auditionrevolution.com");
    }

    @Post("register-company")
    async registerCompany(@Res() res, @Body() body: RegisterCompanyBody): Promise<any> {
        const user: Partial<User> = body.user;
        user.displayName = `${user.firstName} ${user.lastName}`;
        user.userType = [UserType.theatre];
        user.theatreVerified = false;
        try {
            await this.authService.register(user);
            const loggedInUser = await this.authService.login(user as LoginUserDto);
            const org: Partial<Organization> = {
                name: body.company.name,
                address: `${body.company.city}, ${body.company.state}`,
                irsStatus: body.company.type,
                ein: body.company.ein,
            };
            const savedOrg = await this.orgService.create(org, loggedInUser.userId);
            newOrganizationEmail(user, body.company);
            res.status(loggedInUser.status).send(loggedInUser);
        } catch (err) {
            res.status(500).send({message: "Server Error: User Already Exists"});
        }

    }

    @Get("token")
    async createToken(): Promise<any> {
        return await this.authService.createToken();
    }

    @Post("passwordReset")
    async passwordReset(@Body() body): Promise<any> {
        try {
            return await this.authService.sendPasswordReset(body.email);
        } catch (e) {
            throw new BadRequestException();
        }
    }

    @Post("passwordReset/:token")
    async saveNewPassword(@Body() body, @Param("token") token, @Query("resetPasswordExpires") expires): Promise<any> {
        try {
            return await this.authService.setNewPassword(token, expires, body.password);
        } catch (e) {
            throw new HttpException("Token Expired", HttpStatus.UNAUTHORIZED);
        }
    }

    @Get("resendVerification")
    @UseGuards(AuthGuard())
    async resendVerification(@Req() request) {
        const user = await this.userService.findById(request.user.id);
        sendUserRegistrationEmail(user.email, `${user.firstName} ${user.lastName}`, user.id);
        return user;
    }

    @Get("tokenCheck")
    @UseGuards(AuthGuard())
    findAll(@Req() request) {
        const {password, salt, ...user} = request.user;
        return user;
    }
}
