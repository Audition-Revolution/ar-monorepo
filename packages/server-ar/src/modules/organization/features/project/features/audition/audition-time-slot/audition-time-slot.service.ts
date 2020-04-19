import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateTimeSlotDTO} from "./types/audition-time-slot.types";
import {AuditionTimeSlot} from "./AuditionTimeSlot.entity";
import {AuditionTalentInstance} from "../AuditionTalentInstance.entity";

@Injectable()
export class AuditionTimeSlotService {
    constructor(
        @InjectRepository(AuditionTimeSlot)
        private readonly timeSlotRepo: Repository<AuditionTimeSlot>,
        @InjectRepository(AuditionTalentInstance)
        private readonly auditionTalentInstance: Repository<AuditionTalentInstance>,
    ) {
    }

    async findForAudition(auditionId: string): Promise<AuditionTimeSlot[]> {
        return await this.timeSlotRepo.find({
            where: {audition: auditionId},
        });
    }

    async createTimeSlot(auditionId: string, timeSlot: CreateTimeSlotDTO) {
        const existingTimeSlots = await this.findForAudition(auditionId);
        // Check is timeslot being created overlaps with any existing timeslots
        // REQUEST, ALLOW OVERRIDING TIMESLOTS.
        // const overlaps = existingTimeSlots.filter(existing => {
        //     return areIntervalsOverlapping({
        //         start: timeSlot.startTime,
        //         end: timeSlot.endTime,
        //     }, {
        //         start: existing.startTime,
        //         end: existing.endTime,
        //     });
        // });
        //
        // if (overlaps.length) {
        //     const start = format(timeSlot.startTime, 'hh:mm');
        //     const end = format(timeSlot.endTime, 'hh:mm a');
        //     throw new Error(`TimeSlot ${start}-${end} Overlaps with Existing Time`);
        // }
        return await this.timeSlotRepo.save({
            audition: auditionId,
            ...timeSlot,
            capacity: parseInt(timeSlot.capacity as unknown as string, 10),
        });
    }

    async deleteTimeSlot(auditionId: string, timeSlotId: string) {
        return await this.timeSlotRepo.delete({
            audition: auditionId,
            id: timeSlotId,
        });
    }

    async addTalentToTimeSlot(timeSlotId: string, instanceId: string) {
        const ts = await this.timeSlotRepo.findOne({id: timeSlotId}, {relations: ["talent"]});
        if (ts.capacity > ts.talent.length) {
            const instance = await this.auditionTalentInstance.findOne(instanceId);
            ts.talent.push(instance);
            return await this.timeSlotRepo.save(ts);
        } else if (ts.capacity === 1) {
            const instance = await this.auditionTalentInstance.findOne(instanceId);
            ts.talent = [instance];
            return await this.timeSlotRepo.save(ts, {chunk: 10});
        } else {
            throw new Error("Maximum capacity has been reached for this time slot");
        }

    }

    async removeTalentFromTimeSlot(timeSlotId: string) {
        const ts = await this.timeSlotRepo.findOne({id: timeSlotId});
        const id = ts.talent.id;
        ts.talent = null;
        await this.timeSlotRepo.save(ts);
        await this.auditionTalentInstance.delete(id);
        return {status: "Succerss"};
    }
}
