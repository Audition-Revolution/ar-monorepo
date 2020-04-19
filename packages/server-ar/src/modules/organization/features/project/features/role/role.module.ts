import {Module} from "@nestjs/common";
import {RoleController} from "./role.controller";
import {RoleService} from "./role.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BreakdownModule} from "../../../../../common/breakdown/breakdown.module";
import {BreakdownService} from "../../../../../common/breakdown/breakdown.service";
import {S3Module} from "../../../../../s3/s3.module";
import {S3Service} from "../../../../../s3/s3.service";
import {RoleResolver} from "./role.resolver";
import {ProjectRole} from "../../ProjectRole.entity";
import {BreakdownAttribute} from "../../../../../common/breakdown/BreakdownAttribute.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProjectRole, BreakdownAttribute]), BreakdownModule, S3Module],
    controllers: [RoleController],
    providers: [S3Service, BreakdownService, RoleService, RoleResolver],
    exports: [RoleService],
})
export class RoleModule {
}
