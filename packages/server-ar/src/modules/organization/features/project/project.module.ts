import {Module} from "@nestjs/common";
import {ProjectService} from "./project.service";
import {ProjectController} from "./project.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProjectResolver} from "./project.resolver";
import {UserModule} from "../../../user/user.module";
import ProjectRejectedUser from "./ProjectRejectedUser.entity";
import {Project} from "./Project.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectRejectedUser]), UserModule],
    providers: [ProjectService, ProjectResolver],
    controllers: [ProjectController],
    exports: [ProjectService],
})
export class ProjectModule {
}
