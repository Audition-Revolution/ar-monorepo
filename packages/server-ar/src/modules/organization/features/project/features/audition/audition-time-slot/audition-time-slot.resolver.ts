import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {UseFilters, UseGuards} from "@nestjs/common";
import {GqlAuthGuard} from "../../../../../../../common/guards/GqlAuthGuard";
import {AuditionTimeSlotService} from "./audition-time-slot.service";
import {CreateTimeSlotDTO, DeleteTimeSlotDTO} from "./types/audition-time-slot.types";
import {HttpExceptionFilter} from "../../../../../../../common/filters/GqlExceptionsFilter";
import {AuditionTimeSlot} from "./AuditionTimeSlot.entity";

@UseFilters(new HttpExceptionFilter())
@Resolver(of => AuditionTimeSlot)
export class AuditionTimeSlotResolver {
    constructor(
        private readonly timeSlotService: AuditionTimeSlotService,
    ) {
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean)
    async deleteTimeSlot(@Args("data") {id, auditionId}: DeleteTimeSlotDTO) {
        await this.timeSlotService.deleteTimeSlot(auditionId, id);
        return true;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean)
    async removeTalentFromTimeSlot(@Args("data") {id}: DeleteTimeSlotDTO) {
        await this.timeSlotService.removeTalentFromTimeSlot(id);
        return true;
    }

    // TODO: WE NEED TO FIND A WAY TO DIFF THE TIME SLOTS
    @UseGuards(GqlAuthGuard)
    @Mutation(() => AuditionTimeSlot)
    async createTimeslot(@Args("data") data: CreateTimeSlotDTO) {
        return await this.timeSlotService.createTimeSlot(data.auditionId, data);
    }

}
