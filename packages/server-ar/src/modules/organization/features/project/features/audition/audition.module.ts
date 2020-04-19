import {Module} from "@nestjs/common";
import {AuditionService} from "./audition.service";
import {AuditionController} from "./audition.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuditionTimeSlotService} from "./audition-time-slot/audition-time-slot.service";
import {AuditionTimeSlotModule} from "./audition-time-slot/audition-time-slot.module";
import {S3Service} from "../../../../../s3/s3.service";
import {S3Module} from "../../../../../s3/s3.module";
import {UserModule} from "../../../../../user/user.module";
import {UserService} from "../../../../../user/user.service";
import {AuditionResolver} from "./audition.resolver";
import {RoleModule} from "../role/role.module";
import {ProjectModule} from "../../project.module";
import {AuditionInstanceService} from "./auditionInstance.service";
import {AuditionInstanceResolver} from "./auditionInstance.resolver";
import {AuditionQuestionsService} from "./auditionQuestions.service";
import {AuditionTalentInstance} from "./AuditionTalentInstance.entity";
import {Audition} from "./Audition.entity";
import {UserImage} from "../../../../../user/UserImage.entity";
import {AuditionAnswers} from "./AuditionAnswer.entity";
import {AuditionQuestion} from "./AuditionQuestion.entity";
import {BreakdownAttribute} from "../../../../../common/breakdown/BreakdownAttribute.entity";
import {ProjectRole} from "../../ProjectRole.entity";
import {AuditionTimeSlot} from "./audition-time-slot/AuditionTimeSlot.entity";
import {AuditionCollateral} from "./AuditionCollateral.entity";

const Entities = TypeOrmModule.forFeature([ProjectRole, Audition, AuditionTalentInstance, AuditionAnswers, AuditionTimeSlot,
    UserImage, AuditionCollateral, AuditionQuestion, BreakdownAttribute]);

@Module({
    imports: [
        Entities, AuditionTimeSlotModule, S3Module,
        UserModule, RoleModule, ProjectModule,
    ],
    providers: [UserService, AuditionService, AuditionTimeSlotService,
        S3Service, AuditionResolver, AuditionInstanceService,
        AuditionInstanceResolver, AuditionQuestionsService],
    controllers: [AuditionController],
    exports: [Entities],
})
export class AuditionModule {
}
