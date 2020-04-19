import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AuditionTalentInstance} from "./AuditionTalentInstance.entity";

@Injectable()
export class AuditionInstanceService {
    constructor(
        @InjectRepository(AuditionTalentInstance)
        private readonly talentInstanceRepo: Repository<AuditionTalentInstance>,
    ) {
    }

    async getInstance(instanceId: string): Promise<AuditionTalentInstance> {
        const instance = await this.talentInstanceRepo.findOne(instanceId, {relations: ["audition", "timeSlot"]});
        return instance;
    }

}
