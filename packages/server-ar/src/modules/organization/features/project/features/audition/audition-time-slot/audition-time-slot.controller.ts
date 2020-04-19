import {Body, Controller, Param, Put} from "@nestjs/common";
import {AuditionTimeSlotService} from "./audition-time-slot.service";
import {ApiUseTags} from "@nestjs/swagger";
import {AuditionTimeSlot} from "./AuditionTimeSlot.entity";

@ApiUseTags("Project Audition Time Slot")
@Controller("api/v1/projects/:projectId/audition/:auditionId/audition-time-slot")
export class AuditionTimeSlotController {
    constructor(
        private readonly timeSlotService: AuditionTimeSlotService,
    ) {
    }

    @Put("/:id/addTalent")
    async addTalentToTimeslot(@Param() params, @Body() body): Promise<AuditionTimeSlot> {
        return await this.timeSlotService.addTalentToTimeSlot(params.id, body.talentId);
    }

}
