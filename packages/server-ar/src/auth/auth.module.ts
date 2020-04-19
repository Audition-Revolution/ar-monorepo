import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {UserModule} from "../modules/user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {UserService} from "../modules/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import {AuthResolver} from "./auth.resolver";
import {OrganizationModule} from "../modules/organization/organization.module";
import {
    CommercialExperience,
    FilmExperience,
    MusicalTheatreExperience,
    OperaExperience,
    TelevisionExperience,
    TheatreExperience,
} from "../modules/user/Experience.entity";
import {UserImage} from "../modules/user/UserImage.entity";
import {BreakdownAttribute} from "../modules/common/breakdown/BreakdownAttribute.entity";
import {User} from "../modules/user/User.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, TheatreExperience, MusicalTheatreExperience,
            OperaExperience, FilmExperience, TelevisionExperience,
            CommercialExperience, UserImage, BreakdownAttribute,
        ]),
        UserModule,
        PassportModule.register({
            defaultStrategy: "jwt",
        }),
        JwtModule.register({
            secret: "suuperDuperSecret",
        }),
        OrganizationModule,
    ],
    controllers: [AuthController],
    providers: [UserService, AuthService, JwtStrategy, AuthResolver],
    exports: [PassportModule, AuthService],
})
export class AuthModule {}
