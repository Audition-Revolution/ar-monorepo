import { Module } from "@nestjs/common";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import {UserModule} from "../user/user.module";
import {OrganizationResolver} from "./organization.resolver";
import {Organization} from "./Organization.entity";
import {User} from "../user/User.entity";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Organization, User])],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService],
})
export class OrganizationModule {}
