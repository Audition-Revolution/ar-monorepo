import { Module } from "@nestjs/common";
import { ActorTagResolver } from "./ActorTag.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ActorTag} from "./ActorTag.entity";
import {ActorTagService} from "./ActorTag.service";
import {S3Module} from "../../../s3/s3.module";
import {BreakdownAttribute} from "../../../common/breakdown/BreakdownAttribute.entity";
import {User} from "../../User.entity";

const Entities = TypeOrmModule.forFeature([User, BreakdownAttribute, ActorTag]);
@Module({
    imports: [Entities, S3Module],
    providers: [ActorTagService, ActorTagResolver],
})
export class ActorTagModule {}
