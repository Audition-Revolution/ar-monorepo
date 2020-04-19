import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {S3Service} from "../s3/s3.service";
import {S3Module} from "../s3/s3.module";
import {BreakdownService} from "../common/breakdown/breakdown.service";
import {BreakdownModule} from "../common/breakdown/breakdown.module";
import {UserSearchService} from "./userSearch.service";
import {UserResolver} from "./user.resolver";
import {SpecialSkill} from "./SpecialSkills.entity";
import {ActorTag} from "./features/actor-tag/ActorTag.entity";
import {ActorNote} from "./features/actor-note/ActorNote.entity";
import {
    CommercialExperience,
    FilmExperience,
    MusicalTheatreExperience,
    OperaExperience,
    TelevisionExperience,
    TheatreExperience,
} from "./Experience.entity";
import {Training} from "./Training.entity";
import {UserImage} from "./UserImage.entity";
import {BreakdownAttribute} from "../common/breakdown/BreakdownAttribute.entity";
import {AuditionCollateral} from "../organization/features/project/features/audition/AuditionCollateral.entity";
import {User} from "./User.entity";

const Entities = TypeOrmModule.forFeature([
    User, TheatreExperience, MusicalTheatreExperience,
    OperaExperience, FilmExperience, TelevisionExperience,
    CommercialExperience, UserImage, BreakdownAttribute, AuditionCollateral,
    SpecialSkill, Training, ActorTag, ActorNote,
]);

@Module({
    imports: [
        Entities, S3Module, BreakdownModule],
    providers: [S3Service, UserService, UserSearchService, BreakdownService, UserResolver],
    controllers: [UserController],
    exports: [Entities, UserService, UserSearchService, BreakdownService],
})
export class UserModule {
}
