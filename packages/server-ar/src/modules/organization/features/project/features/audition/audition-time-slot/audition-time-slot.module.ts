import {Module} from "@nestjs/common";
import {AuditionTimeSlotService} from "./audition-time-slot.service";
import {AuditionTimeSlotController} from "./audition-time-slot.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuditionTimeSlotResolver} from "./audition-time-slot.resolver";
import {AuditionTalentInstance} from "../AuditionTalentInstance.entity";
import {AuditionTimeSlot} from "./AuditionTimeSlot.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AuditionTimeSlot, AuditionTalentInstance])],
    providers: [AuditionTimeSlotService, AuditionTimeSlotResolver],
    controllers: [AuditionTimeSlotController],
    exports: [AuditionTimeSlotService],
})
export class AuditionTimeSlotModule {
}
