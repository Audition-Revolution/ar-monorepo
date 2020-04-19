import {Module} from "@nestjs/common";
import {Connection} from "typeorm";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrganizationModule} from "./modules/organization/organization.module";
import {ProjectModule} from "./modules/organization/features/project/project.module";
import {RoleModule} from "./modules/organization/features/project/features/role/role.module";
import {AuditionModule} from "./modules/organization/features/project/features/audition/audition.module";
import {AuditionTimeSlotModule} from "./modules/organization/features/project/features/audition/audition-time-slot/audition-time-slot.module";
import {UserModule} from "./modules/user/user.module";
import DbConfig from "../ormconfig";
import {PassportModule} from "@nestjs/passport";
import {ActorNoteModule} from "./modules/user/features/actor-note/ActorNote.module";
import {BreakdownModule} from "./modules/common/breakdown/breakdown.module";
import {S3Module} from "./modules/s3/s3.module";
import {GenericController} from "./app.controller";
import {GraphQLModule} from "@nestjs/graphql";
import {AuthModule} from "./auth/auth.module";
import {ActorTagModule} from "./modules/user/features/actor-tag/ActorTag.module";
import {Project} from "./modules/organization/features/project/Project.entity";

@Module({imports: [], controllers: [GenericController]})
export class StaticModule {
}

@Module({
    imports: [
        GraphQLModule.forRoot({
            debug: true,
            playground: true,
            autoSchemaFile: "schema.gql",
            context: ({ req }) => ({ req }),
        }),
        TypeOrmModule.forRoot(DbConfig),
        TypeOrmModule.forFeature([Project]),
        UserModule,
        PassportModule,
        AuthModule,
        AuditionModule,
        OrganizationModule,
        ProjectModule,
        RoleModule,
        AuditionTimeSlotModule,
        StaticModule,
        BreakdownModule,
        S3Module,
        ActorNoteModule,
        ActorTagModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
